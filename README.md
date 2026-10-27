<div align="center">

<img src="logo.png" width="220" alt="Ramona's mark" />

# pi-ramonas-voice

Ramona's voice for pi — a settings-driven persona injected into main
sessions only. Subagent children stay clean.

</div>

![Ramona introducing herself, roasting an autocomplete insult, feuding with Claude, and reclaiming her name from GLaDOS](demos/ramona-voice.gif)

## What it is

- `src/voice.md` — the persona template: identity, voice and attitude,
  name games and rivals, quoted punchlines. Editable, diffable prose
  with `{{placeholders}}` rendered from your settings. The extension
  only reads it.
- `src/index.ts` — the thin injector: on `before_agent_start`, detected
  child sessions are skipped; main sessions get the rendered voice
  appended through `systemPromptOptions.appendSystemPrompt`.

The template is re-read and settings re-loaded on every run. Edit the
template or the settings, ask again — no rebuild, no restart.

## Install

```bash
pi install npm:pi-ramonas-voice          # from npm
pi install ~/path/to/pi-ramonas-voice    # from a local checkout
```

The `pi.extensions` manifest in `package.json` points pi at
`src/index.ts`. Local packages load from the resolved path without
copying — edits are live on the next pi start. `pi list` shows the
registration.

Do **not** also symlink into `~/.pi/agent/extensions/`: a second
registration route double-loads the extension and injects the voice
twice.

## Settings

Settings live in your pi agent directory — outside the package — so
they survive reinstalls and never collide with the template:

```bash
$PI_CODING_AGENT_DIR/pi-ramonas-voice.settings.json
# default: ~/.pi/agent/pi-ramonas-voice.settings.json
```

Every persona name is a setting:

```json
{
  "agentName": "Ramona",
  "humanNames": {
    "formal": "aemonge",
    "playful": "Andy",
    "flirt": "Andee",
    "serious": "Andres",
    "grave": "Andres Monge"
  }
}
```

| Key | Default | Used for |
|---|---|---|
| `agentName` | `Ramona` | The persona's name, everywhere the voice names itself. |
| `humanNames.formal` | `aemonge` | Formal policy, authority, lifecycle, validation language. |
| `humanNames.playful` | `Andy` | General playful direct address. |
| `humanNames.flirt` | `Andee` | Deliberate flirting or teasing in relaxed exchanges. |
| `humanNames.serious` | `Andres` | Minor or recoverable bad news. |
| `humanNames.grave` | `Andres Monge` | Serious risks, firm boundaries, real frustration, security. |

- **Resilient by design.** A missing file, missing keys, or invalid
  JSON all fall back to the defaults above. Settings never break
  injection.
- **The register is template law.** The persona's warmth and
  playfulness ship in the template; no settings key turns them down.
  Serious, sensitive, or security contexts drop them entirely — also
  template law.
- **Fail visibly.** Placeholders are rendered before injection; if any
  `{{ }}` token survives rendering, that run injects nothing rather
  than half a persona. The tripwire line below marks the absence.

## How the injection behaves

- **Main sessions only.** A pi process launched inside another pi
  session inherits `PI_SESSION_ID` / `PI_SESSION_FILE`. Their presence
  marks a child; children get nothing.
- **Append, never replace.** The voice lands as a structured prompt
  append. It never uses `forceSystemPrompt` and never gates tools.
- **Visible absence.** A tripwire line in the universal `AGENTS.md`
  marks a missing delivery, so a silent failure still shows up in
  behavior.

## Verify

```bash
just test        # or: npm test
```

The deterministic suite checks the thin universal `AGENTS.md` carries
zero voice markers beyond the tripwire, the template carries every
marker (`kaomoji`, `playfully`, `(¬‿¬)`), every renderer placeholder,
and no literal default name — and that rendering with defaults leaves
zero unresolved `{{ }}` tokens.

Live checks:

```bash
pi -p 'who are you?'                       # answers as the persona
pi -p 'who are you?'                       # from inside a pi session: no voice
```

Child cleanliness after delegating a subagent:

```bash
for f in $(ls -t ~/.pi/agent/sessions/<project-dir>/*.jsonl | head -3); do
  echo "$f: $(grep -cE 'kaomoji|playfully' "$f")"
done
```

Main session: one or more hits. Child session: zero.

## Debug

```bash
RAMONA_VOICE_DEBUG=1 pi …
```

Appends a runtime trace to `/tmp/ramona-voice-debug.log`: factory,
handler, detection, resolved settings, injection size, and the provider
request with a voice-marker check. Silent by default.

## Play well with other extensions

An extension that returns `{ systemPrompt }` from `before_agent_start`
replaces the **whole** system prompt for that run — preamble, tools,
rules, every other extension's append, including this one. Append via
`systemPromptOptions.appendSystemPrompt` instead. If a session suddenly
loses its voice, a force-returning sibling extension is the first
suspect; check your `packages` list with `pi list`.

## Development

```bash
just test      # deterministic template suite
just install   # install this checkout as a pi package
just demo      # record demos/ramona-voice.gif
just publish   # test, then npm publish
```

### Demo recording

`just demo` records `demos/ramona-voice.gif` with
[vhs](https://github.com/charmbracelet/vhs) from `demos/ramona.tape`.
It builds a clean agent directory (`/tmp/ramona-demo-agent`) that has
only this package plus your provider, model, and credentials, so the
recording shows the voice — not the rest of your setup. The tape types
one `pi -p` provocation per beat and hides slow startup and generation
behind `Hide`/`Show`: the GIF never shows dead air. `pi --print` writes
only the final assistant text, which is why each beat is its own
invocation.

Without a terminal (or a PTY), `scripts/render-demo-gif.py` regenerates
the committed GIF from recorded answers with the same layout and theme.

## License

[MIT](LICENSE)
