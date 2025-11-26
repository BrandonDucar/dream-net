import React, { useState, useEffect } from 'react';

let useBase: any = null;
try {
  const baseProvider = require('../../../client/src/providers/BaseProvider');
  useBase = baseProvider.useBase;
} catch (e) {}

interface ChainBalance {
  chain: string;
  balance: string;
  address: string;
}

export function X402BalanceViewer() {
  const baseHook = useBase ? useBase() : null;
  const address = baseHook?.address || null;
  const isConnected = baseHook?.isConnected || false;
  const connect = baseHook?.connect || (async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.location.reload();
    }
  });

  const [balances, setBalances] = useState<ChainBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chains = ['base', 'bsc', 'ethereum', 'solana'];

  useEffect(() => {
    if (isConnected && address) {
      fetchAllBalances();
    }
  }, [isConnected, address]);

  const fetchAllBalances = async () => {
    if (!address) return;
    setLoading(true);
    setError(null);

    try {
      const balancePromises = chains.map(async (chain) => {
        try {
          const response = await fetch(`/api/x402/balance?address=${address}&chain=${chain}`);
          const data = await response.json();
          return {
            chain,
            balance: data.balance || '0',
            address,
          };
        } catch (err) {
          return {
            chain,
            balance: 'Error',
            address,
          };
        }
      });

      const results = await Promise.all(balancePromises);
      setBalances(results);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch balances');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">X402 Balance Viewer</h1>
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <p className="text-gray-300 mb-4">Connect your MetaMask wallet to view X402 balances</p>
          <button
            onClick={connect}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">X402 Balance Viewer</h1>
      <p className="text-gray-400 mb-6">View your X402 token balances across all chains</p>

      {error && (
        <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-300">
          <span className="font-semibold">Address:</span> {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
        <button
          onClick={fetchAllBalances}
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading && balances.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading balances...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {balances.map((balance) => (
            <div
              key={balance.chain}
              className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-white capitalize">{balance.chain}</h3>
                <span className="text-2xl font-bold text-cyan-400">
                  {balance.balance === 'Error' ? '⚠️' : balance.balance}
                </span>
              </div>
              <p className="text-gray-400 text-sm">X402 Tokens</p>
              {balance.balance === 'Error' && (
                <p className="text-red-400 text-xs mt-2">Failed to fetch balance</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
        <p className="text-gray-400 text-sm">
          💡 <strong>Note:</strong> Balances are fetched in real-time from each chain. 
          Solana balances may take longer to load.
        </p>
      </div>
    </div>
  );
}

