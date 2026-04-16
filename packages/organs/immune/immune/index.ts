/**
 * @dreamnet/immune — Master Immune System Coordinator
 * 
 * Orchestrates all immune subsystems: IDS, RBAC, guardian, identity, reputation.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'immune-system',
  name: 'DreamNet Immune System',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['immune-coordination', 'threat-response', 'auto-healing', 'defense-posture'],
  metadata: { organ: 'immune', role: 'coordinator' },
});

export type DefensePosture = 'normal' | 'elevated' | 'high' | 'maximum';
let currentPosture: DefensePosture = 'normal';

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function setPosture(posture: DefensePosture): void {
  currentPosture = posture;
  bridge.broadcast(`[IMMUNE] Defense posture: ${posture.toUpperCase()}`, { posture }, posture === 'maximum' ? 'critical' : 'high');
}

export function getPosture(): DefensePosture { return currentPosture; }

export async function respondToThreat(threatType: string, source: string, severity: string): Promise<string> {
  const actions: string[] = [];
  if (severity === 'critical') { setPosture('maximum'); actions.push('posture-maximum'); }
  else if (severity === 'high') { setPosture('high'); actions.push('posture-high'); }
  await bridge.broadcast(`[IMMUNE] Threat response: ${threatType} from ${source} — ${actions.join(', ')}`, { threatType, source, severity, actions }, 'high');
  return actions.join(', ');
}

export { bridge };
export default { connect, setPosture, getPosture, respondToThreat, bridge };
