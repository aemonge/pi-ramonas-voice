#!/usr/bin/env bash
# Install pi-ramonas-voice locally per the established pattern:
# a symlink in the user agent-dir extensions directory pointing at the
# extension entry directory (index.ts + voice.md at its root).
# No npm publish — local-only distribution.
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/src"
EXT_DIR="${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}/extensions"
LINK="$EXT_DIR/pi-ramonas-voice"

mkdir -p "$EXT_DIR"

if [ -L "$LINK" ] && [ "$(readlink "$LINK")" = "$SRC" ]; then
  echo "already linked: $LINK -> $SRC"
  exit 0
fi

if [ -e "$LINK" ] && [ ! -L "$LINK" ]; then
  echo "refusing: $LINK exists and is not a symlink" >&2
  exit 1
fi

ln -sfn "$SRC" "$LINK"
echo "linked: $LINK -> $SRC"
echo "verify: restart pi and run a main session; a spawned child stays clean."
