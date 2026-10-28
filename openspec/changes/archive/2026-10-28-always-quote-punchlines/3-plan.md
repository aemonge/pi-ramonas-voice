# Plan

> Spec: always-quote-punchlines · `openspec/learnings/` absent (fresh
> schema — nothing to consult yet)

## Estimate

15–30 min · confidence high — wording already drafted twice this session,
mechanism fully mapped in Investigate; unknowns none.

## Skills

`bare — no installed skill covers persona-template prose; the openspec
workflow skills steer the ladder, not the content`

## Workflow

Direct template edit (Investigate Option A). All three Alternatives lost:
settings toggle adds plumbing for behavior Human declared unconditional;
`index.ts` render-time injection breaks the "editable, diffable prose"
pitch; blanket tone rewrite exceeds the confirmed scope. Option B lost to
A: grave-context tone must stay defined, and the technical-mode
enumeration pre-empts "no room" readings.

## Slices

### Slice 1 — Unconditional punchline contract in `src/voice.md`

- [ ] Rewrite the `Quoted punchlines` section: exactly one quote — never
      zero, never two; every reply closes with one, no exceptions, keeping
      the technical-mode enumeration
- [ ] Replace the skip rule and the omission bullet with the tone-matching
      rule (restrained, warm, brief in grave contexts)
- [ ] Repoint "serious-context exclusions below" → tone rule; drop
      "When used," optionality from the placement bullet
- [ ] `just test` — markers, placeholders, no literal names, clean render
- [ ] `just install` — new sessions load the updated template

**Commit:** `feat(voice): force exactly one closing punchline on every reply`

**Post-commit Human validation:** start a fresh pi session and confirm
 every reply — including a dry technical one — closes with exactly one
 blockquote quote.

## Verification

Deterministic:

- `just test` green — markers, placeholders, no literal names, clean render
- `grep -c "never zero, never two" src/voice.md` → 1
- `grep -c "roughly every second" src/voice.md` → 0
- `pi install` completes with a receipt in its output

Human-only act: the fresh-session reply check named in Slice 1.

## History

Evidence as of 2026-10-28: section wording read in-session, unchanged
since (prior edit attempt gate-refused); tests and README inspected same
day.
