/**
 * @dreamnet/agent-store — Agent Template Store
 * 
 * Stores agent templates, configs, and blueprints for spawning new agents.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'agent-store',
  name: 'DreamNet Agent Store',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['template-storage', 'agent-blueprints', 'versioning', 'marketplace'],
  metadata: { organ: 'respiratory', role: 'agent-store' },
});

export interface AgentTemplate { id: string; name: string; description: string; capabilities: string[]; config: Record<string, any>; version: string; author: string; downloads: number; }

const templates: Map<string, AgentTemplate> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function publish(template: AgentTemplate): void { templates.set(template.id, template); }
export function get(id: string): AgentTemplate | undefined { return templates.get(id); }
export function list(): AgentTemplate[] { return Array.from(templates.values()); }
export function search(query: string): AgentTemplate[] {
  const q = query.toLowerCase();
  return Array.from(templates.values()).filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.capabilities.some(c => c.includes(q)));
}

export { bridge };
export default { connect, publish, get, list, search, bridge };
