import os from "node:os";
import path from "node:path";
import type { VaultInventoryOptions, VaultInventoryResult, VaultRunSummary } from "../types.js";
import { FileVaultStore } from "../store/fileVaultStore.js";
import { scanCloudflare, cloudflareJob } from "./cloudflare.js";
import { scanCliPresence, cliPresenceJob } from "./cliPresence.js";
import { scanConnectors, connectorsJob } from "./connectors.js";
import { scanDocker, dockerJob } from "./docker.js";
import { scanGitHub, githubJob } from "./github.js";
import { scanLocalFiles, localFilesJob } from "./localFiles.js";
import { scanServiceHealth, serviceHealthJob } from "./serviceHealth.js";

export const DEFAULT_VAULT_HOME = process.env.DREAMNET_VAULT_HOME ?? path.join(os.homedir(), ".dreamnet", "vault");

export const INVENTORY_JOBS = {
  local: { job: localFilesJob, run: scanLocalFiles },
  "local-files": { job: localFilesJob, run: scanLocalFiles },
  github: { job: githubJob, run: scanGitHub },
  docker: { job: dockerJob, run: scanDocker },
  cloudflare: { job: cloudflareJob, run: scanCloudflare },
  cli: { job: cliPresenceJob, run: scanCliPresence },
  health: { job: serviceHealthJob, run: scanServiceHealth },
  connectors: { job: connectorsJob, run: scanConnectors },
};

export type InventoryJobName = keyof typeof INVENTORY_JOBS;

export async function runVaultInventory(input: Partial<VaultInventoryOptions> = {}): Promise<VaultRunSummary> {
  const startedAt = new Date().toISOString();
  const options: VaultInventoryOptions = {
    rootDir: input.rootDir ?? process.cwd(),
    vaultHome: input.vaultHome ?? DEFAULT_VAULT_HOME,
    jobs: input.jobs && input.jobs.length > 0 ? input.jobs : ["local", "github", "docker", "cloudflare", "cli", "health", "connectors"],
    maxLocalFiles: input.maxLocalFiles ?? 5_000,
    includeContentPreview: input.includeContentPreview ?? false,
    now: input.now,
  };

  const store = new FileVaultStore(options.vaultHome);
  const results: VaultRunSummary["results"] = [];
  let totals = {
    sources: 0,
    objects: 0,
    events: 0,
    blockedEvents: 0,
    errors: 0,
  };

  for (const jobName of options.jobs) {
    const entry = INVENTORY_JOBS[jobName as InventoryJobName];
    if (!entry) {
      totals.errors++;
      continue;
    }

    const result: VaultInventoryResult = await entry.run(options);
    const receipt = await store.writeInventoryResult(result);
    results.push({
      jobId: result.job.id,
      status: receipt.status,
      sourceCount: result.sources.length,
      objectCount: result.objects.length,
      eventCount: result.events.length,
      receiptId: receipt.id,
      receiptHash: receipt.hash,
    });

    totals = {
      sources: totals.sources + result.sources.length,
      objects: totals.objects + result.objects.length,
      events: totals.events + result.events.length,
      blockedEvents: totals.blockedEvents + result.events.filter((event) => event.severity === "blocked").length,
      errors: totals.errors + result.errors.length,
    };
  }

  return {
    startedAt,
    finishedAt: new Date().toISOString(),
    vaultHome: options.vaultHome,
    results,
    totals,
  };
}
