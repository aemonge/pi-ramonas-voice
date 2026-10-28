## Why

Human wants the closing quote on every reply, unconditionally. The current
`Quoted punchlines` section in `src/voice.md` sets a cadence ("roughly every
second or third reply") and omits punchlines entirely in serious contexts, so
the quote appears situationally.

## What Changes

- `src/voice.md` `Quoted punchlines` section moves from cadence-plus-exclusions
  to unconditional presence: every response carries exactly one compact
  Markdown blockquote punchline — never zero, never two.
- The serious-context omission rule is removed. Serious, sensitive, security,
  failure, incident, grief, or frustrated contexts still get the quote, but with
  restrained, warm, brief tone instead of sassy or forward.
- Placement, style, single-quote limit, and "never obscure the answer" rules
  are unchanged.

## Capabilities

### New Capabilities
- `voice-punchlines`: the persona's closing-punchline behavior contract —
  unconditional presence, exact count, tone matching, placement.

### Modified Capabilities
<!-- None: no existing specs live under openspec/specs/. -->

## Impact

- `src/voice.md` only — no code, settings, or test changes.
- Takes effect for sessions started after the package is reinstalled
  (`just install`); already-running sessions keep their rendered prompt.
