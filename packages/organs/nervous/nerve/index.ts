/**
 * @dreamnet/nerve — Central Nervous System Core
 * 
 * The spine of DreamNet. Coordinates all nervous subsystems:
 * cortex, spikes, bridges, routers, and sync engines.
 */

import { createBridge } from '../runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'nerve-core',
  name: 'DreamNet Nerve Core',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['nervous-coordination', 'signal-processing', 'reflex-arcs', 'cortex-relay'],
  metadata: { organ: 'nervous', role: 'nerve-core' },
});

export interface NerveSignal { type: 'sensory' | 'motor' | 'reflex' | 'cortex'; source: string; target?: string; payload: any; priority: number; timestamp: number; }

const signalLog: NerveSignal[] = [];

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function transmit(signal: NerveSignal): Promise<void> {
  signalLog.push(signal);
  if (signalLog.length > 5000) signalLog.splice(0, 500);

  if (signal.target) {
    await bridge.send(signal.target, `[NERVE] ${signal.type}: ${JSON.stringify(signal.payload).slice(0, 100)}`, 'relay', signal);
  } else {
    await bridge.broadcast(`[NERVE] ${signal.type} signal from ${signal.source}`, signal, signal.priority > 0.8 ? 'high' : 'normal');
  }
}

export function getSignalLog(limit = 50): NerveSignal[] { return signalLog.slice(-limit); }

export { bridge };
export default { connect, transmit, getSignalLog, bridge };
