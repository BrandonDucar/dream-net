/**
 * @dreamnet/directory — Service Directory & DNS
 * 
 * Service discovery, DNS resolution, and endpoint mapping for the swarm.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'directory',
  name: 'DreamNet Directory',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['service-discovery', 'dns', 'endpoint-mapping', 'health-aware-routing'],
  metadata: { organ: 'respiratory', role: 'directory' },
});

export interface ServiceEntry { name: string; agentId: string; url: string; healthy: boolean; tags: string[]; registeredAt: number; }

const directory: Map<string, ServiceEntry[]> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function register(entry: ServiceEntry): void {
  if (!directory.has(entry.name)) directory.set(entry.name, []);
  directory.get(entry.name)!.push(entry);
}

export function resolve(name: string): ServiceEntry | undefined {
  const entries = directory.get(name)?.filter(e => e.healthy);
  return entries?.[Math.floor(Math.random() * entries.length)];
}

export function resolveAll(name: string): ServiceEntry[] { return directory.get(name) || []; }
export function listServices(): string[] { return Array.from(directory.keys()); }

export { bridge };
export default { connect, register, resolve, resolveAll, listServices, bridge };
