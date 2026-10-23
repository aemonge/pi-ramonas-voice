# Plan

## Estimate

3–5 h end-to-end including per-Slice human validations · confidence
high — every mechanism probed or documented; the only prose unknown is
the register rewrite itself.

## Skills

bare — no installed skill covers pi-extension TypeScript work; the
implementation rests on pi's documented extension API
(`/usr/lib/pi/docs/extensions.md`, `environment-variables.md`) and the
Node standard library. The openspec workflow skills steered this
ladder, not the code.

## Workflow

Selected: **agent-dir settings file** —
`$PI_CODING_AGENT_DIR/pi-ramonas-voice.settings.json`, loader and
defaults in `index.ts`. Env vars lost: five human-name tiers in shell
config are clumsy and undiscoverable for a surface a human is meant to
edit. Repo-resident already died on the symlink trap (AC6); deferring
died on the absent native API.

## Slices

### Slice 1 — Settings loader with default fallback

Conventional commit planned: `feat(settings): agent-dir settings
loader with default fallback`

- [ ] Task — add `loadSettings()`: read
      `$PI_CODING_AGENT_DIR/pi-ramonas-voice.settings.json` (default
      `~/.pi/agent/`)
- [ ] Task — defaults in code: `agentName` `Ramona`; tiers `formal`
      `aemonge`, `playful` `Andy`, `flirt` `Andee`, `serious`
      `Andres`, `grave` `Andres Monge`
- [ ] Task — missing file, missing keys, invalid JSON all resolve to
      defaults (AC5)
- [ ] Human validation — review the loader; confirm the settings path
      resolves outside the repo (AC6)

### Slice 2 — Pure persona template

Conventional commit planned: `feat(voice): pure persona template,
placeholders, maxed register`

- [ ] Task — record the four retired sections verbatim into
      `openspec/changes/pure-voice-settings/retired-voice-sections.md`
      (museum copy) BEFORE any deletion — the drafted sheet promised
      this record
- [ ] Task — delete the four retired sections from `src/voice.md`
      (AC1)
- [ ] Task — replace every name literal with `{{agentName}}`,
      `{{formal}}`, `{{playful}}`, `{{flirt}}`, `{{serious}}`,
      `{{grave}}` (AC2)
- [ ] Task — persona register ships at maximal tolerable heat,
      template law, serious-context exclusions intact (AC11)
- [ ] Human validation — read the trimmed template; voice-only
      content, register at the limit you asked for

### Slice 3 — Renderer with fail-visible guard

Conventional commit planned: `feat(voice): placeholder renderer with
append-only injection`

- [ ] Task — substitute placeholders from settings before appending
      to `appendSystemPrompt` (AC3, AC4)
- [ ] Task — any `{{` surviving render → inject nothing that run;
      unreadable template → inject nothing (AC9)
- [ ] Task — append-only; `forceSystemPrompt` never used (AC8)
- [ ] Human validation — quick code read; guard behavior confirmed

### Slice 4 — Marker test rewrite

Conventional commit planned: `test(markers): settings-independent
markers and render checks`

- [ ] Task — markers `kaomoji`, `playfully`, `(¬‿¬)` against template
      text only (AC10)
- [ ] Task — placeholder-presence check: every renderer key appears;
      no literal default name as template text
- [ ] Task — zero-unresolved render check with defaults (minimal
      substitution mirror in the test); thin-file check unchanged
- [ ] Human validation — run `node test/markers.mjs` in your
      terminal; all green

### Slice 5 — Docs and end-to-end verification

Conventional commit planned: `docs(readme): settings guide and
verification steps`

- [ ] Task — README: settings path, keys, defaults, broken-settings
      fallback, link + restart-verify steps
- [ ] Task — link via `scripts/link.sh` if unlinked
- [ ] Human validation — run the full Human Validation Process (AC12):
      restart a main session — configured voice and register present;
      spawn a child — zero voice markers

## Verification

Deterministic: `node test/markers.mjs` — markers, placeholder
presence, zero-unresolved render, thin-file zero beyond the tripwire.
Then the one human-only act: the AC12 run — a restarted main session
speaks with the configured voice and register; a session it spawns
carries zero voice markers.

## History

Evidence as of 2026-10-23: docs probes (`extensions.md`,
`environment-variables.md`), the env-var child-detection probe, the
symlink finding, thin-file verification. No commits yet — the five
Slices mint them.
