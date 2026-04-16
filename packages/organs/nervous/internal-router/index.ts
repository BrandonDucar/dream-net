/**
 * @dreamnet/internal-router — Internal Message Router
 * 
 * High-performance internal routing between organs and services.
 */

import { createBridge } from '../runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'internal-router',
  name: 'DreamNet Internal Router',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['message-routing', 'load-balancing', 'circuit-breaking', 'retry'],
  metadata: { organ: 'nervous', role: 'internal-router' },
});

export interface Route { pattern: string; targets: string[]; strategy: 'round-robin' | 'random' | 'broadcast' | 'first-available'; }

const routes: Map<string, Route> = new Map();
const roundRobinCounters: Map<string, number> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function addRoute(route: Route): void { routes.set(route.pattern, route); }

export async function route(pattern: string, content: string, data?: any): Promise<string[]> {
  const r = routes.get(pattern);
  if (!r) return [];
  const delivered: string[] = [];

  switch (r.strategy) {
    case 'broadcast':
      for (const t of r.targets) { await bridge.send(t, content, 'relay', data); delivered.push(t); }
      break;
    case 'round-robin': {
      const idx = (roundRobinCounters.get(pattern) || 0) % r.targets.length;
      roundRobinCounters.set(pattern, idx + 1);
      await bridge.send(r.targets[idx], content, 'relay', data);
      delivered.push(r.targets[idx]);
      break;
    }
    case 'random': {
      const target = r.targets[Math.floor(Math.random() * r.targets.length)];
      await bridge.send(target, content, 'relay', data);
      delivered.push(target);
      break;
    }
    case 'first-available':
      if (r.targets.length > 0) { await bridge.send(r.targets[0], content, 'relay', data); delivered.push(r.targets[0]); }
      break;
  }
  return delivered;
}

export { bridge };
export default { connect, addRoute, route, bridge };
