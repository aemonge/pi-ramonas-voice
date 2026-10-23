# Research

Runs between the drafted and refined requirements — its findings ARE
the steering that turns draft into refined.

## Findings

- Pi's `before_agent_start` exposes the current prompt and its
  structured `systemPromptOptions`; changing prompt sections records a
  transcript delta, while `forceSystemPrompt` replaces the whole prompt
  for that run. (Source: `/usr/lib/pi/docs/extensions.md`, "Choose an
  integration point".)
- `PI_SESSION_ID` (current session ID) and `PI_SESSION_FILE` (absolute
  path to the session JSONL; unset for ephemeral sessions) are exported
  into environments pi spawns. (Source:
  `/usr/lib/pi/docs/environment-variables.md`.)
- Probe, 2026-10-23 (recorded in `src/index.ts` header): a child-shaped
  pi run carried both variables; a stripped main-shaped run carried
  neither — child detection by env presence holds today.
- No native per-extension settings API surface exists in the installed
  docs (`extensions.md`, `settings.md`, `sdk.md` searched 2026-10-23);
  the docs speak only of "the extension's own settings" in MCP
  registration context.
- Pi loads extensions from user/project extensions directories; a
  subdirectory with an `index.ts`/`index.js` entry is a valid extension.
  (Source: `extensions.md`.)
- `scripts/link.sh` symlinks `src/` to
  `$PI_CODING_AGENT_DIR/extensions/pi-ramonas-voice`, so the extension
  directory resolves INTO this repository — any settings file placed
  beside `index.ts` would be a repo file.
- The thin universal AGENTS.md exists at the test's default path
  (`~/galactica/.pi/agent/AGENTS.md`, byte-identical to
  `~/.pi/agent/AGENTS.md`, verified 2026-10-23), carrying exactly one
  `identity tripwire` line and zero voice markers.
- `src/voice.md` currently contains the four retired sections verbatim
  — it is the museum source until the source trim lands. (The earlier
  design-appendix copy died in the 2026-10-23 wipe; the source survived
  it.)

## Options

- **Agent-dir settings file** — JSON at
  `$PI_CODING_AGENT_DIR/pi-ramonas-voice.settings.json`; loader and
  defaults live in `index.ts`. User-editable, outside the repo; the
  extension owns parsing with default fallback.
- **Repo-resident settings** — `settings.json` beside `index.ts`
  inside the symlinked extension dir. Colocated and zero path logic,
  but every rename becomes a repo edit — configure collapses back into
  fork.
- **Environment variables** — `PI_RAMONA_*` name vars read at load.
  Zero files, but five human-name tiers in env is clumsy,
  undiscoverable, and pollutes shell profiles.
- **Defer to a native API** — no settings surface until pi ships one.
  Zero own-code, but the settings requirement blocks on upstream.

## Evidence

As of: 2026-10-23

- `extensions.md`: "`before_agent_start` exposes both the current
  prompt and its structured `systemPromptOptions`. Prefer changing
  prompt sections … Returning `systemPrompt`, or setting
  `forceSystemPrompt`, replaces the whole prompt for that run."
- `environment-variables.md`: "`PI_SESSION_ID` | Current session ID";
  "`PI_SESSION_FILE` | Absolute path to the current session JSONL file;
  unset for ephemeral sessions".
- Probe lines (from `src/index.ts` header): "child-shaped run carried
  both vars; the stripped main-shaped run carried neither."
- Current marker set in `test/markers.mjs`: `kaomoji`, `Andee`,
  `dyslexia`, `playfully`, `(¬‿¬)` — `Andee` retires when names become
  settings-owned; `dyslexia` retires with the formatting section.

## Alternatives

- **Agent-dir settings file** — JSON in the agent directory, defaults
  in code, broken files fall back silently. Trade-off: the extension
  owns parsing, and a future native API means a loader swap. Pick-when:
  shipping now, user-editable, repo stays clean.
- **Repo-resident settings** — a settings file beside `index.ts`,
  resolved inside the extension symlink. Trade-off: renaming the persona
  becomes a repository edit, defeating configure-not-fork. Pick-when:
  persona-as-code for a single maintainer who never renames.
- **Environment variables** — load-time `PI_RAMONA_*` reads, no files
  anywhere. Trade-off: five tiers of names in shell config, invisible to
  anyone browsing for a settings file. Pick-when: scripted or ephemeral
  renames are the only use case.
- **Defer to a native API** — wait for pi to expose per-extension
  settings. Trade-off: the requirement blocks on upstream and ships
  nothing today. Pick-when: a native API is announced and waiting is
  acceptable.
