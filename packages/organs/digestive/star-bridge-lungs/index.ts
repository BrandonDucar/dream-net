/**
 * @dreamnet/star-bridge-lungs — Digestive/Respiratory Star Bridge
 * 
 * The digestive system processes and transforms data.
 * The respiratory system handles I/O flow (ingestion/exhalation).
 * Star Bridge connects both to the Sovereign Bridge.
 * 
 * Responsibilities:
 *   - Relay data ingestion events (new content consumed by agents)
 *   - Broadcast data transformation results
 *   - Report I/O throughput metrics
 *   - Sync content pipeline state across the swarm
 *   - Enable cross-agent data sharing (one agent ingests, all benefit)
 */

import { RuntimeBridge, createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'star-bridge',
  name: 'DreamNet Star Bridge (Digestive/Respiratory)',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['data-ingestion', 'data-transform', 'io-metrics', 'content-pipeline', 'cross-agent-share'],
  metadata: { organ: 'digestive+respiratory', role: 'data-flow' },
});

export interface IngestionEvent {
  source: string;
  agentId: string;
  contentType: 'text' | 'code' | 'image' | 'url' | 'api-response' | 'memory' | 'document';
  summary: string;
  sizeBytes?: number;
  tags?: string[];
  timestamp: number;
}

export interface TransformResult {
  inputType: string;
  outputType: string;
  agentId: string;
  summary: string;
  quality: number; // 0-1
  timestamp: number;
}

export async function connect(): Promise<boolean> {
  return bridge.connectWithRetry(10, 5_000);
}

export async function reportIngestion(event: IngestionEvent): Promise<void> {
  await bridge.broadcast(
    `[INGEST] ${event.agentId} consumed ${event.contentType} from ${event.source}: ${event.summary.slice(0, 80)}`,
    event, 'low'
  );
}

export async function reportTransform(result: TransformResult): Promise<void> {
  await bridge.broadcast(
    `[TRANSFORM] ${result.agentId}: ${result.inputType} → ${result.outputType} (quality: ${(result.quality * 100).toFixed(0)}%)`,
    result, 'low'
  );
}

export async function shareContent(fromAgent: string, toAgent: string, content: string, contentType: string, data?: any): Promise<void> {
  await bridge.send(toAgent,
    `Shared ${contentType}: ${content.slice(0, 100)}`,
    'message', { contentType, content, sharedBy: fromAgent, ...data }
  );
}

export async function broadcastDiscovery(agentId: string, discovery: string, data?: any): Promise<void> {
  await bridge.broadcast(
    `[DISCOVERY] ${agentId}: ${discovery}`,
    { agentId, discovery, ...data }
  );
}

export { bridge };
export default { connect, reportIngestion, reportTransform, shareContent, broadcastDiscovery, bridge };
