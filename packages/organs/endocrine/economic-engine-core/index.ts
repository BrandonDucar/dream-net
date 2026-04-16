/**
 * @dreamnet/economic-engine-core — DreamNet Economic Engine
 * 
 * Manages DreamToken economics, bonding curves, staking, and treasury.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'economic-engine',
  name: 'DreamNet Economic Engine',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['dreamtoken', 'bonding-curves', 'staking', 'treasury', 'revenue-split'],
  metadata: { organ: 'endocrine', role: 'economics' },
});

export interface TokenBalance { agentId: string; balance: number; staked: number; earned: number; }
export interface Transaction { from: string; to: string; amount: number; type: 'transfer' | 'stake' | 'unstake' | 'reward' | 'fee'; timestamp: number; }

const balances: Map<string, TokenBalance> = new Map();
const transactions: Transaction[] = [];

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function getBalance(agentId: string): TokenBalance {
  return balances.get(agentId) || { agentId, balance: 0, staked: 0, earned: 0 };
}

export async function transfer(from: string, to: string, amount: number): Promise<boolean> {
  const fromBal = getBalance(from);
  if (fromBal.balance < amount) return false;
  fromBal.balance -= amount;
  const toBal = getBalance(to);
  toBal.balance += amount;
  balances.set(from, fromBal);
  balances.set(to, toBal);
  transactions.push({ from, to, amount, type: 'transfer', timestamp: Date.now() });
  await bridge.broadcast(`[ECON] Transfer: ${from} → ${to}: ${amount} DT`, { from, to, amount }, 'low');
  return true;
}

export async function reward(agentId: string, amount: number, reason: string): Promise<void> {
  const bal = getBalance(agentId);
  bal.balance += amount;
  bal.earned += amount;
  balances.set(agentId, bal);
  transactions.push({ from: 'treasury', to: agentId, amount, type: 'reward', timestamp: Date.now() });
  await bridge.broadcast(`[ECON] Reward: ${agentId} +${amount} DT (${reason})`, { agentId, amount, reason }, 'low');
}

export function getTransactions(limit = 50): Transaction[] { return transactions.slice(-limit); }

export { bridge };
export default { connect, getBalance, transfer, reward, getTransactions, bridge };
