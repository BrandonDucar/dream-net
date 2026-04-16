/**
 * @dreamnet/squad-alchemy — Agent Squad Formation & Coordination
 * 
 * Forms temporary agent squads for complex multi-agent tasks.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'squad-alchemy',
  name: 'DreamNet Squad Alchemy',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['squad-formation', 'multi-agent-coordination', 'role-assignment', 'squad-dissolution'],
  metadata: { organ: 'respiratory', role: 'squad-formation' },
});

export interface Squad { id: string; name: string; mission: string; members: { agentId: string; role: string }[]; status: 'forming' | 'active' | 'completed' | 'dissolved'; formedAt: number; }

const squads: Map<string, Squad> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function form(name: string, mission: string, members: { agentId: string; role: string }[]): Promise<Squad> {
  const id = `squad-${Date.now()}`;
  const squad: Squad = { id, name, mission, members, status: 'active', formedAt: Date.now() };
  squads.set(id, squad);
  for (const m of members) {
    await bridge.send(m.agentId, `[SQUAD] You've been assigned to "${name}" as ${m.role}. Mission: ${mission}`, 'command', squad);
  }
  await bridge.broadcast(`[SQUAD] "${name}" formed with ${members.length} agents`, squad);
  return squad;
}

export async function dissolve(squadId: string): Promise<void> {
  const s = squads.get(squadId);
  if (s) { s.status = 'dissolved'; await bridge.broadcast(`[SQUAD] "${s.name}" dissolved`, s); }
}

export function getSquads(): Squad[] { return Array.from(squads.values()).filter(s => s.status === 'active'); }

export { bridge };
export default { connect, form, dissolve, getSquads, bridge };
