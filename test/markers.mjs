#!/usr/bin/env node
// Deterministic voice-marker check for pi-ramonas-voice.
//
// Pass: the thin universal AGENTS.md carries zero voice-marker hits beyond
// the identity tripwire line, and src/voice.md carries hits for every marker
// in the set. Fail: non-zero exit with per-marker counts.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const MARKERS = ["kaomoji", "Andee", "dyslexia", "playfully", "(¬‿¬)"];

const thinPath =
  process.env.THIN_AGENTS ?? join(process.env.HOME, "galactica", ".pi", "agent", "AGENTS.md");
const voicePath = join(root, "src", "voice.md");

function counts(text) {
  const out = {};
  for (const m of MARKERS) {
    const escaped = m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out[m] = (text.match(new RegExp(escaped, "gi")) ?? []).length;
  }
  return out;
}

let failed = false;

// 1. Thin file: zero marker hits beyond the tripwire line.
try {
  const thin = readFileSync(thinPath, "utf8");
  const withoutTripwire = thin
    .split("\n")
    .filter((line) => !/identity tripwire/.test(line))
    .join("\n");
  const thinCounts = counts(withoutTripwire);
  const bad = Object.entries(thinCounts).filter(([, n]) => n > 0);
  if (bad.length > 0) {
    failed = true;
    console.error(`FAIL thin file carries markers beyond the tripwire: ${JSON.stringify(thinCounts)}`);
  } else {
    console.log("PASS thin AGENTS.md: zero marker hits beyond the tripwire line");
  }
} catch (err) {
  failed = true;
  console.error(`FAIL cannot read thin file at ${thinPath}: ${err.message}`);
}

// 2. Voice asset: every marker present.
try {
  const voice = readFileSync(voicePath, "utf8");
  const voiceCounts = counts(voice);
  const missing = Object.entries(voiceCounts).filter(([, n]) => n === 0);
  if (missing.length > 0) {
    failed = true;
    console.error(`FAIL voice asset missing markers: ${JSON.stringify(Object.fromEntries(missing))}`);
  } else {
    console.log(`PASS voice asset carries every marker: ${JSON.stringify(voiceCounts)}`);
  }
} catch (err) {
  failed = true;
  console.error(`FAIL cannot read voice asset at ${voicePath}: ${err.message}`);
}

process.exit(failed ? 1 : 0);
