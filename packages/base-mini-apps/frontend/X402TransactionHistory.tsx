import React, { useState, useEffect } from 'react';

let useBase: any = null;
try {
  const baseProvider = require('../../../client/src/providers/BaseProvider');
  useBase = baseProvider.useBase;
} catch (e) {}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  chain: string;
  timestamp: string;
  txHash: string;
  serviceId?: string;
}

export function X402TransactionHistory() {
  const baseHook = useBase ? useBase() : null;
  const address = baseHook?.address || null;
  const isConnected = baseHook?.isConnected || false;
  const connect = baseHook?.connect || (async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.location.reload();
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');

  useEffect(() => {
    if (isConnected && address) {
      fetchTransactions();
    }
  }, [isConnected, address, filter]);

  const fetchTransactions = async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      // This would call your backend API
      const response = await fetch(`/api/x402/transactions?address=${address}&filter=${filter}`);
      const data = await response.json();
      if (data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">X402 Transaction History</h1>
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <p className="text-gray-300 mb-4">Connect your MetaMask wallet to view transaction history</p>
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

  const filteredTxs = filter === 'all' 
    ? transactions 
    : filter === 'sent'
    ? transactions.filter(tx => tx.from.toLowerCase() === address?.toLowerCase())
    : transactions.filter(tx => tx.to.toLowerCase() === address?.toLowerCase());

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">X402 Transaction History</h1>
      <p className="text-gray-400 mb-6">View your complete X402 payment history</p>

      {error && (
        <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${
            filter === 'all' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('sent')}
          className={`px-4 py-2 rounded ${
            filter === 'sent' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          Sent
        </button>
        <button
          onClick={() => setFilter('received')}
          className={`px-4 py-2 rounded ${
            filter === 'received' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          Received
        </button>
      </div>

      {loading && transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading transactions...</p>
        </div>
      ) : filteredTxs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTxs.map((tx) => (
            <div
              key={tx.id}
              className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      tx.from.toLowerCase() === address?.toLowerCase()
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}>
                      {tx.from.toLowerCase() === address?.toLowerCase() ? 'Sent' : 'Received'}
                    </span>
                    <span className="text-gray-400 text-sm capitalize">{tx.chain}</span>
                  </div>
                  <p className="text-white font-semibold">{tx.amount} X402</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {tx.from.toLowerCase() === address?.toLowerCase() ? 'To' : 'From'}:{' '}
                    {tx.from.toLowerCase() === address?.toLowerCase() ? tx.to : tx.from}
                  </p>
                  {tx.serviceId && (
                    <p className="text-gray-500 text-xs mt-1">Service: {tx.serviceId}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
                <a
                  href={`https://basescan.org/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 text-sm"
                >
                  View →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

