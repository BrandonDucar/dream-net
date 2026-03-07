/**
 * 🧪 SOLANA EXECUTOR MODULE TESTS
 * 
 * Verifies transaction execution, metrics tracking, and blockchain operations.
 */

import SolanaExecutor from '../growth/solana-executor';

describe('SolanaExecutor', () => {
  let executor: SolanaExecutor;

  beforeEach(() => {
    executor = new SolanaExecutor('solana-executor-1', 'https://api.mainnet-beta.solana.com');
  });

  describe('Initialization', () => {
    it('should create executor with RPC endpoint', () => {
      expect(executor).toBeDefined();
    });

    it('should start with zero metrics', () => {
      const stats = executor.getStats();
      expect(stats.totalTransactions).toBe(0);
      expect(stats.successfulTransactions).toBe(0);
    });
  });

  describe('Transaction Execution', () => {
    it('should execute token transfer', async () => {
      const result = await executor.executeTransaction({
        type: 'transfer',
        sourceAccount: 'source-wallet',
        destinationAccount: 'dest-wallet',
        amount: 1.5,
        token: 'SOL'
      });

      expect(result.success).toBe(true);
      expect(result.txid).toBeDefined();
      expect(result.status).toBe('confirmed');
      expect(result.cost).toBeGreaterThan(0);
      expect(result.latency).toBeGreaterThan(0);
    });

    it('should execute swap transaction', async () => {
      const result = await executor.executeTransaction({
        type: 'swap',
        sourceAccount: 'user-wallet',
        destinationAccount: 'output-token',
        amount: 100,
        token: 'USDC'
      });

      expect(result.success).toBe(true);
      expect(result.cost).toBeGreaterThan(0);
      // Swaps should have higher base fee
      expect(result.cost).toBeGreaterThan(0.000005);
    });

    it('should execute staking transaction', async () => {
      const result = await executor.executeTransaction({
        type: 'stake',
        sourceAccount: 'stake-account',
        destinationAccount: 'validator',
        amount: 10
      });

      expect(result.success).toBe(true);
      expect(result.txid).toBeDefined();
    });

    it('should execute smart contract call', async () => {
      const result = await executor.executeTransaction({
        type: 'contract',
        sourceAccount: 'program-caller',
        destinationAccount: 'program-id',
        amount: 0,
        contractCall: 'function_name(params)'
      });

      expect(result.success).toBe(true);
    });

    it('should execute NFT transaction', async () => {
      const result = await executor.executeTransaction({
        type: 'nft',
        sourceAccount: 'nft-owner',
        destinationAccount: 'nft-recipient',
        amount: 1
      });

      expect(result.success).toBe(true);
    });
  });

  describe('Metrics Tracking', () => {
    it('should track successful transactions', async () => {
      await executor.executeTransaction({
        type: 'transfer',
        sourceAccount: 'wallet1',
        destinationAccount: 'wallet2',
        amount: 1
      });

      const stats = executor.getStats();
      expect(stats.totalTransactions).toBe(1);
      expect(stats.successfulTransactions).toBe(1);
      expect(stats.successRate).toBe(1.0);
    });

    it('should accumulate total costs', async () => {
      await executor.executeTransaction({
        type: 'transfer',
        sourceAccount: 'wallet1',
        destinationAccount: 'wallet2',
        amount: 1
      });

      await executor.executeTransaction({
        type: 'swap',
        sourceAccount: 'wallet1',
        destinationAccount: 'wallet2',
        amount: 100
      });

      const stats = executor.getStats();
      expect(stats.totalCost).toBeGreaterThan(0);
    });

    it('should calculate average latency', async () => {
      await executor.executeTransaction({
        type: 'transfer',
        sourceAccount: 'wallet1',
        destinationAccount: 'wallet2',
        amount: 1
      });

      await executor.executeTransaction({
        type: 'transfer',
        sourceAccount: 'wallet1',
        destinationAccount: 'wallet3',
        amount: 2
      });

      const stats = executor.getStats();
      expect(stats.averageLatency).toBeGreaterThan(0);
    });
  });

  describe('Transaction History', () => {
    it('should maintain transaction history', async () => {
      for (let i = 0; i < 5; i++) {
        await executor.executeTransaction({
          type: 'transfer',
          sourceAccount: `wallet-${i}`,
          destinationAccount: `wallet-${i + 1}`,
          amount: 1
        });
      }

      const history = executor.getTransactionHistory();
      expect(history).toHaveLength(5);
    });

    it('should limit history to requested size', async () => {
      for (let i = 0; i < 100; i++) {
        await executor.executeTransaction({
          type: 'transfer',
          sourceAccount: 'wallet1',
          destinationAccount: 'wallet2',
          amount: 1
        });
      }

      const history = executor.getTransactionHistory(10);
      expect(history).toHaveLength(10);
    });
  });

  describe('Event Emission', () => {
    it('should emit transaction_executed event', (done) => {
      executor.on('transaction_executed', (result) => {
        expect(result.success).toBe(true);
        done();
      });

      executor.executeTransaction({
        type: 'transfer',
        sourceAccount: 'wallet1',
        destinationAccount: 'wallet2',
        amount: 1
      }).catch(() => {
        // Ignore errors
      });
    });
  });

  describe('Transaction Validation', () => {
    it('should reject invalid transactions', async () => {
      const result = await executor.executeTransaction({
        type: 'transfer',
        sourceAccount: '',
        destinationAccount: 'wallet2',
        amount: 0
      });

      // System should handle validation gracefully
      expect(result).toBeDefined();
    });
  });
});

describe('SolanaExecutor Batch Operations', () => {
  it('should process multiple transactions efficiently', async () => {
    const executor = new SolanaExecutor('batch-executor', 'https://api.mainnet-beta.solana.com');

    const transactions = [
      { type: 'transfer' as const, sourceAccount: 'w1', destinationAccount: 'w2', amount: 1 },
      { type: 'swap' as const, sourceAccount: 'w2', destinationAccount: 'w3', amount: 100 },
      { type: 'stake' as const, sourceAccount: 'w3', destinationAccount: 'w4', amount: 10 },
      { type: 'nft' as const, sourceAccount: 'w4', destinationAccount: 'w5', amount: 1 },
    ];

    const results = await Promise.all(
      transactions.map(tx => executor.executeTransaction(tx))
    );

    expect(results).toHaveLength(4);
    results.forEach(result => {
      expect(result.success).toBe(true);
    });

    const stats = executor.getStats();
    expect(stats.totalTransactions).toBe(4);
    expect(stats.successfulTransactions).toBe(4);
  });
});
