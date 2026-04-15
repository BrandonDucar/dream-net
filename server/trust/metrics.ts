import { sql } from "drizzle-orm";
import { db } from "../db";

const TABLE = "dreamnet_trust.trust_metrics";

export async function recordMetric(id: string, payload: Record<string, unknown>) {
  await db.execute(sql`
    INSERT INTO ${sql.raw(TABLE)} (id, payload, created_at)
    VALUES (${id}, ${payload}, NOW())
    ON CONFLICT (id)
    DO UPDATE SET payload = EXCLUDED.payload, created_at = NOW();
  `);
}

export async function getMetric(id: string) {
  const result = await db.execute(sql`
    SELECT payload, created_at FROM ${sql.raw(TABLE)} WHERE id = ${id}
  `);
  if (!result.rows?.length) return null;
  const row = result.rows[0] as { payload: any; created_at: Date };
  return { ...row.payload, updatedAt: row.created_at };
}

export async function listMetrics(prefix?: string) {
  const condition = prefix
    ? sql`WHERE id LIKE ${prefix + "%"}`
    : sql``;
  const result = await db.execute(sql`
    SELECT id, payload, created_at FROM ${sql.raw(TABLE)} ${condition}
  `);
  return result.rows as Array<{ id: string; payload: any; created_at: Date }>;
}
