#!/usr/bin/env tsx
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

type Evidence = {
  id: string;
  count: number | null;
  source: string;
  sourceType: string;
  confidence: string;
  note?: string;
};

type ClaimHit = {
  path: string;
  line: number;
  claim: string;
  text: string;
};

const root = process.cwd();
const args = new Set(process.argv.slice(2));

function readJson(path: string): any | null {
  const full = join(root, path);
  if (!existsSync(full)) return null;
  return JSON.parse(readFileSync(full, "utf8"));
}

function countMacroAgents(value: any): number | null {
  if (!value) return null;
  if (Array.isArray(value)) return value.length;
  if (Array.isArray(value.agents)) return value.agents.length;
  if (value.agents && typeof value.agents === "object") return Object.keys(value.agents).length;
  if (typeof value === "object") return Object.keys(value).length;
  return null;
}

function countNanoAgents(value: any): number | null {
  if (!value) return null;
  if (Array.isArray(value)) return value.length;
  if (Array.isArray(value.nanoAgents)) return value.nanoAgents.length;
  if (Array.isArray(value.agents)) return value.agents.length;
  return null;
}

const ignoredDirs = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".wrangler",
  "attached_assets"
]);

const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".yml",
  ".yaml",
  ".toml",
  ".txt",
  ".svelte"
]);

function hasTextExtension(path: string): boolean {
  const lower = path.toLowerCase();
  return Array.from(textExtensions).some((ext) => lower.endsWith(ext));
}

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (ignoredDirs.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, files);
    } else if (st.isFile() && st.size < 2_000_000 && hasTextExtension(full)) {
      files.push(full);
    }
  }
  return files;
}

function findClaimHits(): ClaimHit[] {
  const patterns: Array<[string, RegExp]> = [
    ["24/24 agents", /24\/24|24\s+active\s+agents/i],
    ["503 agents", /503\+?\s+agents?|503\s+Agents\s+Active/i],
    ["115 mini agents", /115\s+mini\s+agents?/i],
    ["17900 nano agents", /17,900|17900/i],
    ["21271 nano agents", /21,271|21271/i],
    ["Neon endpoint disabled", /endpoint has been disabled|Neon endpoint disabled/i]
  ];

  const hits: ClaimHit[] = [];
  for (const file of walk(root)) {
    const rel = relative(root, file).replace(/\\/g, "/");
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((text, index) => {
      for (const [claim, pattern] of patterns) {
        if (pattern.test(text)) {
          hits.push({
            path: rel,
            line: index + 1,
            claim,
            text: text.trim().slice(0, 220)
          });
        }
      }
    });
  }
  return hits;
}

const comprehensive = readJson("COMPREHENSIVE_AGENT_INVENTORY.json");
const macro = readJson("data/agents.json");
const nano = readJson("data/viral-nano-swarm.json");
const claimHits = findClaimHits();

const evidence: Evidence[] = [];

if (comprehensive?.summary) {
  evidence.push({
    id: "local-comprehensive-inventory",
    count: comprehensive.summary.totalAgents ?? null,
    source: "COMPREHENSIVE_AGENT_INVENTORY.json",
    sourceType: "machine-readable local inventory",
    confidence: "high-for-local-working-tree",
    note: `active=${comprehensive.summary.byStatus?.active ?? "unknown"}, stub=${comprehensive.summary.byStatus?.stub ?? "unknown"}`
  });
} else {
  evidence.push({
    id: "local-comprehensive-inventory",
    count: null,
    source: "COMPREHENSIVE_AGENT_INVENTORY.json",
    sourceType: "machine-readable local inventory",
    confidence: "missing",
    note: "File not found or missing summary."
  });
}

evidence.push({
  id: "macro-agents-data-file",
  count: countMacroAgents(macro),
  source: "data/agents.json",
  sourceType: "structured macro registry",
  confidence: macro ? "high-for-file" : "missing",
  note: macro ? undefined : "File not present in this checkout."
});

evidence.push({
  id: "nano-swarm-data-file",
  count: countNanoAgents(nano),
  source: "data/viral-nano-swarm.json",
  sourceType: "large generated nano-swarm dataset",
  confidence: nano ? "high-for-file" : "missing",
  note: nano ? undefined : "File not present in this checkout."
});

const report = {
  generatedAt: new Date().toISOString(),
  principle: "Layered truth: runtime, registry, swarm dataset, UI copy, and narrative docs are separate count layers.",
  evidence,
  claimHits,
  summary: {
    localRegistryCount: comprehensive?.summary?.totalAgents ?? null,
    localActiveCount: comprehensive?.summary?.byStatus?.active ?? null,
    localStubCount: comprehensive?.summary?.byStatus?.stub ?? null,
    macroDataCount: countMacroAgents(macro),
    nanoDataCount: countNanoAgents(nano),
    claimHitCount: claimHits.length
  }
};

if (args.has("--write")) {
  const out = join(root, "config", "agent-registry-canonical.json");
  writeFileSync(out, JSON.stringify(report, null, 2) + "\n");
  console.log(`Wrote ${relative(root, out)}`);
} else if (args.has("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("DreamNet Agent Count Reconciliation");
  console.log(`Generated: ${report.generatedAt}`);
  for (const item of evidence) {
    console.log(`- ${item.id}: ${item.count ?? "missing"} (${item.confidence}) from ${item.source}`);
    if (item.note) console.log(`  note: ${item.note}`);
  }
  console.log(`Claim hits: ${claimHits.length}`);
  for (const hit of claimHits.slice(0, 25)) {
    console.log(`- ${hit.claim}: ${hit.path}:${hit.line} ${hit.text}`);
  }
  if (claimHits.length > 25) {
    console.log(`... ${claimHits.length - 25} more hits omitted; rerun with --json for full output.`);
  }
}
