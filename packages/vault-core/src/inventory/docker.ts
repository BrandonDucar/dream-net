import type { VaultInventoryOptions, VaultInventoryResult } from "../types.js";
import { sha256Hex } from "../hash.js";
import { commandExists, runCommand } from "../runtime/command.js";
import { createEvent, createJob, createObject, createSource } from "./shared.js";

interface DockerPsRow {
  ID?: string;
  Image?: string;
  Names?: string;
  Status?: string;
  Ports?: string;
  RunningFor?: string;
}

export const dockerJob = createJob("docker", "Docker runtime inventory", "container", "scanDocker", [
  "docker",
  "containers",
  "nuc-health",
]);

export async function scanDocker(_options: VaultInventoryOptions): Promise<VaultInventoryResult> {
  const startedAt = new Date().toISOString();
  const source = createSource({
    kind: "container",
    name: "Local Docker runtime",
    system: "docker",
    scope: "local",
    authState: "not_required",
    now: startedAt,
  });

  const result: VaultInventoryResult = {
    job: dockerJob,
    startedAt,
    finishedAt: startedAt,
    sources: [source],
    objects: [],
    events: [],
    errors: [],
  };

  const docker = await commandExists("docker");
  if (!docker.exists) {
    result.events.push(
      createEvent({
        type: "docker_cli_missing",
        severity: "blocked",
        sourceId: source.id,
        message: "Docker CLI is not installed or not on PATH",
        createdAt: startedAt,
        details: { error: docker.error },
      }),
    );
    result.finishedAt = new Date().toISOString();
    return result;
  }

  const ps = await runCommand("docker", ["ps", "--format", "{{json .}}"], 20_000);
  if (ps.exitCode !== 0) {
    result.errors.push(ps.stderr || ps.error || "Failed to list Docker containers");
    result.finishedAt = new Date().toISOString();
    return result;
  }

  const rows = ps.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as DockerPsRow);

  for (const row of rows) {
    const status = row.Status ?? "";
    const object = createObject({
      sourceId: source.id,
      kind: "container",
      externalId: row.Names ?? row.ID ?? "unknown",
      uri: `docker://${row.Names ?? row.ID ?? "unknown"}`,
      title: row.Names ?? row.Image ?? "Docker container",
      contentHash: sha256Hex(JSON.stringify(row)),
      tags: ["docker", status.toLowerCase().includes("unhealthy") ? "unhealthy" : "running"],
      sensitivity: "internal",
      indexedAt: startedAt,
      metadata: row as Record<string, unknown>,
    });
    result.objects.push(object);

    if (status.toLowerCase().includes("unhealthy")) {
      result.events.push(
        createEvent({
          type: "docker_container_unhealthy",
          severity: "warn",
          sourceId: source.id,
          objectId: object.id,
          message: `Docker container ${row.Names ?? row.ID} is unhealthy`,
          createdAt: startedAt,
          details: { status, image: row.Image },
        }),
      );
    }
  }

  const compose = await runCommand("docker", ["compose", "config", "--services"], 20_000);
  if (compose.exitCode === 0) {
    source.metadata = {
      ...source.metadata,
      composeServices: compose.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
    };
  }

  result.finishedAt = new Date().toISOString();
  return result;
}
