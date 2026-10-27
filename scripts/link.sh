#!/usr/bin/env bash
# Install pi-ramonas-voice as a pi package, per the pi 1.4.x package
# mechanism: `pi install <local-path>` registers the directory in
# ~/.pi/agent/settings.json, and the `pi.extensions` manifest in
# package.json points pi at src/index.ts. Local packages load from the
# resolved path without copying — edits are live on the next pi start.
# No npm publish, no symlink into ~/.pi/agent/extensions/ (that second
# registration route would double-load the extension and inject the
# voice twice).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if grep -q "pi-ramonas-voice" "${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}/settings.json" 2>/dev/null; then
  echo "already registered in settings.json"
else
  pi install "$ROOT"
fi

echo "verify: restart pi and run a main session; a spawned child stays clean."
