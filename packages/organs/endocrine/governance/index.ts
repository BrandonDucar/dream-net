/**
 * @dreamnet/governance — DAO Governance & Voting
 * 
 * On-chain and off-chain governance: proposals, voting, quorum, execution.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'governance',
  name: 'DreamNet Governance',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['proposals', 'voting', 'quorum', 'execution', 'delegation'],
  metadata: { organ: 'endocrine', role: 'governance' },
});

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'draft' | 'active' | 'passed' | 'rejected' | 'executed';
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  deadline: number;
  createdAt: number;
}

const proposals: Map<string, Proposal> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function createProposal(p: Omit<Proposal, 'id' | 'status' | 'votesFor' | 'votesAgainst' | 'createdAt'>): Promise<Proposal> {
  const id = `prop-${Date.now()}`;
  const proposal: Proposal = { ...p, id, status: 'active', votesFor: 0, votesAgainst: 0, createdAt: Date.now() };
  proposals.set(id, proposal);
  await bridge.broadcast(`[GOV] New proposal: ${p.title}`, proposal, 'high');
  return proposal;
}

export async function vote(proposalId: string, agentId: string, support: boolean, weight = 1): Promise<boolean> {
  const p = proposals.get(proposalId);
  if (!p || p.status !== 'active') return false;
  if (support) p.votesFor += weight; else p.votesAgainst += weight;
  if (p.votesFor + p.votesAgainst >= p.quorum) {
    p.status = p.votesFor > p.votesAgainst ? 'passed' : 'rejected';
    await bridge.broadcast(`[GOV] Proposal ${p.status}: ${p.title}`, p, 'high');
  }
  return true;
}

export function getProposals(status?: string): Proposal[] {
  const all = Array.from(proposals.values());
  return status ? all.filter(p => p.status === status) : all;
}

export { bridge };
export default { connect, createProposal, vote, getProposals, bridge };
