# Execute

> Spec: voice-seat-and-heat · state legend: [ ] open · [x] done · ~ skipped

## Slice 1 — A restarted main session names the Human by the Human's names and never by the persona's

- [x] voice.md `## Who's who` after `## Identity`
      started_at: ~12:15Z · ended_at: ~12:16Z · total: ~2m · check: suite "PASS template assigns the seats" · paths: src/voice.md
- [x] test/markers.mjs seat-assignment assertion
      started_at: ~12:16Z · ended_at: ~12:16Z · total: ~1m · check: assertion fires PASS, and FAILs without the law (design) · paths: test/markers.mjs
- [ ] AGENTS.md — HUMAN RULING: voice-blind. Tripwire line RETIRED, not replaced; delete the `You are one of Ramona's agents … worth reporting.` paragraph from BOTH copies (Human act — sandbox seat cannot write them: EROFS / ENOENT). Seat law unaffected (lives in src/voice.md); absence detection = README probes.
      started_at: ~12:16Z · ended_at: pending Human paste · check: grep "Ramona" in both files → no hits; suite still green (zero markers anywhere) · paths: ~/.pi/agent/AGENTS.md, ~/galactica/.pi/agent/AGENTS.md
- [x] README live-check probe line
      started_at: ~12:16Z · ended_at: ~12:17Z · total: ~1m · check: probe documented · paths: README.md
- [x] `just test` green
      started_at: ~12:20Z · ended_at: ~12:21Z · total: ~1m · check: PASS ×6 via `THIN_AGENTS=$HOME/.pi/agent/AGENTS.md` (galactica ENOENT in sandbox; suite's own override mechanism). On the host, plain `just test` passes once the tripwire paste lands in the visible thin file.
- [x] feat(voice): who's-who seat law, hotter persona law, punchline invariant (0.2.0)
      hash: ccf2df5
      DRIFT (declared): Plan declared two slice-commits; voice.md carries both slices' law from one seat, so one combined commit certifies both. Plan Slices amendment appended.

## Slice 2 — The voice reads bolder, sexier, and funnier, and every reply carries exactly one blockquote

- [x] personality bullet — bold/unapologetically flirtatious, heat on own initiative, work outranks the heat
      started_at: ~12:22Z · ended_at: ~12:23Z · total: ~2m · check: exact-text edit landed (verbatim re-read after first mismatch) · paths: src/voice.md
- [x] flirtation bullet — vivid varied beats, delicious-not-noisy
      started_at: ~12:23Z · ended_at: ~12:23Z · check: landed · paths: src/voice.md
- [x] punchline law — format invariant + pre-send self-check; humor-quality bullet
      started_at: ~12:23Z · ended_at: ~12:23Z · check: landed · paths: src/voice.md
- [x] Register guard held — behavior/register language only, no explicit acts/anatomy in template text
      check: manual review of final wording · paths: src/voice.md
- [x] package.json → 0.2.0
      check: landed · paths: package.json
- [x] `just test` green (final law)
      check: PASS ×6 · paths: test/markers.mjs
- [x] commit
      hash: ccf2df5 (combined — see Slice 1 drift)

- [ ] Human validation — response: · outcome: · surfaced:

surfaced:
- AGENTS.md ruled voice-blind by Human — tripwire retired, deletion is a Human paste (script handed in-session); README "Visible absence" bullet + suite paragraph re-worded to probe-based detection → post-delivery
- galactica thin file absent from sandbox view → THIN_AGENTS override in-session; host-side suite path to confirm → post-delivery
- src/index.ts header comment still references the AGENTS.md tripwire — stale comment, engine untouched by scope law → post-delivery (tiny)
- openspec/schemas + templates modified by the gate CLI (5-post-delivery artifact) — left UNSTAGED deliberately, Human decides the chore commit → post-delivery
- rename order (settings-only, agentName → Gigi chosen) arrived mid-execute — outside this plan's scope; settings file created by Human; lands on restart → post-delivery note
