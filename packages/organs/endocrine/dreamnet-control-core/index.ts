/**
 * @dreamnet/dreamnet-control-core — Central Control Plane
 * 
 * Master control for agent lifecycle, deployment, and configuration management.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'control-core',
  name: 'DreamNet Control Core',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['agent-lifecycle', 'deployment', 'config-management', 'rollback'],
  metadata: { organ: 'endocrine', role: 'control-plane' },
});

export type AgentState = 'stopped' | 'starting' | 'running' | 'paused' | 'error' | 'draining';

export interface AgentDeployment {
  agentId: string;
  version: string;
  state: AgentState;
  config: Record<string, any>;
  deployedAt: number;
  lastHealthCheck: number;
}

const deployments: Map<string, AgentDeployment> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function deploy(agentId: string, version: string, config: Record<string, any> = {}): Promise<AgentDeployment> {
  const deployment: AgentDeployment = { agentId, version, state: 'starting', config, deployedAt: Date.now(), lastHealthCheck: Date.now() };
  deployments.set(agentId, deployment);
  await bridge.broadcast(`[CONTROL] Deploying ${agentId} v${version}`, deployment, 'high');
  deployment.state = 'running';
  return deployment;
}

export async function stop(agentId: string): Promise<void> {
  const d = deployments.get(agentId);
  if (d) { d.state = 'stopped'; await bridge.broadcast(`[CONTROL] Stopped ${agentId}`, d); }
}

export async function pause(agentId: string): Promise<void> {
  const d = deployments.get(agentId);
  if (d) { d.state = 'paused'; await bridge.broadcast(`[CONTROL] Paused ${agentId}`, d); }
}

export async function resume(agentId: string): Promise<void> {
  const d = deployments.get(agentId);
  if (d) { d.state = 'running'; await bridge.broadcast(`[CONTROL] Resumed ${agentId}`, d); }
}

export function getDeployment(agentId: string): AgentDeployment | undefined { return deployments.get(agentId); }
export function getAllDeployments(): AgentDeployment[] { return Array.from(deployments.values()); }

export { bridge };
export default { connect, deploy, stop, pause, resume, getDeployment, getAllDeployments, bridge };
