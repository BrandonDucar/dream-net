import { mkdir, readFile, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";
import type {
  VaultEvent,
  VaultInventoryResult,
  VaultObject,
  VaultReceipt,
  VaultReceiptStatus,
  VaultSensitivity,
  VaultSource,
} from "../types.js";
import { VAULT_SCHEMA_VERSION } from "../types.js";
import { sha256Hex, stableStringify, createVaultId } from "../hash.js";

export class FileVaultStore {
  constructor(private readonly vaultHome: string) {}

  async writeInventoryResult(result: VaultInventoryResult): Promise<VaultReceipt> {
    await this.ensureLayout();

    const receipt = await this.createReceipt(result);
    await Promise.all([
      this.appendJsonl("sources", result.sources),
      this.appendJsonl("objects", result.objects),
      this.appendJsonl("events", result.events),
      this.appendJsonl("receipts", [receipt]),
      this.writeLatest(result, receipt),
    ]);

    await writeFile(this.path("receipts", "chain-head.json"), JSON.stringify(receipt, null, 2));
    return receipt;
  }

  blobPointerForHash(hash: string): string {
    return path.join(this.vaultHome, "blobs", "sha256", hash.slice(0, 2), hash.slice(2, 4), hash);
  }

  private async ensureLayout(): Promise<void> {
    await Promise.all(
      ["sources", "objects", "events", "receipts", "latest", path.join("blobs", "sha256")].map((dir) =>
        mkdir(this.path(dir), { recursive: true }),
      ),
    );
  }

  private async createReceipt(result: VaultInventoryResult): Promise<VaultReceipt> {
    const previousHash = await this.getPreviousHash();
    const status = this.statusFor(result);
    const sensitivity = this.highestSensitivity(result.objects);
    const sourceIds = Array.from(new Set(result.sources.map((source) => source.id))).sort();
    const receiptBase = {
      schemaVersion: VAULT_SCHEMA_VERSION,
      jobId: result.job.id,
      sourceIds,
      action: "scan" as const,
      status,
      startedAt: result.startedAt,
      finishedAt: result.finishedAt,
      objectCount: result.objects.length,
      eventCount: result.events.length,
      authContext: {
        state: this.authStateFor(result),
      },
      sensitivity,
      destinationPointer: this.vaultHome,
      previousHash,
      errors: result.errors,
      metadata: {
        jobName: result.job.name,
        sourceKind: result.job.sourceKind,
      },
    };

    const id = createVaultId("receipt", result.job.id, result.startedAt, result.finishedAt, previousHash);
    const hash = sha256Hex(stableStringify({ id, ...receiptBase }));
    return { id, ...receiptBase, hash };
  }

  private async appendJsonl(folder: string, rows: Array<VaultSource | VaultObject | VaultEvent | VaultReceipt>): Promise<void> {
    if (rows.length === 0) return;
    const file = this.path(folder, `${new Date().toISOString().slice(0, 10)}.jsonl`);
    const body = `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`;
    await appendFile(file, body, "utf8");
  }

  private async writeLatest(result: VaultInventoryResult, receipt: VaultReceipt): Promise<void> {
    const payload = {
      receipt,
      job: result.job,
      sources: result.sources,
      objects: result.objects,
      events: result.events,
      errors: result.errors,
    };
    await writeFile(this.path("latest", `${result.job.id}.json`), JSON.stringify(payload, null, 2), "utf8");
  }

  private async getPreviousHash(): Promise<string | undefined> {
    try {
      const raw = await readFile(this.path("receipts", "chain-head.json"), "utf8");
      const parsed = JSON.parse(raw) as { hash?: string };
      return parsed.hash;
    } catch {
      return undefined;
    }
  }

  private statusFor(result: VaultInventoryResult): VaultReceiptStatus {
    if (result.errors.length > 0) return "failed";
    if (result.events.some((event) => event.severity === "blocked")) return "blocked";
    if (result.events.some((event) => event.severity === "warn" || event.severity === "error")) return "degraded";
    return "success";
  }

  private authStateFor(result: VaultInventoryResult): VaultReceipt["authContext"]["state"] {
    if (result.sources.some((source) => source.authState === "available")) return "available";
    if (result.sources.some((source) => source.authState === "expired")) return "expired";
    if (result.sources.some((source) => source.authState === "invalid")) return "invalid";
    if (result.sources.some((source) => source.authState === "blocked")) return "blocked";
    if (result.sources.some((source) => source.authState === "missing")) return "missing";
    return "not_required";
  }

  private highestSensitivity(objects: VaultObject[]): VaultSensitivity {
    const rank: Record<VaultSensitivity, number> = {
      public: 0,
      internal: 1,
      confidential: 2,
      secret_metadata: 3,
    };
    return objects.reduce<VaultSensitivity>(
      (highest, object) => (rank[object.sensitivity] > rank[highest] ? object.sensitivity : highest),
      "public",
    );
  }

  private path(...segments: string[]): string {
    return path.join(this.vaultHome, ...segments);
  }
}
