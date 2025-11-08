import fg from "fast-glob";
import fs from "fs/promises";
import path from "path";
import { sql } from "drizzle-orm";
import { db } from "../db";
import { nanoid } from "nanoid";
import { hashBuffer, activeHashAlgo } from "../trust/hash";
import { recordMetric } from "../trust/metrics";
import { publishInternalEvent, StarbridgeSource, StarbridgeTopic } from "../starbridge";

const FINGERPRINTS = "dreamnet_trust.repo_fingerprints";
const ALERTS = "dreamnet_trust.watchdog_alerts";

const WATCH_PATH = process.env.WATCHDOG_ROOT ?? path.resolve(process.cwd());
const ALERT_WEBHOOK = process.env.ALERT_WEBHOOK_URL;

const ignorePatterns = [
  "**/node_modules/**",
  "**/.git/**",
  "**/.next/**",
  "**/dist/**",
  "**/build/**",
  "**/.turbo/**",
];

type Snapshot = Map<string, { hash: string; size: number }>;

async function readSnapshot(snapshotId: string): Promise<Snapshot> {
  const result = await db.execute(sql`
    SELECT path, hash, size_bytes FROM ${sql.raw(FINGERPRINTS)}
    WHERE snapshot_id = ${snapshotId}
  `);
  const map = new Map<string, { hash: string; size: number }>();
  for (const row of result.rows) {
    map.set(row.path as string, { hash: row.hash as string, size: Number(row.size_bytes ?? 0) });
  }
  return map;
}

async function latestSnapshotId(): Promise<string | null> {
  const result = await db.execute(sql`
    SELECT snapshot_id FROM ${sql.raw(FINGERPRINTS)}
    ORDER BY recorded_at DESC
    LIMIT 1
  `);
  return result.rows?.[0]?.snapshot_id ?? null;
}

async function saveSnapshot(snapshotId: string, entries: Array<{ path: string; hash: string; size: number }>) {
  const values = entries.map(
    (entry) =>
      sql`(${snapshotId}, ${entry.path}, ${activeHashAlgo}, ${entry.hash}, ${entry.size}, NOW())`,
  );
  if (values.length === 0) return;
  await db.execute(sql`
    INSERT INTO ${sql.raw(FINGERPRINTS)} (snapshot_id, path, hash_algo, hash, size_bytes, recorded_at)
    VALUES ${sql.join(values, sql`, `)}
    ON CONFLICT (snapshot_id, path)
    DO UPDATE SET hash = EXCLUDED.hash, size_bytes = EXCLUDED.size_bytes, recorded_at = EXCLUDED.recorded_at;
  `);
}

async function createAlert(severity: string, message: string, diff: any) {
  const alertId = nanoid();
  await db.execute(sql`
    INSERT INTO ${sql.raw(ALERTS)} (alert_id, severity, message, diff)
    VALUES (${alertId}, ${severity}, ${message}, ${JSON.stringify(diff)})
  `);

  if (ALERT_WEBHOOK) {
    try {
      await fetch(ALERT_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId, severity, message, diff }),
      });
    } catch (error) {
      console.error("[Watchdog] Failed to post alert webhook", error);
    }
  }

  await publishInternalEvent({
    topic: StarbridgeTopic.System,
    source: StarbridgeSource.Runtime,
    type: "watchdog.alert",
    payload: { alertId, severity, message },
  });
}

export async function runWatchdogSnapshot() {
  const previousSnapshotId = await latestSnapshotId();

  const files = await fg("**/*", {
    cwd: WATCH_PATH,
    dot: false,
    ignore: ignorePatterns,
    onlyFiles: true,
  });

  const snapshotId = nanoid();
  const entries: Array<{ path: string; hash: string; size: number }> = [];

  for (const relPath of files) {
    const absolute = path.join(WATCH_PATH, relPath);
    const data = await fs.readFile(absolute);
    const hash = hashBuffer(data, activeHashAlgo);
    entries.push({ path: relPath, hash, size: data.length });
  }

  let diff = { added: [] as string[], removed: [] as string[], changed: [] as string[] };

  if (previousSnapshotId && previousSnapshotId !== snapshotId) {
    const prev = await readSnapshot(previousSnapshotId);
    const current = new Map(entries.map((entry) => [entry.path, entry]));

    for (const [pathKey, info] of current.entries()) {
      if (!prev.has(pathKey)) {
        diff.added.push(pathKey);
      } else if (prev.get(pathKey)!.hash !== info.hash) {
        diff.changed.push(pathKey);
      }
    }

    for (const pathKey of prev.keys()) {
      if (!current.has(pathKey)) {
        diff.removed.push(pathKey);
      }
    }

    if (diff.added.length || diff.changed.length || diff.removed.length) {
      await createAlert(
        "medium",
        `Watchdog detected changes: +${diff.added.length} ~${diff.changed.length} -${diff.removed.length}`,
        diff,
      );
    }
  }

  await saveSnapshot(snapshotId, entries);

  await recordMetric("watchdog.snapshot", {
    snapshotId,
    files: entries.length,
    diff,
    timestamp: new Date().toISOString(),
  });
}
