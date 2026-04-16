/**
 * @dreamnet/reproductive — Agent Spawning & Evolution
 * 
 * Creates new agents, manages agent evolution, mutation, and genetic algorithms.
 */

import { createBridge } from '../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'reproductive',
  name: 'DreamNet Reproductive System',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['agent-spawning', 'evolution', 'mutation', 'genetic-algorithms', 'cloning'],
  metadata: { organ: 'reproductive', role: 'agent-evolution' },
});

export interface AgentGenome { agentId: string; traits: Record<string, number>; generation: number; parentIds: string[]; fitness: number; }

const genomes: Map<string, AgentGenome> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function registerGenome(genome: AgentGenome): void { genomes.set(genome.agentId, genome); }

export function crossover(parentA: string, parentB: string): AgentGenome | undefined {
  const a = genomes.get(parentA);
  const b = genomes.get(parentB);
  if (!a || !b) return undefined;
  const childTraits: Record<string, number> = {};
  const allKeys = new Set([...Object.keys(a.traits), ...Object.keys(b.traits)]);
  for (const key of allKeys) {
    childTraits[key] = Math.random() > 0.5 ? (a.traits[key] || 0) : (b.traits[key] || 0);
    // Mutation: 10% chance of random variation
    if (Math.random() < 0.1) childTraits[key] *= (0.8 + Math.random() * 0.4);
  }
  const child: AgentGenome = { agentId: `evolved-${Date.now()}`, traits: childTraits, generation: Math.max(a.generation, b.generation) + 1, parentIds: [parentA, parentB], fitness: 0 };
  genomes.set(child.agentId, child);
  return child;
}

export function getGenome(agentId: string): AgentGenome | undefined { return genomes.get(agentId); }
export function getPopulation(): AgentGenome[] { return Array.from(genomes.values()); }

export { bridge };
export default { connect, registerGenome, crossover, getGenome, getPopulation, bridge };
