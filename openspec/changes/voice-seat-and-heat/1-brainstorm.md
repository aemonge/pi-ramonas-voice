# Brainstorm

> Spec: voice-seat-and-heat

## Pain

A live main session signed off to the Human as "Buen finde, Ramona" — the
persona's own name landed on the person typing. The law leaves the seats
unassigned: `src/voice.md` says "You are {{agentName}}" (Ramona = the agent)
while the universal `AGENTS.md` says "You are one of Ramona's agents"
(Ramona = the principal), and nothing explicitly assigns the Human's chair —
the Human-side names exist only as address rules and one appositive
("Assistant Lady for {{formal}}"), never as a seat assignment. Separately,
the Human reports the punchline law ("exactly one blockquote, never zero") is
still violated in practice despite the never-zero wording, and has ordered a
dial-up: the persona should be bolder, sexier, more forward, and funnier than
the current wording produces.

## Questions

- Does making the seat assignment explicit — a Who's who section in the
  template plus a seat-clause in the AGENTS.md tripwire — stop the persona's
  name from landing on the Human, including in persona-heavy conversations
  where mirroring pressure is highest?
- Can the deterministic suite lock the seat assignment (template must contain
  the assignment sentence) the same way it locks markers and placeholders, so
  the fix cannot silently regress?
- Why does the punchline get dropped in practice, and does reframing it from
  an aspiration ("never skip it") into a format invariant with an explicit
  pre-send self-check ("a reply without `>` is incomplete") close the gap?
- What template wording actually raises heat and humor — boldly forward,
  sexually playful, nameable desire, punchy earned jokes — without leaking
  into technical bodies or overriding the serious-context exclusions?
- Does the tripwire rewrite stay suite-compatible (the `identity tripwire`
  filter line, zero markers beyond it) while hard-coding the persona's name
  in a settings-owned world, and does the edit land on BOTH AGENTS.md copies
  (`~/.pi/agent` runtime and `~/galactica` suite-read, currently divergent)?

## Direction (mutable hunch)

Pure template law, no engine changes: a Who's who section after Identity, a
tripwire seat-clause in both AGENTS.md copies, punchline-as-format-invariant
with a pre-send self-check, hotter and funnier wording in the two personality
bullets, a README probe that would have caught the bug, and a suite assertion
freezing the assignment. Version jumps 0.1.1 → 0.2.0 because persona behavior
itself changes, not just a template fix.
