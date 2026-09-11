<?php
/**
 * Plugin Name:       PHP Snippet Block
 * Plugin URI:        https://github.com/adamziel/php-snippet-block
 * Description:       Add editable PHP examples that run safely in the reader's browser with WordPress Playground.
 * Version:           1.0.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Jon Surrell and Adam Zieliński
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       php-snippet-block
 *
 * @package PHP_Snippet_Block
 */

declare( strict_types = 1 );

namespace PHP_Snippet_Block;

defined( 'ABSPATH' ) || exit;

/**
 * Registers the block from its metadata.
 */
function register_block(): void {
	register_block_type(
		__DIR__,
		array(
			'render_callback' => __NAMESPACE__ . '\\render_snippet',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\\register_block' );

/**
 * Renders a saved PHP example as a WordPress Playground snippet.
 *
 * @param array<string, mixed> $attributes Block attributes.
 * @param string               $content    Saved <pre><code> markup.
 * @return string
 */
function render_snippet( array $attributes, string $content ): string { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
	// Feeds cannot load the web component, so retain the readable code block.
	if ( is_feed() ) {
		return $content;
	}

	// Read only the code text. Other saved markup is not copied into the
	// custom element built below.
	$saved = new \WP_HTML_Tag_Processor( $content );
	if ( ! $saved->next_tag( 'PRE' ) ) {
		return $content;
	}

	$pre_class = $saved->get_attribute( 'class' );
	if (
		! $saved->next_tag( 'CODE' ) ||
		! $saved->next_token() ||
		'#text' !== $saved->get_token_type()
	) {
		return $content;
	}

	$code = $saved->get_modifiable_text();
	if ( '' === trim( $code ) ) {
		return $content;
	}
	$auto_prepend_id = wp_unique_id( 'php-snippet-block-auto-prepend-' );

	$output = new \WP_HTML_Tag_Processor(
		'<php-snippet><pre><code class="language-php">PLACEHOLDER</code></pre></php-snippet>'
	);
	$output->next_tag( 'PHP-SNIPPET' );
	$output->set_attribute( 'name', snippet_name() );
	$output->set_attribute( 'auto-prepend-script', '#' . $auto_prepend_id );
	$output->set_attribute( 'implicit-php-open-tag', true );

	$output->next_tag( 'PRE' );
	if ( is_string( $pre_class ) && '' !== $pre_class ) {
		$output->set_attribute( 'class', $pre_class );
	}

	if (
		! $output->next_tag( 'CODE' ) ||
		! $output->next_token() ||
		! $output->set_modifiable_text( $code )
	) {
		return $content;
	}

	return auto_prepend_script( $auto_prepend_id ) . $output->get_updated_html();
}

/**
 * Builds a useful filename for errors shown by the snippet runner.
 */
function snippet_name(): string {
	static $index = 0;

	++$index;
	$post = get_post();
	$slug = ( $post instanceof \WP_Post && '' !== $post->post_name ) ? $post->post_name : 'snippet';

	return $slug . '-' . $index . '.php';
}

/**
 * Builds the inert PHP setup script used by the current snippet.
 *
 * @param string $id Script element ID.
 */
function auto_prepend_script( string $id ): string {
	return wp_get_inline_script_tag(
		wp_json_encode(
			"<?php require_once '/wordpress/wp-load.php';",
			JSON_HEX_TAG | JSON_UNESCAPED_SLASHES
		),
		array(
			'id'   => $id,
			'type' => 'application/x-php+json',
		)
	);
}
