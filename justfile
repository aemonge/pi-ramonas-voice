# pi-ramonas-voice — task runner.
# Plain `just` lists every recipe.

# List the available recipes.
default:
    just --list

# Run the deterministic template test suite.
test:
    node test/markers.mjs

# Install this checkout as a pi package for the current user.
install:
    pi install "{{justfile_directory()}}"

# Record the demo GIF (demos/ramona-voice.gif) in a clean agent
# directory so the recording shows only this extension — not the rest
# of your setup. Rebuilds /tmp/ramona-demo-agent every run and reuses
# your provider, model, and credentials.
demo:
    #!/usr/bin/env bash
    set -euo pipefail
    ROOT="{{justfile_directory()}}"
    SRC="${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}"
    D="${RAMONA_DEMO_AGENT:-/tmp/ramona-demo-agent}"
    rm -rf "$D" && mkdir -p "$D"
    for f in auth.json auth; do
        if [ -e "$SRC/$f" ]; then ln -s "$SRC/$f" "$D/$f"; fi
    done
    PI_CODING_AGENT_DIR="$D" pi install "$ROOT"
    python3 -c 'import json,sys; real=json.load(open(sys.argv[1])); d=json.load(open(sys.argv[2])); [d.__setitem__(k, real[k]) for k in ("defaultProvider","defaultModel","modelRoles") if k in real]; json.dump(d, open(sys.argv[2],"w"), indent=2)' "$SRC/settings.json" "$D/settings.json"
    # VHS_NO_SANDBOX works around a chromium SUID sandbox that is not
    # usable (chrome-sandbox not owned by root); drop it if yours works.
    # env -u matters when recording from inside a pi session: without it
    # the demo pi is detected as a child and the voice vanishes.
    env -u PI_SESSION_ID -u PI_SESSION_FILE \
        PI_CODING_AGENT_DIR="$D" \
        VHS_NO_SANDBOX=1 \
        vhs "$ROOT/demos/ramona.tape"

# Publish the package to npm. Runs the test suite first.
publish: test
    npm publish
