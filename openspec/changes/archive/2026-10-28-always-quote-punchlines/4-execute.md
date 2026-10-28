# Execute

> Spec: always-quote-punchlines · state legend: [ ] open · [x] done · ~ skipped

## Slice 1 — Unconditional punchline contract in `src/voice.md`

- [x] Rewrite the `Quoted punchlines` section: exactly one quote — never
      zero, never two; every reply closes with one, no exceptions, keeping
      the technical-mode enumeration
      started_at: 2026-10-28T16:26Z · ended_at: 16:28Z · total: 2m ·
      check: `grep -n "zero, never two"` hits line 85 (phrase wraps at 80
      cols) · paths: src/voice.md
- [x] Replace the skip rule and the omission bullet with the tone-matching
      rule (restrained, warm, brief in grave contexts)
      started_at: 16:28Z · ended_at: 16:28Z · total: 0m ·
      check: `grep -c "Omit punchlines" src/voice.md` = 0 ·
      paths: src/voice.md
- [x] Repoint "serious-context exclusions below" → tone rule; drop
      "When used," optionality from the placement bullet
      started_at: 16:28Z · ended_at: 16:28Z · total: 0m ·
      check: `grep -c "tone rule above" src/voice.md` = 1;
      `grep -c "When used," src/voice.md` = 0 · paths: src/voice.md
- [x] `just test` — markers, placeholders, no literal names, clean render
      started_at: 16:29Z · ended_at: 16:29Z · total: 1m ·
      check: 5/5 PASS · paths: test/markers.mjs, src/voice.md
- [x] `just install` — new sessions load the updated template
      started_at: 16:29Z · ended_at: 16:29Z · total: 0m ·
      check: "Installed /home/aemonge/projects/pi-ramonas-voice" ·
      paths: package install state
- [x] feat(voice): force exactly one closing punchline on every reply
      hash: 79ef387

<!-- gate receipts land here while work runs -->

- [x] Human validation — response: Human archived the change after the
      `-e .` one-shot A/B (5.26s bare vs 5.74s with extension) showed the
      quote-closing reply behaving to spec · outcome: accepted — always-quote
      confirmed live from checkout · surfaced: `npm:pi-ramonas-voice@0.1.0`
      still shadows normal boots until 0.1.1 is published and updated;
      `pios-gate` needs PATH outside interactive shells.

  gate-attributed · tool: bash · paths: — · at 2026-10-28T16:32:56Z

  gate-attributed · tool: bash · paths: — · at 2026-10-28T16:37:03Z

  gate-attributed · tool: bash · paths: — · at 2026-10-28T16:38:52Z

  gate-attributed · tool: write · paths: /tmp/ramona-perf-probe.mjs · at 2026-10-28T16:39:02Z

  gate-attributed · tool: bash · paths: — · at 2026-10-28T16:39:05Z

  gate-attributed · tool: bash · paths: — · at 2026-10-28T16:42:34Z
