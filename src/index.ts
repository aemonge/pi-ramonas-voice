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

import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const voicePath = join(here, "voice.md");

function isSubagentChild(): boolean {
  return Boolean(process.env.PI_SESSION_ID || process.env.PI_SESSION_FILE);
}

export default function factory(pi: any) {
  pi.on("before_agent_start", (event: any) => {
    if (isSubagentChild()) return; // children stay clean — zero voice markers
    const opts = event?.systemPromptOptions;
    if (!opts) return;
    let voice: string;
    try {
      voice = fs.readFileSync(voicePath, "utf8").trim();
    } catch {
      // No asset: the tripwire line in the universal AGENTS.md marks the
      // missing delivery visibly; never inject partial content.
      return;
    }
    opts.appendSystemPrompt = opts.appendSystemPrompt
      ? `${opts.appendSystemPrompt}\n\n${voice}`
      : voice;
  });
}
