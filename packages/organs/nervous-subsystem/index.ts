/**
 * @dreamnet/nervous-subsystem — Peripheral Nervous System
 * 
 * Handles peripheral signals: user input, external triggers, sensor data.
 * Complements the central nervous system (nerve core).
 */

import { createBridge } from '../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'nervous-subsystem',
  name: 'DreamNet Peripheral Nervous System',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['user-input', 'external-triggers', 'sensor-data', 'reflex-arcs'],
  metadata: { organ: 'nervous-subsystem', role: 'peripheral' },
});

export interface PeripheralSignal { source: 'user' | 'sensor' | 'external' | 'timer'; data: any; reflexRequired: boolean; timestamp: number; }

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function receiveSignal(signal: PeripheralSignal): Promise<void> {
  if (signal.reflexRequired) {
    await bridge.broadcast(`[PNS] REFLEX: ${signal.source}`, signal, 'high');
  } else {
    await bridge.broadcast(`[PNS] Signal: ${signal.source}`, signal, 'low');
  }
}

export { bridge };
export default { connect, receiveSignal, bridge };
