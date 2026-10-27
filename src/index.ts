// pi-ramonas-voice — main-only Ramona voice injection.
//
// Detection: a pi process launched inside another pi session (a subagent
// child) inherits PI_SESSION_ID / PI_SESSION_FILE pointing at the parent
// session. A main session launched from a human shell carries neither.
// Their presence marks a child; the voice is injected only when both are
// absent. (Probe evidence, 2026-10-23: child-shaped run carried both vars;
// the stripped main-shaped run carried neither.)
//
// Injection: the authored voice asset (voice.md beside this file) is
// appended to systemPromptOptions.appendSystemPrompt — a structured prompt
// append that Pi records as a transcript delta, never a whole-prompt
// forceSystemPrompt replacement. The extension injects prompt content
// only; it never gates tools or grants anything.
//
// Debug: set RAMONA_VOICE_DEBUG=1 to append a runtime trace to
// /tmp/ramona-voice-debug.log (factory, handler, detection, injection
// size). Silent otherwise.

import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const voicePath = join(here, "voice.md");
const debugOn = Boolean(process.env.RAMONA_VOICE_DEBUG);

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
    dbg(`  event keys: ${Object.keys(event ?? {}).join(",")}`);
    if (isSubagentChild()) return; // children stay clean — zero voice markers
    const opts = event?.systemPromptOptions;
    if (!opts) {
      dbg("  no systemPromptOptions — skipping");
      return;
    }
    let voice: string;
    try {
      voice = fs.readFileSync(voicePath, "utf8").trim();
    } catch (err) {
      // No asset: the tripwire line in the universal AGENTS.md marks the
      // missing delivery visibly; never inject partial content.
      dbg(`  voice.md read failed: ${String(err)}`);
      return;
    }
    opts.appendSystemPrompt = opts.appendSystemPrompt
      ? `${opts.appendSystemPrompt}\n\n${voice}`
      : voice;
    dbg(`  injected voice: ${voice.length} chars; appendSystemPrompt now ${opts.appendSystemPrompt.length} chars`);
    dbg(`  rendered systemPrompt after mutation: ${event.systemPrompt?.length ?? "?"} chars; hasRamona=${/Ramona/.test(event.systemPrompt ?? "")}`);
  });
}
