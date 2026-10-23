# Requirements — drafted: pure voice template, settings-owned names, main-only delivery

## Draft Acceptance Criteria

1. Template purity — `src/voice.md` contains zero retired section headings
   (`Accessible response formatting`, `Conversation before planning`,
   `Session topic discipline`, `Human coding opportunities`) and zero
   literal default names as template text.
2. Parameterization — every renderer-known placeholder (`{{agentName}}`,
   `{{formal}}`, `{{playful}}`, `{{flirt}}`, `{{serious}}`, `{{grave}}`)
   appears in the template at least once.
3. Default identity — rendering with defaults produces the current
   Ramona/aemonge identity and zero unresolved `{{` tokens.
4. Renaming — `agentName: "Tina"` renders `Tina` in every persona-name
   position; overriding one `humanNames` tier changes only that tier.
5. Settings resilience — missing file, missing keys, or invalid JSON all
   fall back to defaults; injection never breaks because of settings.
6. Main-only delivery — a session with neither `PI_SESSION_ID` nor
   `PI_SESSION_FILE` receives the rendered voice appended to
   `appendSystemPrompt`; a session carrying either receives zero voice
   content.
7. Append, never replace — existing `appendSystemPrompt` content is
   preserved; `forceSystemPrompt` is never used.
8. Fail visibly — unreadable template, or any `{{` surviving render,
   injects nothing; the universal AGENTS.md tripwire line marks the
   delivery failure.
9. Marker test — `node test/markers.mjs` passes with settings-independent
   markers (`kaomoji`, `playfully`, `(¬‿¬)`), placeholder-presence checks,
   and a zero-unresolved-render check; the thin-file check stays at zero
   markers beyond the tripwire.
10. FINAL, the human-verified claim — a restarted main session speaks
    with the configured voice, and a session it spawns carries zero
    voice markers; both observed by the human.

This pass retires the Idea's first question (deletion is final; the
retired text's verbatim source is `src/voice.md` itself until the
source trim lands — the record is re-baked into this Spec's later
artifacts before any deletion, so nothing ships and nothing is lost)
and sharpens the third (markers become settings-independent; names are
no longer grepped).

## Scope

- `src/voice.md` — rewritten as the trimmed template.
- `src/index.ts` — settings loader + renderer before injection.
- `test/markers.mjs` — marker set and checks updated.
- `README.md` — settings path, keys, defaults, fallback.
- `openspec/changes/pure-voice-settings/**` — this Spec's artifacts.

## Out of Scope

- Any delivery of the retired process/formatting content — deleted
  outright, final; no second asset, no relocation.
- Multi-persona packs, settings UI, per-project overrides.
- Changes to child detection or the injection mechanism.
- New npm dependencies.

## Guardrails

- No new dependencies — package.json stays dependency-free.
- Settings live at `$PI_CODING_AGENT_DIR/pi-ramonas-voice.settings.json`
  (default `~/.pi/agent/`), never inside the repository.
- Broken settings fall back to defaults — injection never breaks.
- Injection appends only; never whole-prompt replacement.
- Grants and the verdict line are human acts; source work begins only
  at the schema-declared unlock.

## Human Validation Process

The human restarts a main pi session from their terminal and confirms
the rendered voice sections are present (defaults name Ramona/aemonge;
an optional `agentName: "Tina"` quick check is decisive), then spawns
any child session and confirms it carries zero voice markers. The
response counts as VALID when the main session visibly carries the
configured voice and the child visibly carries none.
