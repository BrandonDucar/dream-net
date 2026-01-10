import { sql } from "drizzle-orm";
import { db } from "../db";
import { nanoid } from "nanoid";
import { publishInternalEvent, StarbridgeSource, StarbridgeTopic } from "../starbridge";
import { recordMetric } from "../trust/metrics";

const NODES = "dreamnet_trust.rep_nodes";
const EDGES = "dreamnet_trust.rep_edges";
const SCORES = "dreamnet_trust.rep_scores";

export async function ensureNode(id: string, type: string) {
  await db.execute(sql`
    INSERT INTO ${sql.raw(NODES)} (id, type)
    VALUES (${id}, ${type})
    ON CONFLICT (id) DO NOTHING;
  `);
}

interface EdgeInput {
  src: string;
  dst: string;
  kind: string;
  weight?: number;
  signature?: string;
}

export async function addEdge(input: EdgeInput) {
  await ensureNode(input.src, "unknown");
  await ensureNode(input.dst, "unknown");

  const weight = input.weight ?? 1.0;

  await db.execute(sql`
    INSERT INTO ${sql.raw(EDGES)} (src, dst, kind, weight, signature)
    VALUES (${input.src}, ${input.dst}, ${input.kind}, ${weight}, ${input.signature ?? null})
    ON CONFLICT (src, dst, kind)
    DO UPDATE SET weight = EXCLUDED.weight, signature = EXCLUDED.signature, created_at = NOW();
  `);

  await publishInternalEvent({
    topic: StarbridgeTopic.Governor,
    source: StarbridgeSource.Runtime,
    type: "reputation.edge.added",
    payload: {
      src: input.src,
      dst: input.dst,
      kind: input.kind,
      weight,
    },
  });
}

export async function getScore(nodeId: string) {
  const result = await db.execute(sql`
    SELECT score, computed_at FROM ${sql.raw(SCORES)} WHERE node_id = ${nodeId}
  `);
  return result.rows?.[0] ?? null;
}

export async function recomputeScores(iterations = 20) {
  const damping = Number(process.env.REP_DAMPING ?? 0.85);
  const nodesResult = await db.execute(sql`SELECT id FROM ${sql.raw(NODES)}`);
  const nodes = nodesResult.rows.map((row) => row.id as string);

  if (nodes.length === 0) {
    return;
  }

  const edgesResult = await db.execute(sql`
    SELECT src, dst, weight FROM ${sql.raw(EDGES)}
  `);
  const edges = edgesResult.rows as Array<{ src: string; dst: string; weight: number }>;

  const outgoingWeights = new Map<string, number>();
  const adjacency = new Map<string, Array<{ dst: string; weight: number }>>();

  for (const edge of edges) {
    const list = adjacency.get(edge.src) ?? [];
    list.push({ dst: edge.dst, weight: edge.weight });
    adjacency.set(edge.src, list);
    outgoingWeights.set(edge.src, (outgoingWeights.get(edge.src) ?? 0) + edge.weight);
  }

  const N = nodes.length;
  const initial = 1 / N;
  let scores = new Map<string, number>(nodes.map((id) => [id, initial]));

  for (let iter = 0; iter < iterations; iter++) {
    const next = new Map<string, number>();
    for (const node of nodes) {
      next.set(node, (1 - damping) / N);
    }

    for (const node of nodes) {
      const outgoing = adjacency.get(node);
      if (!outgoing || outgoing.length === 0) continue;

      const nodeScore = scores.get(node) ?? initial;
      const totalWeight = outgoingWeights.get(node) ?? outgoing.length;

      for (const { dst, weight } of outgoing) {
        const contribution = damping * nodeScore * (weight / totalWeight);
        next.set(dst, (next.get(dst) ?? 0) + contribution);
      }
    }

    scores = next;
  }

  const entries = Array.from(scores.entries());

  if (entries.length > 0) {
    const nodeIds = entries.map(([id]) => id);
    await db.execute(sql`
      DELETE FROM ${sql.raw(SCORES)}
      WHERE node_id <> ALL(${sql.array(nodeIds, "text")})
    `);
  } else {
    await db.execute(sql`DELETE FROM ${sql.raw(SCORES)}`);
  }

  for (const [node, score] of entries) {
    await db.execute(sql`
      INSERT INTO ${sql.raw(SCORES)} (node_id, score, computed_at)
      VALUES (${node}, ${score}, NOW())
      ON CONFLICT (node_id)
      DO UPDATE SET score = EXCLUDED.score, computed_at = EXCLUDED.computed_at;
    `);
  }

  await recordMetric("reputation.scores", {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    lastComputedAt: new Date().toISOString(),
  });

  await publishInternalEvent({
    topic: StarbridgeTopic.Governor,
    source: StarbridgeSource.ComputeGovernor,
    type: "reputation.scores.updated",
    payload: { nodeCount: nodes.length, edgeCount: edges.length },
  });
}

export async function getLeaderboard(limit = 10) {
  const result = await db.execute(sql`
    SELECT node_id, score FROM ${sql.raw(SCORES)}
    ORDER BY score DESC
    LIMIT ${limit}
  `);
  return result.rows;
}
