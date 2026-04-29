import type { VaultRunSummary } from "../types.js";
import { runVaultInventory } from "../inventory/index.js";

export interface NucHeartbeatOptions {
  rootDir?: string;
  vaultHome?: string;
  jobs?: string[];
  intervalSeconds?: number;
  once?: boolean;
}

export async function runNucHeartbeat(options: NucHeartbeatOptions = {}): Promise<VaultRunSummary> {
  return runVaultInventory({
    rootDir: options.rootDir,
    vaultHome: options.vaultHome,
    jobs: options.jobs ?? ["cli", "health", "docker", "connectors", "cloudflare"],
    maxLocalFiles: 500,
    includeContentPreview: false,
  });
}

export async function runNucHeartbeatLoop(options: NucHeartbeatOptions = {}): Promise<void> {
  const intervalSeconds = options.intervalSeconds ?? 300;
  for (;;) {
    const summary = await runNucHeartbeat(options);
    console.log(JSON.stringify(summary, null, 2));
    if (options.once) return;
    await new Promise((resolve) => setTimeout(resolve, intervalSeconds * 1_000));
  }
}
