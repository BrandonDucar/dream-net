import type { VaultInventoryOptions, VaultInventoryResult } from "../types.js";
import { sha256Hex } from "../hash.js";
import { commandExists, runCommand } from "../runtime/command.js";
import { createEvent, createJob, createObject, createSource } from "./shared.js";

interface GhRepo {
  name: string;
  url: string;
  visibility: string;
  updatedAt: string;
  isPrivate: boolean;
  primaryLanguage?: { name?: string } | null;
}

export const githubJob = createJob("github", "GitHub repository inventory", "repo", "scanGitHub", [
  "github",
  "repos",
  "code-source",
]);

export async function scanGitHub(_options: VaultInventoryOptions): Promise<VaultInventoryResult> {
  const startedAt = new Date().toISOString();
  const source = createSource({
    kind: "repo",
    name: "GitHub account BrandonDucar",
    system: "github",
    scope: "BrandonDucar",
    authState: "unknown",
    endpoint: "https://github.com/BrandonDucar",
    now: startedAt,
  });

  const result: VaultInventoryResult = {
    job: githubJob,
    startedAt,
    finishedAt: startedAt,
    sources: [source],
    objects: [],
    events: [],
    errors: [],
  };

  const gh = await commandExists("gh");
  if (!gh.exists) {
    source.authState = "missing";
    result.events.push(
      createEvent({
        type: "github_cli_missing",
        severity: "blocked",
        sourceId: source.id,
        message: "GitHub CLI is not installed or not on PATH",
        createdAt: startedAt,
        details: { error: gh.error },
      }),
    );
    result.finishedAt = new Date().toISOString();
    return result;
  }

  const auth = await runCommand("gh", ["auth", "status"], 12_000);
  source.authState = auth.exitCode === 0 ? "available" : "invalid";
  if (auth.exitCode !== 0) {
    result.events.push(
      createEvent({
        type: "github_auth_invalid",
        severity: "blocked",
        sourceId: source.id,
        message: "GitHub CLI auth is unavailable",
        createdAt: startedAt,
        details: { stderr: auth.stderr.slice(0, 1_000) },
      }),
    );
    result.finishedAt = new Date().toISOString();
    return result;
  }

  const repos = await runCommand(
    "gh",
    ["repo", "list", "BrandonDucar", "--limit", "100", "--json", "name,url,visibility,updatedAt,primaryLanguage,isPrivate"],
    30_000,
  );

  if (repos.exitCode !== 0) {
    result.errors.push(repos.stderr || repos.error || "Failed to list GitHub repositories");
    result.finishedAt = new Date().toISOString();
    return result;
  }

  const parsed = JSON.parse(repos.stdout) as GhRepo[];
  for (const repo of parsed) {
    const payload = JSON.stringify(repo);
    result.objects.push(
      createObject({
        sourceId: source.id,
        kind: "repository",
        externalId: repo.name,
        uri: repo.url,
        title: repo.name,
        contentHash: sha256Hex(payload),
        tags: ["github", repo.visibility.toLowerCase(), repo.primaryLanguage?.name?.toLowerCase() ?? "unknown-language"],
        sensitivity: repo.isPrivate ? "confidential" : "public",
        indexedAt: startedAt,
        metadata: {
          visibility: repo.visibility,
          isPrivate: repo.isPrivate,
          updatedAt: repo.updatedAt,
          primaryLanguage: repo.primaryLanguage?.name,
        },
      }),
    );
  }

  result.finishedAt = new Date().toISOString();
  return result;
}
