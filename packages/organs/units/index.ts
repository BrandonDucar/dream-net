/**
 * @dreamnet/units — Mini-App & Module Registry
 * 
 * Manages deployable mini-apps, modules, and units within DreamNet.
 */

import { createBridge } from '../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'units',
  name: 'DreamNet Units Registry',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['mini-app-registry', 'module-management', 'deployment', 'versioning'],
  metadata: { organ: 'units', role: 'module-registry' },
});

export interface Unit { id: string; name: string; type: 'mini-app' | 'module' | 'plugin'; version: string; status: 'active' | 'inactive' | 'deprecated'; entrypoint: string; }

const units: Map<string, Unit> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function register(unit: Unit): void { units.set(unit.id, unit); }
export function get(id: string): Unit | undefined { return units.get(id); }
export function list(): Unit[] { return Array.from(units.values()); }
export function getActive(): Unit[] { return Array.from(units.values()).filter(u => u.status === 'active'); }

export { bridge };
export default { connect, register, get, list, getActive, bridge };
