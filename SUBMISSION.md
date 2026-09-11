# WordPress.org submission checklist

## Ready now

- Plugin name: **PHP Snippet Block**
- Proposed slug: `php-snippet-block`
- Block name: `php-snippet-block/php-snippet`
- Release: `1.0.0`
- Upload file: `dist/php-snippet-block.zip`
- The ZIP contains one top-level block and no settings screen.
- The exact files inside the ZIP pass Plugin Check 2.1.0 with no errors.
- The proposed slug returned no plugin from the public WordPress.org plugin API
  on September 11, 2026. WordPress.org chooses the final slug during review.

## Confirm before uploading

The patch lists Jon Surrell as its author, so the plugin currently uses:

- `Author: Jon Surrell`
- `Contributors: jonsurrell`

Change these before submission if the WordPress.org account or public author
name should be different. Also confirm the plugin name. The permanent plugin
slug is based on that name and is hard to change after approval.

## First WordPress.org step

1. Sign in to the WordPress.org account that will maintain the plugin.
2. Open <https://wordpress.org/plugins/developers/add/>.
3. Upload `dist/php-snippet-block.zip`.
4. Read and accept the directory rules shown on the form.
5. Submit the plugin for review.
6. Watch the account email address and reply in the same email thread if the
   Plugins Team asks for changes.

This step cannot be completed without that WordPress.org login. The directory
currently says manual review usually takes 1 to 10 days.

## After approval

WordPress.org will provide an SVN repository. Publish the same release files
there. Do not commit `dist`, `README.md`, `SUBMISSION.md`, or
`build-release.sh` to the release directory.

After the plugin is live:

1. Sign in at <https://wordpress.org/plugins/developers/block-plugin-validator/>.
2. Enter the plugin slug or its WordPress.org SVN URL.
3. Run the checker.
4. If it passes, select the button that adds the plugin to the Block Directory.

## Manual-review note

The block uses WordPress Playground as its service. A visitor's browser loads
the public `php-code-snippet.js` module from `playground.wordpress.net` and
loads the Playground runtime after Run is selected. The WordPress.org readme
states when this happens, what is sent, and links to the service, its privacy
policy, its guide, and its source.

The general plugin rules allow external code when it is part of a documented
service. A Plugins Team reviewer makes the final decision. They may ask for a
different way to ship the web component.

## Checks already run

- PHP syntax checks
- JavaScript syntax checks
- `block.json` parsing
- Plugin activation on a clean WordPress test site
- Server render checks, including escaping and feed fallback
- Block save-and-reload round trip with quotes, HTML, a shortcode-like value,
  and an ampersand
- Front-end browser run using `echo get_bloginfo( 'name' );`
- Plugin Check 2.1.0 against the exact release files

