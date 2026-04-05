#!/usr/bin/env sh
set -eu

SRC_DIR="node_modules/mimium-web-component"
DST_DIR="static/scripts/mimium-web-component"

if [ ! -d "$SRC_DIR" ]; then
  echo "Error: $SRC_DIR not found. Run npm install first." >&2
  exit 1
fi

rm -rf "$DST_DIR"
mkdir -p "$(dirname "$DST_DIR")"
cp -R "$SRC_DIR" "$DST_DIR"
