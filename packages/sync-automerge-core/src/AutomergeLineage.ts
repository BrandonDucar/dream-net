/**
 * Automerge Lineage - Remix/lineage tracking
 * 
 * Tracks dream evolution chains and remix lineages using Automerge snapshots.
 */

import type { AutomergeSnapshotter } from './AutomergeSnapshotter.js';
import type { SnapshotMetadata } from './AutomergeSnapshotter.js';

export interface LineageNode {
  snapshotHash: string;
  timestamp: number;
  dreamId: string;
  parentDreamId?: string;
  remixOf?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Automerge Lineage - Manages dream evolution chains
 */
export class AutomergeLineage {
  private snapshotter: AutomergeSnapshotter;
  private nodes: Map<string, LineageNode> = new Map();

  constructor(snapshotter: AutomergeSnapshotter) {
    this.snapshotter = snapshotter;
  }

  /**
   * Add a lineage node (dream version)
   */
  addNode(node: LineageNode): void {
    this.nodes.set(node.snapshotHash, node);
  }

  /**
   * Get evolution chain for a dream
   */
  getEvolutionChain(dreamId: string): LineageNode[] {
    const chain: LineageNode[] = [];
    const visited = new Set<string>();

    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);

      const node = Array.from(this.nodes.values()).find(n => n.dreamId === id);
      if (!node) return;

      chain.push(node);

      if (node.parentDreamId) {
        traverse(node.parentDreamId);
      }
      if (node.remixOf) {
        node.remixOf.forEach(parentId => traverse(parentId));
      }
    };

    traverse(dreamId);
    return chain.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Get remix lineage (all dreams that remixed from this one)
   */
  getRemixLineage(dreamId: string): LineageNode[] {
    return Array.from(this.nodes.values())
      .filter(node => node.remixOf?.includes(dreamId))
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Visualize lineage as a graph
   */
  visualizeLineage(dreamId: string): any {
    const evolution = this.getEvolutionChain(dreamId);
    const remixes = this.getRemixLineage(dreamId);

    return {
      dreamId,
      evolution: evolution.map(n => ({
        hash: n.snapshotHash,
        timestamp: n.timestamp,
        metadata: n.metadata,
      })),
      remixes: remixes.map(n => ({
        hash: n.snapshotHash,
        dreamId: n.dreamId,
        timestamp: n.timestamp,
      })),
    };
  }
}

