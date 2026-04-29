#!/usr/bin/env node
import path from "node:path";
import { runVaultInventory, DEFAULT_VAULT_HOME } from "./inventory/index.js";
import { runNucHeartbeatLoop } from "./nuc/heartbeat.js";
import { printVaultPostgresSchema } from "./schema/postgres.js";

interface ParsedArgs {
  command: string;
  rootDir: string;
  vaultHome: string;
  jobs: string[];
  maxLocalFiles: number;
  includeContentPreview: boolean;
  once: boolean;
  intervalSeconds: number;
}

export async function main(argv = process.argv.slice(2)): Promise<void> {
  const args = parseArgs(argv);

  if (args.command === "schema") {
    console.log(printVaultPostgresSchema());
    return;
  }

  if (args.command === "heartbeat") {
    await runNucHeartbeatLoop({
      rootDir: args.rootDir,
      vaultHome: args.vaultHome,
      jobs: args.jobs.length > 0 ? args.jobs : undefined,
      once: args.once,
      intervalSeconds: args.intervalSeconds,
    });
    return;
  }

  if (args.command === "inventory") {
    const summary = await runVaultInventory({
      rootDir: args.rootDir,
      vaultHome: args.vaultHome,
      jobs: args.jobs,
      maxLocalFiles: args.maxLocalFiles,
      includeContentPreview: args.includeContentPreview,
    });
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  throw new Error(`Unknown vault-core command: ${args.command}`);
}

function parseArgs(argv: string[]): ParsedArgs {
  const command = argv[0] ?? "inventory";
  const args = argv.slice(1);
  const parsed: ParsedArgs = {
    command,
    rootDir: process.cwd(),
    vaultHome: DEFAULT_VAULT_HOME,
    jobs: [],
    maxLocalFiles: 5_000,
    includeContentPreview: false,
    once: false,
    intervalSeconds: Number(process.env.HEARTBEAT_INTERVAL_SECONDS ?? 300),
  };

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--root" && next) {
      parsed.rootDir = path.resolve(next);
      index++;
    } else if ((arg === "--out" || arg === "--vault-home") && next) {
      parsed.vaultHome = path.resolve(next);
      index++;
    } else if (arg === "--jobs" && next) {
      parsed.jobs = next.split(",").map((job) => job.trim()).filter(Boolean);
      index++;
    } else if (arg === "--limit" && next) {
      parsed.maxLocalFiles = Number(next);
      index++;
    } else if (arg === "--preview") {
      parsed.includeContentPreview = true;
    } else if (arg === "--once") {
      parsed.once = true;
    } else if (arg === "--interval" && next) {
      parsed.intervalSeconds = Number(next);
      index++;
    }
  }

  return parsed;
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
