import type { VaultInventoryOptions, VaultInventoryResult } from "../types.js";
import { sha256Hex } from "../hash.js";
import { commandExists, runCommand } from "../runtime/command.js";
import { redactSensitiveText } from "../security/redaction.js";
import { createEvent, createJob, createObject, createSource } from "./shared.js";

const CLOUDFLARE_READ_COMMANDS = [
  { id: "d1", label: "D1 databases", args: ["d1", "list"] },
  { id: "r2", label: "R2 buckets", args: ["r2", "bucket", "list"] },
  { id: "pages", label: "Pages projects", args: ["pages", "project", "list"] },
  { id: "kv", label: "KV namespaces", args: ["kv", "namespace", "list"] },
];

export const cloudflareJob = createJob(
  "cloudflare",
  "Cloudflare resource inventory",
  "cloudflare",
  "scanCloudflare",
  ["cloudflare", "workers", "d1", "r2", "pages"],
);

export async function scanCloudflare(_options: VaultInventoryOptions): Promise<VaultInventoryResult> {
  const startedAt = new Date().toISOString();
  const source = createSource({
    kind: "cloudflare",
    name: "Cloudflare account",
    system: "cloudflare",
    scope: "wrangler",
    authState: "unknown",
    endpoint: "https://api.cloudflare.com/client/v4",
    now: startedAt,
  });

  const result: VaultInventoryResult = {
    job: cloudflareJob,
    startedAt,
    finishedAt: startedAt,
    sources: [source],
    objects: [],
    events: [],
    errors: [],
  };

  const wrangler = await commandExists("wrangler");
  if (!wrangler.exists) {
    source.authState = "missing";
    result.events.push(
      createEvent({
        type: "wrangler_missing",
        severity: "blocked",
        sourceId: source.id,
        message: "Wrangler CLI is not installed or not on PATH",
        createdAt: startedAt,
        details: { error: wrangler.error },
      }),
    );
    result.finishedAt = new Date().toISOString();
    return result;
  }

  const whoami = await runCommand("wrangler", ["whoami"], 20_000);
  if (whoami.exitCode !== 0) {
    const combined = `${whoami.stdout}\n${whoami.stderr}`;
    source.authState = combined.toLowerCase().includes("not logged in") ? "expired" : "invalid";
    result.events.push(
      createEvent({
        type: "cloudflare_auth_blocked",
        severity: "blocked",
        sourceId: source.id,
        message: "Cloudflare inventory blocked until Wrangler auth is refreshed",
        createdAt: startedAt,
        details: {
          hint: "Set CLOUDFLARE_API_TOKEN or run wrangler login in an interactive terminal.",
          stderr: redactSensitiveText(combined).redactedText.slice(0, 1_500),
        },
      }),
    );
    result.finishedAt = new Date().toISOString();
    return result;
  }

  source.authState = "available";
  for (const command of CLOUDFLARE_READ_COMMANDS) {
    const scan = await runCommand("wrangler", command.args, 30_000);
    const combined = redactSensitiveText(`${scan.stdout}\n${scan.stderr}`).redactedText;
    const object = createObject({
      sourceId: source.id,
      kind: "cloud_resource",
      externalId: command.id,
      uri: `cloudflare://${command.id}`,
      title: command.label,
      contentHash: sha256Hex(combined),
      tags: ["cloudflare", command.id],
      sensitivity: "internal",
      indexedAt: startedAt,
      metadata: {
        exitCode: scan.exitCode,
        outputPreview: combined.slice(0, 4_000),
      },
    });
    result.objects.push(object);

    if (scan.exitCode !== 0) {
      result.events.push(
        createEvent({
          type: "cloudflare_resource_scan_failed",
          severity: "warn",
          sourceId: source.id,
          objectId: object.id,
          message: `Cloudflare ${command.label} scan failed`,
          createdAt: startedAt,
          details: { command: ["wrangler", ...command.args].join(" "), outputPreview: combined.slice(0, 1_000) },
        }),
      );
    }
  }

  result.finishedAt = new Date().toISOString();
  return result;
}
