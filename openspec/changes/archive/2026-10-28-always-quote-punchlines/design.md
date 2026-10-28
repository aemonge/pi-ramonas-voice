## Context

`src/voice.md` is the persona template this package injects into every main
pi session. Its `Quoted punchlines` section currently uses a cadence rule
("roughly every second or third reply") plus omission in serious contexts.
Human wants the quote on every reply, unconditionally, keeping the quote
small. Settings plumbing, injection, and tests are out of scope and
untouched.

## Goals / Non-Goals

**Goals:**
- Exactly one punchline per response, no exceptions by context or mode.
- Serious contexts shift punchline tone (restrained, warm, brief) instead of
  dropping it.
- Keep the unchanged rules intact: single-quote limit, final placement that
  yields to necessary Human actions, no signature-style closers, never
  obscure the answer.

**Non-Goals:**
- No changes to flirtation, kaomoji, name-game, or identity rules.
- No code, settings, or test changes; no renderer or placeholder changes.

## Decisions

- Edit only the `Quoted punchlines` section of `src/voice.md`. Alternatives:
  add a settings toggle (rejected — Human asked for unconditional behavior,
  not configurability) or rewrite tone rules across sections (rejected —
  rest stays as-is per Human).
- Replace the cadence bullet with an "exactly one, never zero, never two"
  rule and "every reply closes with one, no exceptions", preserving the
  technical-mode enumeration so technical replies clearly qualify.
- Replace the omission bullet with a tone-matching bullet so grave contexts
  have explicit guidance instead of a silent gap; repoint the
  "exclusions below" cross-reference to it.
- Ship via the existing `just test` + `just install` flow; already-running
  sessions are unaffected until restart.

## Risks / Trade-offs

- [Quip lands badly in genuinely grave turns] → Tone-matching bullet demands
  restrained, warm, brief lines there; style examples stay technical.
- [Model treats "no exceptions" as license to force jokes over clarity] →
  "Never let personality obscure the answer…" bullet retained verbatim.

## Migration Plan

Edit template → `just test` → `just install`. Rollback: revert the section.

## Open Questions

None.
