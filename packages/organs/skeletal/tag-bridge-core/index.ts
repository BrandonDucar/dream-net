/**
 * @dreamnet/tag-bridge-core — Skeletal Tag Bridge
 * 
 * The skeletal system provides structural tagging and categorization.
 * This bridge connects tag/label events to the Sovereign Bridge.
 * 
 * Responsibilities:
 *   - Broadcast tag creation/update events across agents
 *   - Sync content categorization labels
 *   - Relay taxonomy changes to the swarm
 *   - Enable cross-agent content discovery via shared tags
 */

import { RuntimeBridge, createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'skeletal-tags',
  name: 'DreamNet Tag Bridge',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['tagging', 'taxonomy', 'categorization', 'content-discovery'],
  metadata: { organ: 'skeletal', role: 'structural-tagging' },
});

export interface TagEvent {
  action: 'create' | 'update' | 'delete' | 'merge';
  tag: string;
  category?: string;
  source: string;
  relatedContent?: string[];
  timestamp: number;
}

export async function connect(): Promise<boolean> {
  return bridge.connectWithRetry(10, 5_000);
}

export async function emitTagEvent(event: TagEvent): Promise<void> {
  await bridge.broadcast(
    `[TAG] ${event.action.toUpperCase()}: ${event.tag}${event.category ? ` (${event.category})` : ''}`,
    event, 'low'
  );
}

export async function queryAgentTags(agentId: string): Promise<void> {
  await bridge.send(agentId, 'Request: list your active tags', 'command', { action: 'list-tags' });
}

export async function syncTaxonomy(taxonomy: Record<string, string[]>): Promise<void> {
  await bridge.broadcast('[TAG] Taxonomy sync', { taxonomy }, 'low');
}

export { bridge };
export default { connect, emitTagEvent, queryAgentTags, syncTaxonomy, bridge };
