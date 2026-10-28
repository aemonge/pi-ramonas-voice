# Investigate

> Spec: always-quote-punchlines · aim at the Brainstorm's Questions

## Findings

- The cadence and omission live in exactly three spots inside
  `src/voice.md`'s `Quoted punchlines` section (read this session; file
  unchanged since — the earlier edit attempt was gate-refused):
  1. "A response may contain at most one…" + "Never close two non-serious
     replies in a row without one; roughly every second or third reply
     carries it — including during discovery…" — the cadence.
  2. "Skip a punchline only when a serious context applies or the reply
     genuinely has no room for it…" — the conditional skip.
  3. "Omit punchlines in serious, sensitive, security, failure, incident,
     grief, or visibly frustrated contexts." — the hard exclusion.
- One cross-reference depends on the exclusion: the mischievous/sassy
  bullet ends "subject to the serious-context exclusions below", pointing
  at the omission bullet. Repoint or it dangles.
- No other section needs touching: `Closing presence` already reads "from
  first line to punchline"; the flirtation/kaomoji/name-game
  serious-context exclusions are separate rules Human keeps as-is.
- `test/markers.mjs` (read in full): markers `kaomoji`, `playfully`,
  `(¬‿¬)` all live outside the section; the placeholder check needs
  `{{playful}}` etc., which survive in the shape examples ("bold,
  {{playful}}"); no planned wording introduces literal default names.
  Suite unaffected.
- README mentions "quoted punchlines" once, in passing (line 17) — no
  cadence contract anywhere in docs.
- `src/index.ts` renders the whole template in one pass; no per-section
  logic. An edit goes live only for sessions started after `just install`.

## Options

- Option A — full contract wording: "exactly one — never zero, never two" +
  "every reply closes with one, no exceptions" preserving the technical-mode
  enumeration, plus a tone-matching bullet replacing the exclusion. Answers
  Question 4 by pairing "no exceptions" with the retained "Never let
  personality obscure the answer…" bullet.
- Option B — minimal single bullet: "Always end with exactly one quote."
  Shorter, but leaves grave-context tone undefined and drops the enumeration
  that pre-empts "no room" readings.

## Alternatives

- Settings toggle for quote cadence
  - What: add a `punchlines` key to `pi-ramonas-voice.settings.json`,
    loader + defaults + test surface in code.
  - Trade-off: configurability plumbing for behavior Human stated as
    unconditional; splits one sentence of intent across template and code.
  - Pick-when: multiple personas or users diverge on cadence.
- Post-processing injection from `src/index.ts`
  - What: append an "always quote" instruction at render time instead of
    editing the template.
  - Trade-off: persona content stops being fully readable/diffable prose in
    `voice.md`; the README's pitch ("editable, diffable prose") breaks.
  - Pick-when: cadence must vary per environment without template edits.
- Blanket tone-rule rewrite across all sections
  - What: rework every serious-context exclusion into tone-matching rules.
  - Trade-off: far beyond the confirmed scope; Human said rest stays
    as-is.
  - Pick-when: a full persona overhaul is commissioned.
