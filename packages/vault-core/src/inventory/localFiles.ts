import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import type { Dirent } from "node:fs";
import type { VaultInventoryOptions, VaultInventoryResult } from "../types.js";
import { sha256Hex } from "../hash.js";
import { classifySensitivity, redactSensitiveText } from "../security/redaction.js";
import { createEvent, createJob, createObject, createSource } from "./shared.js";

const EXCLUDED_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".vercel",
  ".wrangler",
  "artifacts",
  "typechain-types",
]);

const TEXT_EXTENSIONS = new Set([
  ".md",
  ".txt",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".yml",
  ".yaml",
  ".toml",
  ".env",
  ".example",
  ".prisma",
  ".sql",
  ".sh",
  ".ps1",
  ".html",
  ".css",
]);

export const localFilesJob = createJob(
  "local-files",
  "Local repo file manifest",
  "local_files",
  "scanLocalFiles",
  ["repo", "files", "hashes", "secret-safe"],
);

export async function scanLocalFiles(options: VaultInventoryOptions): Promise<VaultInventoryResult> {
  const startedAt = new Date().toISOString();
  const source = createSource({
    kind: "local_files",
    name: "Local DreamNet checkout",
    system: "filesystem",
    scope: options.rootDir,
    authState: "not_required",
    now: startedAt,
  });

  const result: VaultInventoryResult = {
    job: localFilesJob,
    startedAt,
    finishedAt: startedAt,
    sources: [source],
    objects: [],
    events: [],
    errors: [],
  };

  try {
    const files: string[] = [];
    await walk(options.rootDir, files, options.maxLocalFiles);

    for (const file of files) {
      const fileStat = await stat(file);
      const buffer = await readFile(file);
      const hash = sha256Hex(buffer);
      const relativePath = normalizePath(path.relative(options.rootDir, file));
      const textLike = isTextFile(file, buffer);
      const tags = tagsForPath(relativePath);
      let metadata: Record<string, unknown> = {
        relativePath,
        modifiedAt: fileStat.mtime.toISOString(),
        textLike,
      };

      let sensitivity = classifySensitivity(relativePath);

      if (textLike) {
        const rawPreview = buffer.subarray(0, 96 * 1024).toString("utf8");
        const redaction = redactSensitiveText(rawPreview);
        sensitivity = redaction.sensitivity === "public" ? sensitivity : redaction.sensitivity;
        metadata = {
          ...metadata,
          secretNames: redaction.secretNames,
          redactionCount: redaction.redactionCount,
          preview: options.includeContentPreview && redaction.sensitivity !== "secret_metadata"
            ? redaction.redactedText.slice(0, 1_000)
            : undefined,
        };
      }

      result.objects.push(
        createObject({
          sourceId: source.id,
          kind: "file",
          externalId: relativePath,
          uri: `file://${relativePath}`,
          title: relativePath,
          contentHash: hash,
          sizeBytes: fileStat.size,
          mimeType: textLike ? "text/plain" : "application/octet-stream",
          tags,
          sensitivity,
          indexedAt: startedAt,
          metadata,
        }),
      );
    }

    if (files.length >= options.maxLocalFiles) {
      result.events.push(
        createEvent({
          type: "local_files_limit_reached",
          severity: "warn",
          sourceId: source.id,
          message: `Stopped local file scan at maxLocalFiles=${options.maxLocalFiles}`,
          createdAt: startedAt,
          details: { maxLocalFiles: options.maxLocalFiles },
        }),
      );
    }
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : String(error));
  }

  result.finishedAt = new Date().toISOString();
  return result;
}

async function walk(dir: string, files: string[], limit: number): Promise<void> {
  if (files.length >= limit) return;

  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (files.length >= limit) return;
    const fullPath = path.join(dir, entry.name);
    if (shouldSkip(entry)) continue;

    if (entry.isDirectory()) {
      await walk(fullPath, files, limit);
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
}

function shouldSkip(entry: Dirent): boolean {
  return entry.isDirectory() && EXCLUDED_DIRS.has(entry.name);
}

function isTextFile(file: string, buffer: Buffer): boolean {
  const extension = path.extname(file).toLowerCase();
  if (TEXT_EXTENSIONS.has(extension)) return true;
  if (buffer.subarray(0, 512).includes(0)) return false;
  return buffer.length < 512 * 1024;
}

function tagsForPath(relativePath: string): string[] {
  const lower = relativePath.toLowerCase();
  const tags = new Set<string>();
  if (lower.endsWith(".md")) tags.add("markdown");
  if (lower.includes("docker")) tags.add("docker");
  if (lower.includes("cloudflare") || lower.includes("wrangler")) tags.add("cloudflare");
  if (lower.includes("vault")) tags.add("vault");
  if (lower.includes("agent")) tags.add("agent");
  if (lower.includes("nuc")) tags.add("nuc");
  if (lower.includes("primo") || lower.includes("vds") || lower.includes("eliteid")) tags.add("vds");
  if (lower.includes("sovereign") || lower.includes("god")) tags.add("sovereign");
  if (lower.includes("blackboard") || lower.includes("memory")) tags.add("memory");
  return Array.from(tags).sort();
}

function normalizePath(value: string): string {
  return value.split(path.sep).join("/");
}
