/**
 * DreamNet Sync Stack - Unified sync stack combining Yjs, Automerge, and Replicache
 * 
 * Implements the DreamNet tri-stack pattern:
 * 1. Yjs + TipTap editor for Dream pages
 * 2. Automerge snapshotter for lineage
 * 3. Replicache mutator for redeemValue() with wallet signature
 */

import { YjsProvider } from '@dreamnet/sync-yjs-core';
import { AutomergeProvider, AutomergeSnapshotter } from '@dreamnet/sync-automerge-core';
import { ReplicacheClient } from '@dreamnet/sync-replicache-core';

export interface DreamSyncStackConfig {
  dreamId: string;
  replicacheServerUrl: string;
  enableYjs?: boolean;
  enableAutomerge?: boolean;
  enableReplicache?: boolean;
}

/**
 * DreamNet Sync Stack - Unified sync stack
 */
export class DreamSyncStack {
  private dreamId: string;
  private yjsProvider: YjsProvider | null = null;
  private automergeProvider: AutomergeProvider | null = null;
  private automergeSnapshotter: AutomergeSnapshotter | null = null;
  private replicacheClient: ReplicacheClient | null = null;

  constructor(config: DreamSyncStackConfig) {
    this.dreamId = config.dreamId;

    if (config.enableYjs !== false) {
      this.yjsProvider = new YjsProvider({
        documentId: `dream_${config.dreamId}`,
        enablePersistence: true,
      });
    }

    if (config.enableAutomerge !== false) {
      this.automergeProvider = new AutomergeProvider(`dream_${config.dreamId}`);
      this.automergeSnapshotter = new AutomergeSnapshotter(this.automergeProvider);
    }

    if (config.enableReplicache !== false) {
      this.replicacheClient = new ReplicacheClient({
        serverUrl: config.replicacheServerUrl,
        enableOptimisticUpdates: true,
      });
    }
  }

  /**
   * Get Yjs provider (for rich text editing)
   */
  getYjsProvider(): YjsProvider | null {
    return this.yjsProvider;
  }

  /**
   * Get Automerge provider (for lineage tracking)
   */
  getAutomergeProvider(): AutomergeProvider | null {
    return this.automergeProvider;
  }

  /**
   * Get Automerge snapshotter (for periodic snapshots)
   */
  getAutomergeSnapshotter(): AutomergeSnapshotter | null {
    return this.automergeSnapshotter;
  }

  /**
   * Get Replicache client (for transactional operations)
   */
  getReplicacheClient(): ReplicacheClient | null {
    return this.replicacheClient;
  }

  /**
   * Redeem value using Replicache (with wallet signature)
   */
  async redeemValue(amount: number, walletSignature: string): Promise<any> {
    if (!this.replicacheClient) {
      throw new Error('Replicache client not initialized');
    }

    return this.replicacheClient.mutate('redeemValue', {
      dreamId: this.dreamId,
      amount,
    }, walletSignature);
  }

  /**
   * Create snapshot for lineage tracking
   */
  async createSnapshot(): Promise<any> {
    if (!this.automergeSnapshotter) {
      throw new Error('Automerge snapshotter not initialized');
    }

    return this.automergeSnapshotter.createSnapshot();
  }

  /**
   * Cleanup all providers
   */
  destroy(): void {
    if (this.yjsProvider) {
      this.yjsProvider.destroy();
    }
    if (this.automergeSnapshotter) {
      this.automergeSnapshotter.destroy();
    }
  }
}

