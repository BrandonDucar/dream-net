/**
 * @dreamnet/event-wormholes — Cross-System Event Routing
 * 
 * Routes events between disconnected systems via wormhole tunnels.
 */

import { createBridge } from '../runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'event-wormholes',
  name: 'DreamNet Event Wormholes',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['event-routing', 'cross-system', 'tunnel-management', 'event-transform'],
  metadata: { organ: 'nervous', role: 'event-wormholes' },
});

export interface Wormhole { id: string; sourceSystem: string; targetSystem: string; eventFilter: string; transform?: (event: any) => any; active: boolean; }

const wormholes: Map<string, Wormhole> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function createWormhole(wh: Wormhole): void { wormholes.set(wh.id, wh); }
export function closeWormhole(id: string): void { const wh = wormholes.get(id); if (wh) wh.active = false; }

export async function routeEvent(sourceSystem: string, event: any): Promise<number> {
  let routed = 0;
  for (const wh of wormholes.values()) {
    if (!wh.active || wh.sourceSystem !== sourceSystem) continue;
    const transformed = wh.transform ? wh.transform(event) : event;
    await bridge.send(wh.targetSystem, `[WORMHOLE] Event from ${sourceSystem}`, 'relay', transformed);
    routed++;
  }
  return routed;
}

export function getActiveWormholes(): Wormhole[] { return Array.from(wormholes.values()).filter(w => w.active); }

export { bridge };
export default { connect, createWormhole, closeWormhole, routeEvent, getActiveWormholes, bridge };
