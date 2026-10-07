#!/usr/bin/env bash
# Build a style's preview.png: thumbnail, empty frame, elements with caption,
# and closing, side by side. Usage: style-preview.sh <style-dir>
# Times come from `preview_at: [empty, elements, closing]` in the style's style.md.
set -euo pipefail

dir="${1:?usage: style-preview.sh <style-dir>}"
times="$(sed -n 's/^preview_at: *\[\([^]]*\)\].*/\1/p' "$dir/style.md" | tr -d ' ')"
[ -n "$times" ] || { echo "No preview_at in $dir/style.md"; exit 1; }
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

npx -y hyperframes snapshot "$dir/thumbnail" --at 0.5 --no-end --describe false -o "$tmp/thumb" >/dev/null 2>&1
npx -y hyperframes snapshot "$dir" --at "$times" --no-end --describe false -o "$tmp/sample" >/dev/null 2>&1

frames=("$tmp"/thumb/frame-00-*.png "$tmp"/sample/frame-0[0-2]-*.png)
[ ${#frames[@]} -eq 4 ] || { echo "Expected 4 frames, got ${#frames[@]}"; exit 1; }

inputs=(); filters=""; labels=""
for i in 0 1 2 3; do
  inputs+=(-i "${frames[$i]}")
  filters+="[$i]scale=540:960,pad=564:984:12:12:color=0x1a1a1a[f$i];"
  labels+="[f$i]"
done
ffmpeg -v error -y "${inputs[@]}" -filter_complex "${filters}${labels}hstack=4" "$dir/preview.png"
echo "Wrote $dir/preview.png"
