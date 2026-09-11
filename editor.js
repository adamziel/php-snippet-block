/**
 * Editor script for the PHP Snippet block.
 *
 * The WordPress Playground component is also the editing UI. Changes inside
 * its open shadow root are copied to the block attribute.
 */
( function ( wp ) {
	'use strict';

	var registerBlockType = wp.blocks.registerBlockType;
	var element = wp.element;
	var el = element.createElement;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var __ = wp.i18n.__;

	var COMPONENT_MODULE_URL =
		'https://playground.wordpress.net/php-code-snippet.js';
	var AUTO_PREPEND_SCRIPT_PREFIX =
		'php-snippet-block-auto-prepend-';

	/**
	 * Encodes source saved in the post.
	 *
	 * Quotes and `[` are encoded so text formatting and shortcode parsing do
	 * not change PHP examples. The block parser decodes them when it reads the
	 * text-sourced attribute.
	 *
	 * @param {string} content Original content.
	 * @return {string} Encoded content.
	 */
	function htmlEncode( content ) {
		return content
			.replaceAll( '&', '&amp;' )
			.replaceAll( '<', '&lt;' )
			.replaceAll( '>', '&gt;' )
			.replaceAll( "'", '&#39;' )
			.replaceAll( '"', '&#34;' )
			.replaceAll( '[', '&#91;' );
	}

	function edit( props ) {
		var ref = element.useRef( null );
		var propsRef = element.useRef( props );
		propsRef.current = props;

		// Capture the element once. Rewriting a mounted custom element's child
		// script would not update the component's editor.
		var sourceScript = element.useMemo( function () {
			return el(
				'script',
				{ type: 'application/x-php+json' },
				JSON.stringify( propsRef.current.attributes.content )
			);
		}, [] );

		element.useEffect( function () {
			var host = ref.current;

			if ( ! host ) {
				return;
			}

			function sync() {
				var textarea =
					host.shadowRoot &&
					host.shadowRoot.querySelector( 'textarea.ta' );

				if (
					textarea &&
					textarea.value !== propsRef.current.attributes.content
				) {
					propsRef.current.setAttributes( {
						content: textarea.value,
					} );
				}
			}

			function onKeyup( event ) {
				// The component inserts a tab without firing an input event.
				if ( 'Tab' === event.key ) {
					sync();
				}
			}

			// Events leaving a shadow root report the custom element as their
			// target. Use composedPath()[0] to find the real text field.
			function isTextFieldEvent( event ) {
				var target = event.composedPath()[ 0 ];

				return (
					!! target &&
					( 'TEXTAREA' === target.tagName ||
						'INPUT' === target.tagName )
				);
			}

			function containClipboard( event ) {
				if ( isTextFieldEvent( event ) ) {
					event.stopPropagation();
				}
			}

			// The editor otherwise treats caret movement inside the shadow root
			// as block selection movement.
			var caretKeys = [
				'ArrowUp',
				'ArrowDown',
				'ArrowLeft',
				'ArrowRight',
				'Home',
				'End',
				'PageUp',
				'PageDown',
			];

			function containKeydown( event ) {
				if ( ! event.key || ! isTextFieldEvent( event ) ) {
					return;
				}

				if ( -1 !== caretKeys.indexOf( event.key ) ) {
					event.stopPropagation();
					return;
				}

				// Match the editor's select-all behavior for normal text fields:
				// the first press selects the field; the next selects all blocks.
				if (
					'a' !== event.key.toLowerCase() ||
					! ( event.metaKey || event.ctrlKey ) ||
					event.shiftKey ||
					event.altKey
				) {
					return;
				}

				var target = event.composedPath()[ 0 ];
				var entirelySelected =
					0 === target.selectionStart &&
					target.value.length === target.selectionEnd;

				if ( ! entirelySelected ) {
					event.stopPropagation();
				}
			}

			host.addEventListener( 'input', sync );
			host.addEventListener( 'focusout', sync );
			host.addEventListener( 'keyup', onKeyup );
			host.addEventListener( 'paste', containClipboard );
			host.addEventListener( 'copy', containClipboard );
			host.addEventListener( 'cut', containClipboard );
			host.addEventListener( 'keydown', containKeydown );

			return function () {
				host.removeEventListener( 'input', sync );
				host.removeEventListener( 'focusout', sync );
				host.removeEventListener( 'keyup', onKeyup );
				host.removeEventListener( 'paste', containClipboard );
				host.removeEventListener( 'copy', containClipboard );
				host.removeEventListener( 'cut', containClipboard );
				host.removeEventListener( 'keydown', containKeydown );
			};
		}, [] );

		// These tags must be inside the editor canvas document. Each block uses
		// its client ID for a distinct setup-script selector. Browsers execute
		// the shared module only once.
		var autoPrependId = AUTO_PREPEND_SCRIPT_PREFIX + props.clientId;

		return el(
			'div',
			useBlockProps(),
			el( 'script', {
				type: 'module',
				src: COMPONENT_MODULE_URL,
			} ),
			el(
				'script',
				{
					id: autoPrependId,
					type: 'application/x-php+json',
				},
				JSON.stringify(
					"<?php require_once '/wordpress/wp-load.php';"
				)
			),
			el(
				'php-snippet',
				{
					ref: ref,
					name: 'snippet.php',
					'auto-prepend-script': '#' + autoPrependId,
					'implicit-php-open-tag': '',
				},
				sourceScript
			)
		);
	}

	function save( props ) {
		return el(
			'pre',
			useBlockProps.save(),
			el(
				'code',
				{ className: 'language-php' },
				htmlEncode( props.attributes.content )
			)
		);
	}

	registerBlockType( 'php-snippet-block/php-snippet', {
		apiVersion: 3,
		title: __( 'PHP Snippet', 'php-snippet-block' ),
		category: 'text',
		icon: 'editor-code',
		description: __(
			"Add an editable PHP example that runs in the reader's browser with WordPress Playground.",
			'php-snippet-block'
		),
		keywords: [ 'php', 'code', 'run', 'playground' ],
		attributes: {
			content: {
				type: 'string',
				source: 'text',
				selector: 'code',
				default: '',
			},
		},
		supports: {
			html: false,
		},
		edit: edit,
		save: save,
	} );
} )( window.wp );
