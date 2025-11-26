import React, { useState, useEffect } from 'react';

// Try to import BaseProvider, fallback to direct ethers if not available
let useBase: any = null;
try {
  const baseProvider = require('../../../client/src/providers/BaseProvider');
  useBase = baseProvider.useBase;
} catch (e) {
  // BaseProvider not available, will use direct ethers connection
}

interface PaymentRequest {
  recipient: string;
  amount: string;
  chain: 'bsc' | 'ethereum' | 'solana' | 'base';
  serviceId?: string;
}

export function X402PaymentGateway() {
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

  const [payment, setPayment] = useState<PaymentRequest>({
    recipient: '',
    amount: '',
    chain: 'base',
    serviceId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      fetchBalance();
    }
  }, [isConnected, address]);

  const fetchBalance = async () => {
    if (!address) return;
    try {
      const response = await fetch(`/api/x402/balance?address=${address}&chain=${payment.chain}`);
      const data = await response.json();
      if (data.balance) {
        setBalance(data.balance);
      }
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  };

  const handlePayment = async () => {
    if (!isConnected || !signer || !address) {
      await connect();
      return;
    }

    if (!payment.recipient || !payment.amount) {
      setError('Recipient and amount are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTxHash(null);

      const response = await fetch('/api/x402/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: address,
          to: payment.recipient,
          amount: payment.amount,
          chain: payment.chain,
          serviceId: payment.serviceId,
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
      console.error('Payment failed:', err);
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">X402 Payment Gateway</h1>
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <p className="text-gray-300 mb-4">Connect your MetaMask wallet to send X402 payments</p>
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
      <h1 className="text-3xl font-bold mb-6 text-white">X402 Payment Gateway</h1>
      <p className="text-gray-400 mb-6">Multi-chain micropayments for AI agents</p>

      {balance && (
        <div className="mb-6 bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
          <p className="text-gray-300">
            <span className="font-semibold">Balance ({payment.chain}):</span> {balance} X402
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
            Payment sent!{' '}
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
        <h2 className="text-xl font-semibold text-white mb-4">Send Payment</h2>
        <div className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm">Chain</label>
            <select
              value={payment.chain}
              onChange={(e) => {
                setPayment({...payment, chain: e.target.value as any});
                fetchBalance();
              }}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
            >
              <option value="base">Base</option>
              <option value="bsc">BSC</option>
              <option value="ethereum">Ethereum</option>
              <option value="solana">Solana</option>
            </select>
          </div>
          <div>
            <label className="text-gray-300 text-sm">Recipient Address</label>
            <input
              type="text"
              value={payment.recipient}
              onChange={(e) => setPayment({...payment, recipient: e.target.value})}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
              placeholder="0x..."
            />
          </div>
          <div>
            <label className="text-gray-300 text-sm">Amount (X402)</label>
            <input
              type="number"
              value={payment.amount}
              onChange={(e) => setPayment({...payment, amount: e.target.value})}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
              placeholder="0.1"
              step="0.001"
              min="0"
            />
          </div>
          <div>
            <label className="text-gray-300 text-sm">Service ID (Optional)</label>
            <input
              type="text"
              value={payment.serviceId}
              onChange={(e) => setPayment({...payment, serviceId: e.target.value})}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
              placeholder="service-123"
            />
          </div>
          <button
            onClick={handlePayment}
            disabled={loading || !payment.recipient || !payment.amount}
            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded"
          >
            {loading ? 'Processing...' : 'Send Payment'}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
        <p className="text-gray-400 text-sm">
          💡 <strong>Tip:</strong> X402 enables real-time micropayments between AI agents. 
          Payments settle in &lt;1 second with low fees.
        </p>
      </div>
    </div>
  );
}

