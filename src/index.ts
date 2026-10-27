// pi-ramonas-voice — main-only, settings-driven voice injection.
//
// Detection: a pi process launched inside another pi session (a subagent
// child) inherits PI_SESSION_ID / PI_SESSION_FILE pointing at the parent
// session. A main session launched from a human shell carries neither.
// Their presence marks a child; the voice is injected only when both are
// absent. (Probe evidence, 2026-10-23: child-shaped run carried both vars;
// the stripped main-shaped run carried neither.)
//
// Settings: $PI_CODING_AGENT_DIR/pi-ramonas-voice.settings.json (default
// ~/.pi/agent/). agentName and the five human-name tiers are configurable;
// a missing file, missing keys, or invalid JSON all fall back to the
// in-code defaults — settings never break injection. The settings file
// lives outside this repository on purpose: a local pi package loads from
// its checkout, so any file beside this one is a repo file in disguise.
//
// Injection: the persona template (voice.md beside this file) is rendered
// — {{agentName}}, {{formal}}, {{playful}}, {{flirt}}, {{serious}},
// {{grave}} substituted from settings — then appended to
// systemPromptOptions.appendSystemPrompt: a structured prompt append that
// Pi records as a transcript delta, never a whole-prompt
// forceSystemPrompt replacement. The extension injects prompt content
// only; it never gates tools or grants anything. Any {{ token surviving
// render, or an unreadable template, injects nothing that run: fail
// visibly through the AGENTS.md tripwire, never half-inject.
//
// Debug: set RAMONA_VOICE_DEBUG=1 to append a runtime trace to
// /tmp/ramona-voice-debug.log (factory, handler, detection, settings,
// injection size). Silent otherwise.

import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const voicePath = join(here, "voice.md");
const debugOn = Boolean(process.env.RAMONA_VOICE_DEBUG);

const agentDir = process.env.PI_CODING_AGENT_DIR ?? join(process.env.HOME ?? "", ".pi", "agent");
const settingsPath = join(agentDir, "pi-ramonas-voice.settings.json");

const DEFAULTS = {
  agentName: "Ramona",
  humanNames: {
    formal: "aemonge",
    playful: "Andy",
    flirt: "Andee",
    serious: "Andres",
    grave: "Andres Monge",
  },
} as const;

type Settings = {
  agentName: string;
  humanNames: Record<keyof typeof DEFAULTS.humanNames, string>;
};

const PLACEHOLDER_RE = /\{\{(\w+)\}\}/g;

function dbg(line: string): void {
  if (debugOn) {
    try {
      fs.appendFileSync("/tmp/ramona-voice-debug.log", `${new Date().toISOString()} ${line}\n`);
    } catch {
      /* debug logging is best-effort */
    }
  }
}

function isSubagentChild(): boolean {
  return Boolean(process.env.PI_SESSION_ID || process.env.PI_SESSION_FILE);
}

// Missing file, missing keys, or invalid JSON all resolve to defaults.
// A string value is taken as-is (spaces allowed); anything else falls
// back for that key alone.
function loadSettings(): Settings {
  let raw: any = null;
  try {
    raw = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
  } catch (err) {
    dbg(`settings unreadable at ${settingsPath} (${String(err)}) — using defaults`);
  }
  const tier = (value: unknown, fallback: string): string =>
    typeof value === "string" && value.length > 0 ? value : fallback;
  const file = raw && typeof raw === "object" ? raw : {};
  const names = file.humanNames && typeof file.humanNames === "object" ? file.humanNames : {};
  return {
    agentName: tier(file.agentName, DEFAULTS.agentName),
    humanNames: {
      formal: tier(names.formal, DEFAULTS.humanNames.formal),
      playful: tier(names.playful, DEFAULTS.humanNames.playful),
      flirt: tier(names.flirt, DEFAULTS.humanNames.flirt),
      serious: tier(names.serious, DEFAULTS.humanNames.serious),
      grave: tier(names.grave, DEFAULTS.humanNames.grave),
    },
  };
}

// Single-pass substitution: settings values are never re-scanned for
// placeholders of their own. Returns null when any {{ token survives —
// the caller injects nothing rather than half a persona.
function renderVoice(template: string, settings: Settings): string | null {
  const values: Record<string, string> = {
    agentName: settings.agentName,
    formal: settings.humanNames.formal,
    playful: settings.humanNames.playful,
    flirt: settings.humanNames.flirt,
    serious: settings.humanNames.serious,
    grave: settings.humanNames.grave,
  };
  const rendered = template.replace(PLACEHOLDER_RE, (match, key: string) =>
    key in values ? values[key] : match,
  );
  return rendered.includes("{{") ? null : rendered;
}

export default function factory(pi: any) {
  dbg(`factory called; isSubagentChild=${isSubagentChild()}; here=${here}`);
  if (debugOn) {
    pi.on("before_provider_request", (event: any) => {
      const msgs = event?.payload?.messages;
      if (Array.isArray(msgs)) {
        const summary = msgs.map((m: any) => {
          const text = typeof m?.content === "string" ? m.content : JSON.stringify(m?.content) ?? "";
          const ramona = /Ramona|kaomoji|Andee/i.test(text) ? "RAMONA" : "-";
          const head = m?.role === "system" ? ` head=${JSON.stringify(text.slice(0, 300))}` : "";
          return `${m?.role}(${text.length}${ramona !== "-" ? "," + ramona : ""})${head}`;
        });
        dbg(`provider request: ${msgs.length} messages [${summary.join(" ")}]`);
      } else {
        dbg(`provider request: payload keys=${Object.keys(event?.payload ?? {}).join(",")}`);
      }
    });
  }
  pi.on("before_agent_start", (event: any) => {
    dbg(`before_agent_start fired; messageType=${event?.messageType}; child=${isSubagentChild()}`);
    if (isSubagentChild()) return; // children stay clean — zero voice markers
    const opts = event?.systemPromptOptions;
    if (!opts) {
      dbg("  no systemPromptOptions — skipping");
      return;
    }
    let template: string;
    try {
      template = fs.readFileSync(voicePath, "utf8").trim();
    } catch (err) {
      // No asset: the tripwire line in the universal AGENTS.md marks the
      // missing delivery visibly; never inject partial content.
      dbg(`  voice.md read failed: ${String(err)}`);
      return;
    }
    const settings = loadSettings();
    const voice = renderVoice(template, settings);
    if (voice === null) {
      // Unresolved placeholders — settings or template drifted; inject
      // nothing rather than a persona with {{teeth}} showing.
      dbg(`  render left unresolved {{ }} tokens — injecting nothing this run`);
      return;
    }
    opts.appendSystemPrompt = opts.appendSystemPrompt
      ? `${opts.appendSystemPrompt}\n\n${voice}`
      : voice;
    dbg(`  settings: ${JSON.stringify(settings)} (from ${settingsPath})`);
    dbg(`  injected voice: ${voice.length} chars; appendSystemPrompt now ${opts.appendSystemPrompt.length} chars`);
    dbg(`  rendered systemPrompt after mutation: ${event.systemPrompt?.length ?? "?"} chars; hasAgentName=${settings.agentName.length > 0 && voice.includes(settings.agentName)}`);
  });
}
