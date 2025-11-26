import React, { useState, useEffect } from 'react';

let useBase: any = null;
try {
  const baseProvider = require('../../../client/src/providers/BaseProvider');
  useBase = baseProvider.useBase;
} catch (e) {}

export function X402MultiChainBridge() {
  const baseHook = useBase ? useBase() : null;
  const signer = baseHook?.signer || null;
  const address = baseHook?.address || null;
  const isConnected = baseHook?.isConnected || false;
  const connect = baseHook?.connect || (async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.location.reload();
    }
  });

  const [fromChain, setFromChain] = useState<string>('base');
  const [toChain, setToChain] = useState<string>('bsc');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const chains = [
    { id: 'base', name: 'Base' },
    { id: 'bsc', name: 'BSC' },
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'solana', name: 'Solana' },
  ];

  useEffect(() => {
    if (isConnected && address && fromChain) {
      fetchBalance();
    }
  }, [isConnected, address, fromChain]);

  const fetchBalance = async () => {
    if (!address) return;
    try {
      const response = await fetch(`/api/x402/balance?address=${address}&chain=${fromChain}`);
      const data = await response.json();
      if (data.balance) {
        setBalance(data.balance);
      }
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  };

  const handleBridge = async () => {
    if (!isConnected || !signer || !address) {
      await connect();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (fromChain === toChain) {
      setError('Source and destination chains must be different');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTxHash(null);

      const response = await fetch('/api/x402/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: address,
          fromChain,
          toChain,
          amount,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.txHash) {
        setTxHash(data.txHash);
        await fetchBalance();
      }
    } catch (err: any) {
      console.error('Bridge failed:', err);
      setError(err.message || 'Bridge failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">X402 Multi-Chain Bridge</h1>
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <p className="text-gray-300 mb-4">Connect your MetaMask wallet to bridge X402 tokens</p>
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
      <h1 className="text-3xl font-bold mb-6 text-white">X402 Multi-Chain Bridge</h1>
      <p className="text-gray-400 mb-6">Bridge X402 tokens across chains with low fees</p>

      {balance && (
        <div className="mb-6 bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
          <p className="text-gray-300">
            <span className="font-semibold">Balance ({fromChain}):</span> {balance} X402
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {txHash && (
        <div className="mb-4 bg-green-500/20 border border-green-500/50 rounded-lg p-4">
          <p className="text-green-300">
            Bridge initiated!{' '}
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View Transaction
            </a>
          </p>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
        <h2 className="text-xl font-semibold text-white mb-4">Bridge Tokens</h2>
        <div className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm">From Chain</label>
            <select
              value={fromChain}
              onChange={(e) => {
                setFromChain(e.target.value);
                fetchBalance();
              }}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
            >
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-center text-2xl text-cyan-400">→</div>
          <div>
            <label className="text-gray-300 text-sm">To Chain</label>
            <select
              value={toChain}
              onChange={(e) => setToChain(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
            >
              {chains.filter(c => c.id !== fromChain).map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-gray-300 text-sm">Amount (X402)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
              placeholder="0.1"
              step="0.001"
              min="0"
            />
          </div>
          <div className="bg-gray-700 rounded p-3">
            <p className="text-gray-400 text-sm mb-1">Bridge Fee</p>
            <p className="text-cyan-400 font-semibold">&lt;0.5%</p>
          </div>
          <button
            onClick={handleBridge}
            disabled={loading || !amount || fromChain === toChain}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded"
          >
            {loading ? 'Bridging...' : 'Bridge Tokens'}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
        <p className="text-gray-400 text-sm">
          💡 <strong>Note:</strong> Bridge transactions typically complete in 1-5 minutes. 
          Fees are kept low (&lt;0.5%) for cross-chain transfers.
        </p>
      </div>
    </div>
  );
}

