=== PHP Snippet Block ===
Contributors: jonsurrell, adamziel
Tags: block, code, php, playground
Requires at least: 6.7
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add editable PHP examples that readers can run safely in their browsers with WordPress Playground.

== Description ==

PHP Snippet Block adds one block named PHP Snippet. Authors enter PHP without
the opening `<?php` tag. A reader can edit and run the example in WordPress
Playground without sending the PHP to the site's server for execution.

The Playground instance loads WordPress before running each example, so the
snippet can use WordPress functions.

= External service =

This plugin uses the public WordPress Playground service provided by the
WordPress project.

When a page containing this block is opened, the reader's browser downloads the
PHP Snippet web component from `playground.wordpress.net`. When the reader
selects Run, the browser downloads the Playground runtime and a WordPress build
from that service. The PHP source is passed to a Playground iframe and runs
inside the reader's browser. It does not run on the WordPress site's server.
No account or access key is required.

* Service: https://playground.wordpress.net/
* Documentation: https://developer.wordpress.org/playground/handbook/guides/php-code-snippets/
* Service privacy policy: https://wordpress.org/about/privacy/
* Web component source: https://github.com/WordPress/wordpress-playground/tree/trunk/packages/playground/website/public
* Plugin source: https://github.com/adamziel/php-snippet-block

== Installation ==

1. Install and activate PHP Snippet Block.
2. Open a post or page in the block editor.
3. Insert the PHP Snippet block.
4. Enter PHP without an opening `<?php` tag.

== Frequently Asked Questions ==

= Does the PHP run on my WordPress server? =

No. The PHP runs in a WebAssembly-based WordPress Playground inside the
reader's browser.

= Can a snippet use WordPress functions? =

Yes. The Playground WordPress installation is loaded before the snippet runs.
It is separate from the WordPress site that displays the block.

= Does a reader need a WordPress.org account? =

No.

== Changelog ==

= 1.0.0 =
* Initial release.
