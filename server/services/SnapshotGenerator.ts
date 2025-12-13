/**
 * Snapshot Generator Service (Agent 1)
 * 
 * VERTEX CORE // AGENT 1 — Snapshot Engine
 * Wrapper around Agent 1's run() method for CitadelCore compatibility
 */

import { run as agent1Run, type VertexFusionSnapshot } from "../citadel/agents/Agent1.js";

/**
 * Generate vertex_fusion_snapshot from dreamnet.config.ts
 * This function wraps Agent 1's run() method for backward compatibility
 */
export async function generateSnapshot(): Promise<VertexFusionSnapshot> {
  const result = await agent1Run({
    now: () => new Date(),
  });
  
  return result.payload.vertex_fusion_snapshot;
}

// Re-export the type for backward compatibility
export type { VertexFusionSnapshot };
