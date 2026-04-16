/**
 * @dreamnet/agents — Agent Spawner & Lifecycle Manager
 * 
 * Creates, manages, and destroys agent instances from templates.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'agent-spawner',
  name: 'DreamNet Agent Spawner',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['agent-spawn', 'agent-destroy', 'lifecycle', 'pool-management'],
  metadata: { organ: 'respiratory', role: 'spawner' },
});

export interface AgentInstance { id: string; templateId: string; status: 'spawning' | 'running' | 'paused' | 'destroyed'; spawnedAt: number; config: Record<string, any>; }

const instances: Map<string, AgentInstance> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function spawn(templateId: string, config: Record<string, any> = {}): Promise<AgentInstance> {
  const id = `agent-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const instance: AgentInstance = { id, templateId, status: 'running', spawnedAt: Date.now(), config };
  instances.set(id, instance);
  await bridge.broadcast(`[SPAWN] New agent: ${id} from template ${templateId}`, instance);
  return instance;
}

export async function destroy(id: string): Promise<void> {
  const inst = instances.get(id);
  if (inst) { inst.status = 'destroyed'; await bridge.broadcast(`[SPAWN] Destroyed: ${id}`, inst); }
}

export function getInstances(): AgentInstance[] { return Array.from(instances.values()).filter(i => i.status !== 'destroyed'); }

export { bridge };
export default { connect, spawn, destroy, getInstances, bridge };
