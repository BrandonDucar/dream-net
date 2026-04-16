/**
 * @dreamnet/reputation-lattice — Agent Reputation System
 * 
 * Tracks trust scores, reliability ratings, and reputation across the swarm.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'reputation-lattice',
  name: 'DreamNet Reputation Lattice',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['trust-scores', 'reliability-ratings', 'reputation-history', 'peer-review'],
  metadata: { organ: 'immune', role: 'reputation' },
});

export interface ReputationScore { agentId: string; score: number; taskSuccess: number; taskFail: number; uptime: number; lastUpdated: number; }

const scores: Map<string, ReputationScore> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function getScore(agentId: string): ReputationScore {
  return scores.get(agentId) || { agentId, score: 50, taskSuccess: 0, taskFail: 0, uptime: 0, lastUpdated: Date.now() };
}

export function recordSuccess(agentId: string): void {
  const s = getScore(agentId);
  s.taskSuccess++;
  s.score = Math.min(100, s.score + 2);
  s.lastUpdated = Date.now();
  scores.set(agentId, s);
}

export function recordFailure(agentId: string): void {
  const s = getScore(agentId);
  s.taskFail++;
  s.score = Math.max(0, s.score - 5);
  s.lastUpdated = Date.now();
  scores.set(agentId, s);
}

export function getLeaderboard(limit = 10): ReputationScore[] {
  return Array.from(scores.values()).sort((a, b) => b.score - a.score).slice(0, limit);
}

export { bridge };
export default { connect, getScore, recordSuccess, recordFailure, getLeaderboard, bridge };
