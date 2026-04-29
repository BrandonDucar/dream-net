import type { VaultInventoryOptions, VaultInventoryResult } from "../types.js";
import { sha256Hex } from "../hash.js";
import { commandExists, runCommand } from "../runtime/command.js";
import { createEvent, createJob, createObject, createSource } from "./shared.js";

const CLI_COMMANDS = ["gh", "docker", "wrangler", "vercel", "gcloud", "tailscale", "node", "pnpm", "npm", "npx"];

export const cliPresenceJob = createJob("cli", "Local CLI presence inventory", "nuc", "scanCliPresence", [
  "cli",
  "nuc",
  "operator-tools",
]);

export async function scanCliPresence(_options: VaultInventoryOptions): Promise<VaultInventoryResult> {
  const startedAt = new Date().toISOString();
  const source = createSource({
    kind: "nuc",
    name: "Local operator CLI surface",
    system: "local-cli",
    scope: process.platform,
    authState: "not_required",
    now: startedAt,
  });

  const result: VaultInventoryResult = {
    job: cliPresenceJob,
    startedAt,
    finishedAt: startedAt,
    sources: [source],
    objects: [],
    events: [],
    errors: [],
  };

  for (const command of CLI_COMMANDS) {
    const presence = await commandExists(command);
    let version: string | undefined;

    if (presence.exists) {
      const versionResult = await runCommand(command, ["--version"], 8_000);
      version = (versionResult.stdout || versionResult.stderr).trim().split(/\r?\n/)[0];
    }

    const object = createObject({
      sourceId: source.id,
      kind: "health_check",
      externalId: command,
      uri: `cli://${command}`,
      title: command,
      contentHash: sha256Hex(JSON.stringify({ command, presence, version })),
      tags: ["cli", presence.exists ? "available" : "missing"],
      sensitivity: "internal",
      indexedAt: startedAt,
      metadata: { path: presence.path, version, exists: presence.exists },
    });
    result.objects.push(object);

    if (!presence.exists && ["wrangler", "vercel", "gcloud", "tailscale"].includes(command)) {
      result.events.push(
        createEvent({
          type: "recommended_cli_missing",
          severity: "warn",
          sourceId: source.id,
          objectId: object.id,
          message: `${command} is not available on PATH`,
          createdAt: startedAt,
          details: { command, error: presence.error },
        }),
      );
    }
  }

  result.finishedAt = new Date().toISOString();
  return result;
}
