/**
 * @dreamnet/network-blueprints — Network Topology Blueprints
 * 
 * Defines and manages network topologies for the DreamNet swarm.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'network-blueprints',
  name: 'DreamNet Network Blueprints',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['topology-design', 'network-planning', 'capacity-modeling', 'failover-design'],
  metadata: { organ: 'skeletal', role: 'network-blueprints' },
});

export interface NetworkNode { id: string; type: 'agent' | 'service' | 'gateway' | 'storage'; connections: string[]; }
export interface Blueprint { id: string; name: string; nodes: NetworkNode[]; description: string; createdAt: number; }

const blueprints: Map<string, Blueprint> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function create(bp: Blueprint): void { blueprints.set(bp.id, bp); }
export function get(id: string): Blueprint | undefined { return blueprints.get(id); }
export function list(): Blueprint[] { return Array.from(blueprints.values()); }

export function getTopology(blueprintId: string): { nodes: number; edges: number; density: number } | undefined {
  const bp = blueprints.get(blueprintId);
  if (!bp) return undefined;
  const edges = bp.nodes.reduce((s, n) => s + n.connections.length, 0) / 2;
  const maxEdges = (bp.nodes.length * (bp.nodes.length - 1)) / 2;
  return { nodes: bp.nodes.length, edges, density: maxEdges > 0 ? edges / maxEdges : 0 };
}

export { bridge };
export default { connect, create, get, list, getTopology, bridge };
