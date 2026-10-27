#!/usr/bin/env node
// Deterministic template check for pi-ramonas-voice.
//
// Names are settings-owned now, so no check may depend on what settings
// produce. Pass: the thin universal AGENTS.md carries zero voice-marker
// hits beyond the identity tripwire line; the persona template
// (src/voice.md) carries every template marker, every renderer
// placeholder, and no literal default name; and rendering with the
// in-code defaults leaves zero unresolved {{ tokens. Fail: non-zero exit
// with per-check detail.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Markers match TEMPLATE text only — never rendered values.
const MARKERS = ["kaomoji", "playfully", "(¬‿¬)"];

// Every renderer-known placeholder must appear in the template.
const PLACEHOLDERS = ["agentName", "formal", "playful", "flirt", "serious", "grave"];

// Literal default names must not appear as template text. "Andres Monge"
// is covered by the "Andres" word-boundary check.
const DEFAULT_NAMES = ["Ramona", "aemonge", "Andy", "Andee", "Andres"];

// In-code defaults mirrored here for the zero-unresolved render check.
const DEFAULTS = {
  agentName: "Ramona",
  formal: "aemonge",
  playful: "Andy",
  flirt: "Andee",
  serious: "Andres",
  grave: "Andres Monge",
};

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

// 2. Template checks: markers, placeholders, no literal default names,
//    zero-unresolved render with defaults.
try {
  const template = readFileSync(voicePath, "utf8");

  const templateCounts = counts(template);
  const missingMarkers = Object.entries(templateCounts).filter(([, n]) => n === 0);
  if (missingMarkers.length > 0) {
    failed = true;
    console.error(`FAIL template missing markers: ${JSON.stringify(Object.fromEntries(missingMarkers))}`);
  } else {
    console.log(`PASS template carries every marker: ${JSON.stringify(templateCounts)}`);
  }

  const missingPlaceholders = PLACEHOLDERS.filter(
    (key) => !template.includes(`{{${key}}}`)
  );
  if (missingPlaceholders.length > 0) {
    failed = true;
    console.error(`FAIL template missing placeholders: ${missingPlaceholders.map((k) => `{{${k}}}`).join(", ")}`);
  } else {
    console.log(`PASS template carries every placeholder: ${PLACEHOLDERS.map((k) => `{{${k}}}`).join(", ")}`);
  }

  const literalNames = DEFAULT_NAMES.filter((name) =>
    new RegExp(`(^|[^\\w])${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\w]|$)`, "i").test(template)
  );
  if (literalNames.length > 0) {
    failed = true;
    console.error(`FAIL template carries literal default names: ${literalNames.join(", ")}`);
  } else {
    console.log("PASS template carries no literal default name — names are settings-owned");
  }

  const rendered = template.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    key in DEFAULTS ? DEFAULTS[key] : match
  );
  if (rendered.includes("{{")) {
    failed = true;
    console.error("FAIL render with defaults leaves unresolved {{ }} tokens — the renderer would inject nothing");
  } else {
    console.log("PASS render with defaults: zero unresolved {{ }} tokens");
  }
} catch (err) {
  failed = true;
  console.error(`FAIL cannot read template at ${voicePath}: ${err.message}`);
}

process.exit(failed ? 1 : 0);
