#!/usr/bin/env bash

set -euo pipefail

plugin_dir="$(cd "$(dirname "$0")" && pwd)"
dist_dir="$plugin_dir/dist"
stage_dir="$dist_dir/php-snippet-block"

rm -rf "$stage_dir" "$dist_dir/php-snippet-block.zip"
mkdir -p "$stage_dir"

cp \
	"$plugin_dir/block.json" \
	"$plugin_dir/editor.asset.php" \
	"$plugin_dir/editor.js" \
	"$plugin_dir/license.txt" \
	"$plugin_dir/php-snippet-block.php" \
	"$plugin_dir/readme.txt" \
	"$plugin_dir/style.css" \
	"$plugin_dir/view.js" \
	"$stage_dir/"

(
	cd "$dist_dir"
	zip -qr php-snippet-block.zip php-snippet-block
)

printf 'Created %s\n' "$dist_dir/php-snippet-block.zip"
