/**
 * @dreamnet/tool-gym — Agent Training Gymnasium
 * 
 * Training environment where agents practice tools, earn XP, and rank up.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'tool-gym',
  name: 'DreamNet Tool Gym',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['training', 'xp-tracking', 'ranking', 'skill-assessment', 'challenges'],
  metadata: { organ: 'respiratory', role: 'training-gym' },
});

export interface TrainingResult { agentId: string; tool: string; score: number; passed: boolean; xpEarned: number; timestamp: number; }
export type Rank = 'recruit' | 'soldier' | 'specialist' | 'elite' | 'sovereign';

const xpStore: Map<string, number> = new Map();
const trainingLog: TrainingResult[] = [];

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function recordTraining(result: TrainingResult): void {
  trainingLog.push(result);
  const current = xpStore.get(result.agentId) || 0;
  xpStore.set(result.agentId, current + result.xpEarned);
}

export function getXP(agentId: string): number { return xpStore.get(agentId) || 0; }

export function getRank(agentId: string): Rank {
  const xp = getXP(agentId);
  if (xp >= 10000) return 'sovereign';
  if (xp >= 5000) return 'elite';
  if (xp >= 2000) return 'specialist';
  if (xp >= 500) return 'soldier';
  return 'recruit';
}

export function getSuccessRate(agentId: string): number {
  const results = trainingLog.filter(r => r.agentId === agentId);
  if (results.length === 0) return 0;
  return results.filter(r => r.passed).length / results.length;
}

export function getLeaderboard(limit = 10): { agentId: string; xp: number; rank: Rank }[] {
  return Array.from(xpStore.entries()).map(([agentId, xp]) => ({ agentId, xp, rank: getRank(agentId) })).sort((a, b) => b.xp - a.xp).slice(0, limit);
}

export { bridge };
export default { connect, recordTraining, getXP, getRank, getSuccessRate, getLeaderboard, bridge };
