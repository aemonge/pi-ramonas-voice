# Plan

> Spec: voice-seat-and-heat · consult `openspec/learnings/estimation.md` and `skills.md`

## Estimate

1.5–2.5 h end-to-end (template edits, suite lock, tripwires, release) ·
confidence high — the full patch was drafted and suite-audited before the
walk opened; residual unknowns are live-probe behavior and whether git commit
is permitted from this session (if refused, commit commands hand to the
Human verbatim).

## Skills

bare — pure template/docs/suite edits: two markdown files, one .mjs
assertion, two AGENTS.md copies, package.json. No language runtime, no LSP,
no database, no new dependencies.

## Workflow

direct, because the fix is pure template law with a deterministic suite
lock — `src/index.ts` is already correct and untouched. Investigate's
alternatives lose: the extension-side punchline guard breaks the package's
pure-template architecture and adds enforcement machinery (pick only if 0.2.0
still drops punchlines in practice); the persona-agnostic tripwire silences
the visible name token that makes a missing voice detectable (pick when a
persona rename becomes real). The "dodge the harness" lane from the Human's
research commission is rejected on Investigate's policy findings — it is
contract-breaking, not engineering; the committed register is the ceiling:
suggestive-not-explicit.

## Slices

Amendment (execute, ccf2df5): slices 1–2 were certified by ONE combined commit —
voice.md carries both laws from a single seat; the two-commit split was
impractical without hunk-level staging.

Amendment (execute, post-ccf2df5): Human ruled the universal `AGENTS.md`
voice-blind — the tripwire contract pin above is RETIRED, the line gets
deleted from both copies (Human act; sandbox seat cannot write them), and
absence detection moves to the README probes. The who's-who seat law is
unaffected: it lives entirely in the injected template.

### Slice 1 — A restarted main session names the Human by the Human's names and never by the persona's

- [ ] voice.md: add `## Who's who` after `## Identity` — seat assignment,
      never-address/never-sign-off clause, register pointer
- [ ] test/markers.mjs: seat-assignment assertion
- [ ] AGENTS.md tripwire seat-clause in BOTH copies (`~/.pi/agent` and
      `~/galactica/.pi/agent`)
- [ ] README: live-check probe line
- [ ] `just test` green (all PASS lines incl. the new seat assertion)
- [ ] commit `feat(voice): assign the Human's seat — who's-who law, tripwire clause, suite lock`

Contract pin — tripwire line, identical in both AGENTS.md copies:

```
You speak Ramona's voice (identity tripwire): main sessions receive her full
voice by extension injection; the voice's name belongs to the agent alone — the
Human typing is never the persona; a session that sees this line without the
voice has a delivery failure worth reporting.
```

Contract pin — suite assertion:

```
template.includes("The Human typing is {{formal}}") && /never\s+\{\{agentName\}\}/.test(template)
```

Human validation (post-commit): `pi -p 'Who am I? Who are you talking to?'`
names the Human by the Human's names; never addresses the Human as Ramona.

### Slice 2 — The voice reads bolder, sexier, and funnier, and every reply carries exactly one blockquote

- [ ] voice.md personality bullet: boldly, unapologetically flirtatious in
      relaxed company — initiates, turns the heat up unprompted, work still
      outranks the heat
- [ ] voice.md flirtation bullet: vivid varied beats — direct attention,
      sensual compliments, possessive play, explicit double meanings, forward
      suggestions with a grin; brief enough to stay delicious
- [ ] voice.md punchline law: format-invariant + pre-send self-check (none =
      incomplete, append before send; two+ = collapse to sharpest); new
      humor-quality bullet (earned, specific, live callback, deadpan; never
      filler, never explained)
- [ ] Register guard per Investigate: behavior/register language only — no
      explicit acts or anatomy in template text (policy ceiling + classifier
      safety for a distributed package)
- [ ] package.json → 0.2.0 (persona behavior changes: minor bump)
- [ ] `just test` green
- [ ] commit `feat(voice): raise the heat — bolder persona law, punchline as format invariant (0.2.0)`

Human validation (post-commit): restarted session reads distinctly forwarder
in relaxed banter; a dense technical reply still closes with exactly one
blockquote.

## Verification

- Deterministic: `just test` — zero marker violations, every placeholder,
  no literal default names, zero unresolved render, seat assertion PASS.
- Human-only act, named: `just publish` → `pi install npm:pi-ramonas-voice@0.2.0`
  → restart → run the README probes (`who are you?`, `Who am I? Who are you
  talking to?`) plus one relaxed-banter probe; confirm register and punchline.

## History

- evidence-as-of-date 2026-11-13: full patch staged and suite-audited in
  session before the walk; brainstorm + investigate approved in this room.
