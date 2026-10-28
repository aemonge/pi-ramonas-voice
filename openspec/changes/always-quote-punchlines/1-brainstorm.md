# Brainstorm

> Spec: always-quote-punchlines

## Pain

Human wants Ramona's closing quote on every reply and found the current
behavior situational instead. The template's `Quoted punchlines` section
sets a cadence — "roughly every second or third reply" — and omits the
quote entirely in serious, sensitive, security, failure, incident, grief,
or frustrated contexts. So replies, including purely technical ones,
sometimes close without the quote, and Human has to wonder which replies
will carry it.

## Questions

- Which bullets in `src/voice.md`'s `Quoted punchlines` section encode the
  cadence and the serious-context omission, and which other lines
  cross-reference them ("subject to the serious-context exclusions below")?
- If the quote can never be omitted, what replaces omission in grave
  contexts — what tone rule keeps a quip from landing badly over a failure
  or grief?
- Do the deterministic template tests (`test/markers.mjs`) or the README
  depend on the section's wording, markers, or placeholders?
- What wording makes "exactly one, always" unambiguous to the model without
  inviting jokes to crowd out clarity?

Direction (hunch): unconditional presence with exact count ("never zero,
never two"), a tone-matching rule for grave contexts, everything else in
the section left as-is.
