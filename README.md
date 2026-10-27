<div align="center">

<img src="logo.png" width="220" alt="Ramona's mark" />

# pi-ramonas-voice

Ramona's voice for pi — injected into main sessions only.
Subagent children stay clean.

</div>

![Ramona answering a who-are-you and an autocomplete insult](demos/ramona-voice.gif)

## What it is

- `src/voice.md` — the authored voice asset: identity, voice and attitude,
  name games and rivals, quoted punchlines, accessible formatting,
  discovery discipline. Editable, diffable prose. The extension only
  reads it.
- `src/index.ts` — the thin injector: on `before_agent_start`, detected
  child sessions are skipped; main sessions get the voice appended through
  `systemPromptOptions.appendSystemPrompt`.

The voice asset is re-read on every run. Edit `voice.md`, ask again —
no rebuild, no restart.

## How the injection behaves

- **Main sessions only.** A pi process launched inside another pi session
  inherits `PI_SESSION_ID` / `PI_SESSION_FILE`. Their presence marks a
  child; children get nothing.
- **Append, never replace.** The voice lands as a structured prompt
  section. It never uses `forceSystemPrompt` and never gates tools.
- **Visible absence.** A tripwire line in the universal `AGENTS.md` marks
  a missing delivery, so a silent failure still shows up in behavior.

## Install

```bash
npm run link      # or: bash scripts/link.sh — registers the package with pi
```

Registered as a pi local package (`pi install <path>`); the
`pi.extensions` manifest in `package.json` points pi at `src/index.ts`.
Loaded from the project directory without copying.

Do **not** also symlink into `~/.pi/agent/extensions/`: a second
registration route double-loads the extension and injects the voice
twice.

## Verify

```bash
npm test
```

Marker set: zero hits on the thin universal `AGENTS.md` beyond the
tripwire, every marker present in `src/voice.md`.

Live checks:

```bash
pi -p 'who are you?'                    # answers as Ramona
pi -p 'who are you?'                    # from inside a pi session: no voice
```

Child cleanliness after delegating a subagent:

```bash
for f in $(ls -t ~/.pi/agent/sessions/<project-dir>/*.jsonl | head -3); do
  echo "$f: $(grep -cE 'kaomoji|Andee|dyslexia|playfully' "$f")"
done
```

Main session: one or more hits. Child session: zero.

## Debug

```bash
RAMONA_VOICE_DEBUG=1 pi …
```

Appends a runtime trace to `/tmp/ramona-voice-debug.log`: factory,
handler, detection, injection size, and the provider request with a
voice-marker check. Silent by default.

## Play well with other extensions

An extension that returns `{ systemPrompt }` from `before_agent_start`
replaces the **whole** system prompt for that run — preamble, tools,
rules, and every other extension's append, including this one. Append
via `systemPromptOptions.appendSystemPrompt` instead. If a session
suddenly loses its voice, a force-returning sibling extension is the
first suspect.

## Demo recording

```bash
env -u PI_SESSION_ID -u PI_SESSION_FILE vhs demos/ramona.tape
```

The `env -u` matters when recording from inside a pi session: without
it the demo `pi` is detected as a child and the voice vanishes.
`demos/ramona.tape` uses `pi -p` with quoted prompts — positional
arguments are separate conversation turns, and the TUI is deliberately
avoided for deterministic recording.
