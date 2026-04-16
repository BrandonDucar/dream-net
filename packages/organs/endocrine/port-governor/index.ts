/**
 * @dreamnet/port-governor — Port & Network Allocation Manager
 * 
 * Manages port assignments, network namespaces, and service discovery.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'port-governor',
  name: 'DreamNet Port Governor',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['port-allocation', 'service-discovery', 'network-namespaces', 'dns'],
  metadata: { organ: 'endocrine', role: 'port-governor' },
});

export interface ServiceEndpoint { agentId: string; name: string; host: string; port: number; protocol: 'http' | 'https' | 'ws' | 'wss' | 'tcp' | 'grpc'; healthy: boolean; }

const registry: Map<string, ServiceEndpoint> = new Map();
const allocatedPorts: Set<number> = new Set();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function registerEndpoint(ep: ServiceEndpoint): void {
  registry.set(`${ep.agentId}:${ep.name}`, ep);
  allocatedPorts.add(ep.port);
}

export function discover(agentId: string): ServiceEndpoint[] {
  return Array.from(registry.values()).filter(ep => ep.agentId === agentId);
}

export function discoverByName(name: string): ServiceEndpoint | undefined {
  return Array.from(registry.values()).find(ep => ep.name === name && ep.healthy);
}

export function allocatePort(start = 10000, end = 65535): number {
  for (let p = start; p <= end; p++) {
    if (!allocatedPorts.has(p)) { allocatedPorts.add(p); return p; }
  }
  throw new Error('No ports available');
}

export function getAllEndpoints(): ServiceEndpoint[] { return Array.from(registry.values()); }

export { bridge };
export default { connect, registerEndpoint, discover, discoverByName, allocatePort, getAllEndpoints, bridge };
