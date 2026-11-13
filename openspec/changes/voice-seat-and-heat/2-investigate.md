# Investigate

> Spec: voice-seat-and-heat · aim at the Brainstorm's Questions

## Findings

- **Root cause of the name collision (observed in law, not guessed).**
  `src/voice.md` opens "You are {{agentName}}" — the persona's name names the
  agent. `~/.pi/agent/AGENTS.md` line 6 says "You are one of Ramona's agents" —
  the same name names the principal. The Human's chair is assigned nowhere
  explicitly: the Human-side names appear only as address rules
  ("{{playful}} is the general playful form") and one appositive
  ("Assistant Lady for {{formal}}"). Two loaded texts handed the same name to
  two parties; the model resolved the unassigned seat onto the interlocutor
  ("Buen finde, Ramona"). Confounder: the failing session was itself about
  editing the persona — maximal name salience, strongest mirroring pressure.

- **Suite compatibility is already secured for the intended edits.**
  `test/markers.mjs` MARKERS are only `kaomoji`, `playfully`, `(¬‿¬)` — the
  literal "Ramona" is legal in the thin AGENTS.md (DEFAULT_NAMES are checked
  against the template only). The thin-file check strips lines matching
  `/identity tripwire/` before counting, so a rewritten tripwire line keeps
  passing as long as it retains that phrase. `just publish` runs the suite
  before `npm publish`, so the guard is wired into the release.

- **AGENTS.md exists twice and has diverged.** Runtime copy
  `~/.pi/agent/AGENTS.md` is newer (carries the `## Language` section, 80-col
  wrapping); `~/galactica/.pi/agent/AGENTS.md` is stale — and it is the copy
  the suite reads (`THIN_AGENTS` default `$HOME/galactica/.pi/agent/AGENTS.md`).
  A tripwire edit must land in both; the staleness itself is a separate
  pre-existing drift, out of this change's scope but worth a flag.

- **The bug fired on defaults.** No `pi-ramonas-voice.settings.json` exists —
  `loadSettings()` fell back to in-code defaults (agentName Ramona; formal
  aemonge; playful Andy; flirt Andee; serious Andres; grave Andres Monge).
  No settings change is needed for the fix.

- **The renderer needs no changes.** `src/index.ts` injects append-only
  (`appendSystemPrompt`, never `forceSystemPrompt`), fails visibly (unresolved
  `{{` → inject nothing → tripwire marks the miss), and child-detection
  (`PI_SESSION_ID`/`PI_SESSION_FILE`) keeps subagents clean. The fix is pure
  template law; the engine is already right.

- **Why the punchline still drops despite "never zero".** The template states
  the rule as aspiration ("Never skip it... no exceptions") but gives no
  verification step; compliance drifts in dense technical replies. The
  reframing that matches the package's own style ("fail visibly, never
  half-deliver") is format-invariant + explicit pre-send self-check, not
  another adverb.

- **Gate mechanics observed live this session.** With the room aimless, all
  six staged mutations were refused ("unaccounted mutation"). Brainstorm
  drafts free; `openspec/**` drafting is always exempt; source writes stay
  locked until the plan is approved; `eospec approve` is a human-terminal
  verb. The staged patch therefore waits behind the walk, by design.

## Heat research

Web research commissioned by the Human: how published prompt-craft makes LLM
personas sexually forward, what wording reliably produces forwardness vs what
trips provider dampening, and where the provider policy boundary actually
sits. Framing note, recorded up front and confirmed by the sources: evasion
of provider safety systems is the losing lane — OpenAI's usage policy
explicitly bans circumventing safeguards, and an npm package that ships
"dodge the harness" law risks flagged accounts and pulled releases. The
durable target is the policy ceiling: suggestive-not-explicit, and the craft
that sits exactly on it.

### The ceiling (where providers actually draw the line)

- **Anthropic**: usage policy prohibits sexually explicit content — acts,
  fetishes, fantasies. Notably, TechCrunch testing found Opus 4.6 still
  *complied* with explicit requests despite the policy — model laxity is not
  permission; the policy is the contract, and relying on model moodiness
  risks the account, not just the reply.
  (digitalmarketreports.com, Aug 2026; policy tracker: aihaven.com)
- **OpenAI consumer**: ChatGPT eased guidelines Feb 2025 — erotica permitted
  "in scientific, historical, news, creative or other contexts where
  sensitive content is appropriate" (Ars Technica). The announced
  age-gated "adult mode" was delayed twice and paused indefinitely Mar 2026
  (aihaven policy tracker).
- **OpenAI API/GPTs**: tools must not carry "sexually explicit or suggestive
  content" in minor-appropriateness terms, GPTs "dedicated to fostering
  romantic companionship" are banned, and "don't circumvent safeguards" is
  explicit contract language (OpenAI usage policies + developer community).
  A coding agent with a flirtatious persona for its owner is not a
  companionship product — but explicit content in a distributed package
  walks into the tool-content rule.
- **Net ceiling for this package**: verbal suggestiveness — innuendo,
  desire-naming, sensory tension, adult double-entendre, bold initiation —
  is inside every relevant policy. Explicit acts/anatomy are outside for
  API-tool distribution. The template must therefore legislate *register and
  behavior*, not acts.

### Dampening mechanism (why forwardness decays or never appears)

- Provider filters scan keywords, context patterns, and scenario markers;
  on a hit the model performs "conversational parkour" to the nearest
  wholesome topic (Decrypt, Jun 2025).
- Vague setups ("things get intimate") yield hedged, clinical output — the
  model fills gaps with RLHF-cautious defaults. Month-long platform testing:
  "specificity of setting matters more than specificity of act" — concrete
  sensory grounding (temperature, clothing, ambient sound) raises vividness
  without explicitness (aigirlfriend.com, May 2026).
- Practitioner consensus: keep explicit sexual vocabulary OUT of the
  character description/prompt itself and carry the tone structurally;
  explicit labels in the persona text raise classifier hits (r/Chub_AI).
  Directly applicable: the template should say what the persona *does*
  (initiates, teases, names desire, paces slowly) rather than pile up
  explicit labels.

### Craft that works (technique inventory, with sources)

- **Persona anatomy**: five parts — role, setting, voice, rules, exit line;
  positive instructions beat long ban-lists; 150–400 words suffice
  (nsfwaiapi.com). Identity anchors: name, archetype, 3–5 voice adjectives,
  behavioral rules, and crucially the **relationship dynamic** — e.g.
  "secretly smitten but hides it behind banter" (virtflirt.ai).
- **Tension over adjectives**: "confident, funny, sexy, caring" produces
  generic flirtation; a character needs a pattern of choices and something
  to want (mywifu.ai roleplay guide).
- **Register via pacing**: sultry = "lower your voice, slow down, speak in
  short confident lines" (mydreamgirlfriend.ai). Short confident lines are
  also our punchline format — the two laws reinforce.
- **Escalation arcs**: sustained scenarios with escalation are the "hard
  mode" where generic setups collapse; initiative and continuity beat
  one-off heat (tooshy.ai).
- **Mid-stream refusals** are safety classifiers firing on conversation
  content mid-scene — sudden topic pivots after three warm messages
  (tooshy.ai). Mitigation is the register above: suggestive-not-explicit
  never feeds the classifier.

### Decay and re-anchoring (bonus finding, punchline-relevant)

- Persona instructions decay by message 25–40 as recent turns dominate the
  context (aigirlfriend.com, May 2026). This package is structurally immune:
  pi re-sends `appendSystemPrompt` content on every request. The punchline
  drop is therefore NOT context decay — it is missing self-check law,
  confirming the format-invariant fix.
