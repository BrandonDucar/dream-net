import React, { useState, useEffect } from 'react';
import { CONTRACT_ADDRESSES } from './config.js';
import { ethers } from 'ethers';

// Try to import BaseProvider, fallback to direct ethers if not available
let useBase: any = null;
try {
  const baseProvider = require('../../../client/src/providers/BaseProvider');
  useBase = baseProvider.useBase;
} catch (e) {
  // BaseProvider not available, will use direct ethers connection
}

const BOUNTY_ABI = [
  {
    name: 'createBounty',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'description', type: 'string' },
      { name: 'deadline', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'claimBounty',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'bountyId', type: 'uint256' },
      { name: 'winner', type: 'address' },
    ],
    outputs: [],
  },
  {
    name: 'cancelBounty',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'bountyId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'bounties',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'bountyId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'creator', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'description', type: 'string' },
          { name: 'winner', type: 'address' },
          { name: 'isClaimed', type: 'bool' },
          { name: 'isActive', type: 'bool' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
    ],
  },
  {
    name: 'bountyCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'BountyCreated',
    type: 'event',
    inputs: [
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'creator', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
];

export function BountyBoardMini() {
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
  const [bounties, setBounties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    deadline: '',
    amount: '0.01',
  });

  useEffect(() => {
    if (isConnected && signer) {
      loadBounties();
    }
  }, [isConnected, signer]);

  const loadBounties = async () => {
    if (!signer) return;
    try {
      setLoading(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.BountyEscrow, BOUNTY_ABI, signer);
      const count = await contract.bountyCount();
      
      const bountyPromises = [];
      for (let i = 0; i < Number(count); i++) {
        bountyPromises.push(contract.bounties(i));
      }
      
      const bountyData = await Promise.all(bountyPromises);
      const loadedBounties = bountyData
        .map((bounty: any, index: number) => ({
          id: index,
          creator: bounty.creator,
          amount: ethers.formatEther(bounty.amount),
          description: bounty.description,
          winner: bounty.winner,
          isClaimed: bounty.isClaimed,
          isActive: bounty.isActive,
          createdAt: Number(bounty.createdAt),
          deadline: Number(bounty.deadline),
        }))
        .filter((b: any) => b.isActive && !b.isClaimed);
      
      setBounties(loadedBounties);
    } catch (err: any) {
      console.error('Failed to load bounties:', err);
      setError(err.message || 'Failed to load bounties');
    } finally {
      setLoading(false);
    }
  };

  const createBounty = async () => {
    if (!isConnected || !signer || !address) {
      await connect();
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    if (!formData.deadline) {
      setError('Deadline is required');
      return;
    }

    const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000);
    if (deadlineTimestamp <= Date.now() / 1000) {
      setError('Deadline must be in the future');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTxHash(null);

      const contract = new ethers.Contract(CONTRACT_ADDRESSES.BountyEscrow, BOUNTY_ABI, signer);
      const amountWei = ethers.parseEther(formData.amount);

      const tx = await contract.createBounty(formData.description, deadlineTimestamp, {
        value: amountWei,
      });

      setTxHash(tx.hash);
      await tx.wait();
      
      setFormData({ description: '', deadline: '', amount: '0.01' });
      setShowCreate(false);
      await loadBounties();
    } catch (err: any) {
      console.error('Create bounty failed:', err);
      setError(err.message || 'Failed to create bounty');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Bounty Board</h1>
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <p className="text-gray-300 mb-4">Connect your wallet to post and claim bounties</p>
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
      <h1 className="text-3xl font-bold mb-6 text-white">Bounty Board</h1>
      
      {error && (
        <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {txHash && (
        <div className="mb-4 bg-green-500/20 border border-green-500/50 rounded-lg p-4">
          <p className="text-green-300">
            Transaction submitted!{' '}
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View on BaseScan
            </a>
          </p>
        </div>
      )}

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setShowCreate(!showCreate)}
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded"
        >
          {showCreate ? 'Cancel' : 'Post Bounty'}
        </button>
      </div>

      {showCreate && (
        <div className="mb-6 bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">Create New Bounty</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
                placeholder="Describe the bounty..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm">Bounty Amount (ETH)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
                step="0.001"
                min="0.001"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm">Deadline</label>
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
              />
            </div>
            <button
              onClick={createBounty}
              disabled={loading || !formData.description.trim() || !formData.deadline}
              className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded"
            >
              {loading ? 'Posting...' : `Post Bounty (${formData.amount} ETH)`}
            </button>
          </div>
        </div>
      )}

      {loading && !showCreate && (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading bounties...</p>
        </div>
      )}

      <div className="space-y-4">
        {bounties.length === 0 && !loading ? (
          <p className="text-gray-400">No active bounties. Post your first bounty!</p>
        ) : (
          bounties.map((bounty) => (
            <div key={bounty.id} className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{bounty.description}</h3>
                  <p className="text-gray-400 text-sm">
                    Created: {new Date(bounty.createdAt * 1000).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Deadline: {new Date(bounty.deadline * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-cyan-400 font-bold text-xl">{bounty.amount} ETH</p>
                  <p className="text-gray-400 text-xs">Bounty</p>
                </div>
              </div>
              {address?.toLowerCase() === bounty.creator.toLowerCase() && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">You created this bounty</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
