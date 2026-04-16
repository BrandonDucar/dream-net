/**
 * @dreamnet/circulatory — Data Flow & Distribution System
 * 
 * The circulatory system pumps data throughout DreamNet.
 * Manages data pipelines, stream routing, and backpressure.
 */

import { createBridge } from '../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'circulatory',
  name: 'DreamNet Circulatory System',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['data-pipelines', 'stream-routing', 'backpressure', 'data-distribution'],
  metadata: { organ: 'circulatory', role: 'data-flow' },
});

export interface DataPipeline { id: string; source: string; destination: string; transform?: string; active: boolean; throughput: number; }

const pipelines: Map<string, DataPipeline> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function createPipeline(pipeline: DataPipeline): void { pipelines.set(pipeline.id, pipeline); }
export function destroyPipeline(id: string): void { pipelines.delete(id); }
export function getPipelines(): DataPipeline[] { return Array.from(pipelines.values()); }

export async function pump(pipelineId: string, data: any): Promise<boolean> {
  const p = pipelines.get(pipelineId);
  if (!p?.active) return false;
  await bridge.send(p.destination, `[CIRCULATORY] Data from ${p.source}`, 'relay', data);
  p.throughput++;
  return true;
}

export { bridge };
export default { connect, createPipeline, destroyPipeline, getPipelines, pump, bridge };
