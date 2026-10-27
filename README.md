# pi-ramonas-voice

Ramona's voice for pi, delivered as an extension — injected into main
sessions only, never into subagent children.

## What it is

- `src/voice.md` — the authored voice asset: identity, voice and
  attitude, quoted punchlines, accessible formatting, discovery
  discipline. Editable, diffable prose. The extension only reads it.
- `src/index.ts` — the extension: on `before_agent_start`, detected
  child sessions are skipped; main sessions get the voice appended as
  a structured prompt section via `systemPromptOptions`.
- `test/markers.mjs` — the deterministic voice-marker check.
- `scripts/link.sh` — local install via `pi install` (pi package
  registration). No npm publish, no `~/.pi/agent/extensions/` symlink.

## Install

```bash
npm run link      # or: bash scripts/link.sh  — registers the package with pi
```

Registered as a pi local package (`pi install <path>`); the
`pi.extensions` manifest in `package.json` points pi at `src/index.ts`.
Loaded from the project directory without copying — restart pi after
edits. Do **not** also symlink into `~/.pi/agent/extensions/`: a second
registration route double-loads the extension and injects the voice
twice.

## Verify

```bash
npm test          # marker set: zero hits on the thin universal AGENTS.md
                  # beyond the tripwire, hits present in src/voice.md
```

A main session's prompt carries the voice sections; a spawned child
session contains zero voice-marker hits. The tripwire line in
`.pi/agent/AGENTS.md` marks a missing delivery visibly.
