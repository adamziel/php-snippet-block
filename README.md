# PHP Snippet Block

[![Build and release](https://github.com/adamziel/php-snippet-block/actions/workflows/build-and-release.yml/badge.svg)](https://github.com/adamziel/php-snippet-block/actions/workflows/build-and-release.yml)

By Adam Zieliński and Jon Surrell.

This standalone WordPress plugin adds the `php-snippet-block/php-snippet`
block. PHP examples run in the reader's browser through WordPress Playground.
They never execute on the WordPress server that displays the post.

## Requirements

- WordPress 6.7 or newer
- PHP 7.4 or newer
- A browser that can reach `https://playground.wordpress.net`

## Local test

Install and activate the plugin. Add **PHP Snippet** to a post and try:

```php
echo get_bloginfo( 'name' );
```

The saved page first shows the source as ordinary `<pre><code>` markup. The
WordPress Playground component then adds editing and Run controls.

## Release

The WordPress.org upload ZIP must contain the `php-snippet-block` directory at
its root. Run `./build-release.sh` to create `dist/php-snippet-block.zip`.

GitHub Actions builds and checks the ZIP on each push and pull request. A tag
such as `v1.0.0` also creates a GitHub release containing the ZIP.

## Important implementation notes

- `view.js` loads the public WordPress Playground web component. The service,
  source, and privacy details are listed in `readme.txt`.
- The editor reads the component's open shadow root to copy textarea changes
  into the block attribute. If the component changes its internal textarea,
  this integration must be updated.
- The rendered block keeps `<pre><code>` children so source remains readable in
  feeds and when the Playground service is unavailable.
