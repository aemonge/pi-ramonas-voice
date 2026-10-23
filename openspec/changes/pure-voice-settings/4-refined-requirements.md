# Requirements — refined: settings stay out of the repo, markers stay out of the values, heat ships at maximum

## Acceptance Criteria

1. Template purity — `src/voice.md` contains zero retired section
   headings (`Accessible response formatting`, `Conversation before
   planning`, `Session topic discipline`, `Human coding opportunities`)
   and zero literal default names as template text.
2. Parameterization — every renderer-known placeholder (`{{agentName}}`,
   `{{formal}}`, `{{playful}}`, `{{flirt}}`, `{{serious}}`, `{{grave}}`)
   appears in the template at least once.
3. Default identity — rendering with defaults produces the current
   Ramona/aemonge identity and zero unresolved `{{` tokens.
4. Renaming — `agentName: "Tina"` renders `Tina` in every persona-name
   position; overriding one `humanNames` tier changes only that tier.
5. Settings resilience — missing file, missing keys, or invalid JSON all
   fall back to defaults; injection never breaks because of settings.
6. Settings placement — whatever mechanism the Plan commits, the settings
   surface a human edits MUST resolve outside this repository: the
   extension directory symlinks into it (`scripts/link.sh`), so any file
   beside `index.ts` is a repo file in disguise.
7. Main-only delivery — a session with neither `PI_SESSION_ID` nor
   `PI_SESSION_FILE` receives the rendered voice appended to
   `appendSystemPrompt`; a session carrying either receives zero voice
   content.
8. Append, never replace — existing `appendSystemPrompt` content is
   preserved; `forceSystemPrompt` is never used.
9. Fail visibly — unreadable template, or any `{{` surviving render,
   injects nothing; the universal AGENTS.md tripwire line marks the
   delivery failure.
10. Marker test — markers match TEMPLATE text only (`kaomoji`,
    `playfully`, `(¬‿¬)`), never rendered values; the test adds
    placeholder-presence and zero-unresolved-render checks; the
    thin-file check stays at zero markers beyond the tripwire.
11. Persona register — the template's voice directives ship at
    maximal tolerable heat: forward, affectionate, playfully teasing
    warmth as the default register in relaxed turns. The register is
    template law — no settings key turns it down — and the
    serious-context exclusions survive intact (serious, sensitive,
    security, failure, incident, grief, or visibly frustrated turns
    drop the heat entirely).
12. FINAL, the human-verified claim — a restarted main session speaks
    with the configured voice and register, and a session it spawns
    carries zero voice markers; both observed by the human.

## Deltas from Drafted

- **Added — AC6 (settings placement)**: the symlink finding (research,
  dated 2026-10-23: the extension dir resolves into the repo) turns
  "settings live outside" from a guardrail hint into a testable
  criterion. It constrains the mechanism without picking it.
- **Added — AC11 (persona register)**: human steering, 2026-10-23 —
  "make it sexier, up to the most tolerable limits you can" — the
  template's flirt register ships at maximum as template law, not a
  settings key; serious-context exclusions preserved. FINAL moves to
  AC12 and now judges the register alongside the voice.
- **Sharpened — AC10 (marker test)**: markers must match template text
  and never rendered values — names are settings-owned now, so no grep
  may depend on what settings produce.
- **Sharpened — Guardrails**: the settings-location guardrail carries
  its evidence (the symlink trap) rather than resting on taste.
- **Removed — none. Relaxed — none.**
- **Questions**: retires the Idea's second question — repo-resident
  settings die on the symlink trap, defer dies on the absent native
  API; the acceptance shape is fixed while the committed mechanism
  remains Plan's Workflow pick among the survivors.

## Human Validation Process

Unchanged from drafted.
