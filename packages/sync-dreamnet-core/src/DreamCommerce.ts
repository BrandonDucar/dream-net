/**
 * Dream Commerce - Replicache commerce layer
 * 
 * Handles transactional operations (payments, credits, tips) using Replicache.
 */

import type { DreamSyncStack } from './DreamSyncStack.js';

/**
 * Dream Commerce - Commerce operations via Replicache
 */
export class DreamCommerce {
  private syncStack: DreamSyncStack;

  constructor(syncStack: DreamSyncStack) {
    this.syncStack = syncStack;
  }

  /**
   * Mint a card (requires wallet signature)
   */
  async mintCard(walletSignature: string, cardData: Record<string, any>): Promise<any> {
    const client = this.syncStack.getReplicacheClient();
    if (!client) {
      throw new Error('Replicache client not initialized');
    }

    return client.mutate('mintCard', cardData, walletSignature);
  }

  /**
   * Redeem value (requires wallet signature)
   */
  async redeemValue(amount: number, walletSignature: string): Promise<any> {
    return this.syncStack.redeemValue(amount, walletSignature);
  }

  /**
   * Tip another user (requires wallet signature)
   */
  async tip(targetUserId: string, amount: number, walletSignature: string): Promise<any> {
    const client = this.syncStack.getReplicacheClient();
    if (!client) {
      throw new Error('Replicache client not initialized');
    }

    return client.mutate('tip', {
      targetUserId,
      amount,
    }, walletSignature);
  }

  /**
   * Vote on something (server-validated, no double-vote)
   */
  async vote(voteId: string, choice: string): Promise<any> {
    const client = this.syncStack.getReplicacheClient();
    if (!client) {
      throw new Error('Replicache client not initialized');
    }

    return client.mutate('vote', {
      voteId,
      choice,
    });
  }

  /**
   * Join a team (server-validated)
   */
  async joinTeam(teamId: string): Promise<any> {
    const client = this.syncStack.getReplicacheClient();
    if (!client) {
      throw new Error('Replicache client not initialized');
    }

    return client.mutate('joinTeam', {
      teamId,
    });
  }
}

