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

const VAULT_ABI = [
  {
    name: 'createVault',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'revenueShare', type: 'uint256' },
      { name: 'isPublic', type: 'bool' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'vaultData',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'name', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'creator', type: 'address' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'revenueShare', type: 'uint256' },
          { name: 'isPublic', type: 'bool' },
        ],
      },
    ],
  },
  {
    name: 'ownerVaults',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256[]' }],
  },
  {
    name: 'VaultCreated',
    type: 'event',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'creator', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false },
    ],
  },
];

export function DreamVaultMini() {
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
  const [vaults, setVaults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    revenueShare: '1000', // 10% in basis points
    isPublic: true,
  });

  useEffect(() => {
    if (isConnected && address && signer) {
      loadVaults();
    }
  }, [isConnected, address, signer]);

  const loadVaults = async () => {
    if (!signer || !address) return;
    try {
      setLoading(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.DreamVault, VAULT_ABI, signer);
      const vaultIds = await contract.ownerVaults(address);
      
      const vaultPromises = vaultIds.map(async (id: bigint) => {
        const data = await contract.vaultData(id);
        return {
          id: Number(id),
          name: data.name,
          description: data.description,
          creator: data.creator,
          createdAt: Number(data.createdAt),
          revenueShare: Number(data.revenueShare),
          isPublic: data.isPublic,
        };
      });
      
      const loadedVaults = await Promise.all(vaultPromises);
      setVaults(loadedVaults);
    } catch (err: any) {
      console.error('Failed to load vaults:', err);
      setError(err.message || 'Failed to load vaults');
    } finally {
      setLoading(false);
    }
  };

  const createVault = async () => {
    if (!isConnected || !signer || !address) {
      await connect();
      return;
    }

    if (!formData.name.trim()) {
      setError('Vault name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTxHash(null);

      const contract = new ethers.Contract(CONTRACT_ADDRESSES.DreamVault, VAULT_ABI, signer);
      const revenueShareBps = BigInt(Math.floor(parseFloat(formData.revenueShare) * 100)); // Convert percentage to basis points

      const tx = await contract.createVault(
        address,
        formData.name,
        formData.description,
        revenueShareBps,
        formData.isPublic
      );

      setTxHash(tx.hash);
      await tx.wait();
      
      setFormData({ name: '', description: '', revenueShare: '1000', isPublic: true });
      setShowCreate(false);
      await loadVaults();
    } catch (err: any) {
      console.error('Create vault failed:', err);
      setError(err.message || 'Failed to create vault');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Dream Vault</h1>
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <p className="text-gray-300 mb-4">Connect your wallet to create and manage vaults</p>
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
      <h1 className="text-3xl font-bold mb-6 text-white">Dream Vault</h1>
      
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
          {showCreate ? 'Cancel' : 'Create Vault'}
        </button>
      </div>

      {showCreate && (
        <div className="mb-6 bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">Create New Vault</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm">Vault Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
                placeholder="My Dream Vault"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
                placeholder="Describe your vault..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm">Revenue Share (%)</label>
              <input
                type="number"
                value={formData.revenueShare}
                onChange={(e) => setFormData({...formData, revenueShare: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
                step="0.1"
                min="0"
                max="100"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                className="w-4 h-4"
              />
              <label className="text-gray-300 text-sm">Public Vault</label>
            </div>
            <button
              onClick={createVault}
              disabled={loading || !formData.name.trim()}
              className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded"
            >
              {loading ? 'Creating...' : 'Create Vault'}
            </button>
          </div>
        </div>
      )}

      {loading && !showCreate && (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading vaults...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vaults.length === 0 && !loading ? (
          <p className="text-gray-400 col-span-full">No vaults yet. Create your first vault!</p>
        ) : (
          vaults.map((vault) => (
            <div key={vault.id} className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
              <h3 className="text-xl font-semibold text-white mb-2">{vault.name}</h3>
              <p className="text-gray-300 text-sm mb-2">{vault.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-400 text-xs">
                  Revenue: {(vault.revenueShare / 100).toFixed(1)}%
                </span>
                <span className={`text-xs px-2 py-1 rounded ${vault.isPublic ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                  {vault.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
