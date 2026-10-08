#!/usr/bin/env bash
# Build a preview.png: thumbnail, empty or first frame, elements, and closing,
# side by side. Usage: style-preview.sh <dir> [times] [output]
# <dir> holds index.html and thumbnail/index.html. Times default to
# `preview_at: [empty, elements, closing]` in <dir>/style.md; output defaults
# to <dir>/preview.png.
set -euo pipefail

dir="${1:?usage: style-preview.sh <dir> [times] [output]}"
times="${2:-$(sed -n 's/^preview_at: *\[\([^]]*\)\].*/\1/p' "$dir/style.md" 2>/dev/null | tr -d ' ')}"
out="${3:-$dir/preview.png}"
[ -n "$times" ] || { echo "No times given and no preview_at in $dir/style.md"; exit 1; }
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
mkdir -p "$(dirname "$out")"
ffmpeg -v error -y "${inputs[@]}" -filter_complex "${filters}${labels}hstack=4" "$out"
echo "Wrote $out"
