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

const CAPSULE_ABI = [
  {
    name: 'createCapsule',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'dreamHash', type: 'bytes32' },
      { name: 'message', type: 'string' },
      { name: 'unlockTimestamp', type: 'uint256' },
      { name: 'allowEarlyUnlock', type: 'bool' },
      { name: 'earlyUnlockFee', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'unlockCapsule',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{ name: 'capsuleId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'getCapsule',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'capsuleId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'creator', type: 'address' },
          { name: 'dreamHash', type: 'bytes32' },
          { name: 'message', type: 'string' },
          { name: 'unlockTimestamp', type: 'uint256' },
          { name: 'isUnlocked', type: 'bool' },
          { name: 'earlyUnlockEnabled', type: 'bool' },
          { name: 'earlyUnlockFee', type: 'uint256' },
          { name: 'createdAt', type: 'uint256' },
        ],
      },
    ],
  },
  {
    name: 'getUserCapsules',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256[]' }],
  },
  {
    name: 'canUnlock',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'capsuleId', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'getTimeUntilUnlock',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'capsuleId', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
];

export function DreamTimeCapsuleApp() {
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
  const [capsules, setCapsules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    dreamHash: '',
    message: '',
    unlockDate: '',
    allowEarlyUnlock: false,
    earlyUnlockFee: '0.001',
  });

  useEffect(() => {
    if (isConnected && address && signer) {
      loadCapsules();
    }
  }, [isConnected, address, signer]);

  const loadCapsules = async () => {
    if (!signer || !address) return;
    try {
      setLoading(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.DreamTimeCapsule, CAPSULE_ABI, signer);
      const capsuleIds = await contract.getUserCapsules(address);
      
      const capsulePromises = capsuleIds.map(async (id: bigint) => {
        const data = await contract.getCapsule(id);
        const timeUntil = await contract.getTimeUntilUnlock(id);
        return {
          id: Number(id),
          creator: data.creator,
          dreamHash: data.dreamHash,
          message: data.message,
          unlockTimestamp: Number(data.unlockTimestamp),
          isUnlocked: data.isUnlocked,
          earlyUnlockEnabled: data.earlyUnlockEnabled,
          earlyUnlockFee: ethers.formatEther(data.earlyUnlockFee),
          createdAt: Number(data.createdAt),
          timeUntilUnlock: Number(timeUntil),
        };
      });
      
      const loadedCapsules = await Promise.all(capsulePromises);
      setCapsules(loadedCapsules);
    } catch (err: any) {
      console.error('Failed to load capsules:', err);
      setError(err.message || 'Failed to load capsules');
    } finally {
      setLoading(false);
    }
  };

  const createCapsule = async () => {
    if (!isConnected || !signer || !address) {
      await connect();
      return;
    }

    if (!formData.dreamHash.trim()) {
      setError('Dream hash is required');
      return;
    }

    if (!formData.unlockDate) {
      setError('Unlock date is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTxHash(null);

      const unlockTimestamp = Math.floor(new Date(formData.unlockDate).getTime() / 1000);
      if (unlockTimestamp <= Date.now() / 1000) {
        setError('Unlock date must be in the future');
        return;
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESSES.DreamTimeCapsule, CAPSULE_ABI, signer);
      const dreamHashBytes = ethers.hexlify(ethers.toUtf8Bytes(formData.dreamHash.slice(0, 32).padEnd(32, '0')));
      const dreamHash = ethers.keccak256(dreamHashBytes);
      const earlyUnlockFeeWei = formData.allowEarlyUnlock 
        ? ethers.parseEther(formData.earlyUnlockFee)
        : 0;

      const tx = await contract.createCapsule(
        dreamHash,
        formData.message,
        unlockTimestamp,
        formData.allowEarlyUnlock,
        earlyUnlockFeeWei
      );

      setTxHash(tx.hash);
      await tx.wait();
      
      setFormData({ dreamHash: '', message: '', unlockDate: '', allowEarlyUnlock: false, earlyUnlockFee: '0.001' });
      setShowCreate(false);
      await loadCapsules();
    } catch (err: any) {
      console.error('Create capsule failed:', err);
      setError(err.message || 'Failed to create capsule');
    } finally {
      setLoading(false);
    }
  };

  const unlockCapsule = async (capsuleId: number) => {
    if (!signer) return;
    
    try {
      setLoading(true);
      setError(null);
      setTxHash(null);

      const contract = new ethers.Contract(CONTRACT_ADDRESSES.DreamTimeCapsule, CAPSULE_ABI, signer);
      const capsule = await contract.getCapsule(capsuleId);
      
      let tx;
      if (Number(capsule.unlockTimestamp) > Date.now() / 1000 && capsule.earlyUnlockEnabled) {
        // Early unlock - need to pay fee
        const fee = capsule.earlyUnlockFee;
        tx = await contract.unlockCapsule(capsuleId, { value: fee });
      } else {
        // Normal unlock
        tx = await contract.unlockCapsule(capsuleId);
      }

      setTxHash(tx.hash);
      await tx.wait();
      await loadCapsules();
    } catch (err: any) {
      console.error('Unlock capsule failed:', err);
      setError(err.message || 'Failed to unlock capsule');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Dream Time Capsule</h1>
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <p className="text-gray-300 mb-4">Connect your wallet to create and unlock time capsules</p>
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
      <h1 className="text-3xl font-bold mb-6 text-white">Dream Time Capsule</h1>
      
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
          {showCreate ? 'Cancel' : 'Create Time Capsule'}
        </button>
      </div>

      {showCreate && (
        <div className="mb-6 bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">Create New Capsule</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm">Dream Hash</label>
              <input
                type="text"
                value={formData.dreamHash}
                onChange={(e) => setFormData({...formData, dreamHash: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
                placeholder="Your message to the future..."
                rows={4}
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm">Unlock Date</label>
              <input
                type="datetime-local"
                value={formData.unlockDate}
                onChange={(e) => setFormData({...formData, unlockDate: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.allowEarlyUnlock}
                onChange={(e) => setFormData({...formData, allowEarlyUnlock: e.target.checked})}
                className="w-4 h-4"
              />
              <label className="text-gray-300 text-sm">Allow Early Unlock (with fee)</label>
            </div>
            {formData.allowEarlyUnlock && (
              <div>
                <label className="text-gray-300 text-sm">Early Unlock Fee (ETH)</label>
                <input
                  type="number"
                  value={formData.earlyUnlockFee}
                  onChange={(e) => setFormData({...formData, earlyUnlockFee: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
                  step="0.001"
                />
              </div>
            )}
            <button
              onClick={createCapsule}
              disabled={loading || !formData.dreamHash.trim() || !formData.unlockDate}
              className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded"
            >
              {loading ? 'Sealing...' : 'Seal Capsule'}
            </button>
          </div>
        </div>
      )}

      {loading && !showCreate && (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading capsules...</p>
        </div>
      )}

      <div className="space-y-4">
        {capsules.length === 0 && !loading ? (
          <p className="text-gray-400">No time capsules yet. Create your first one!</p>
        ) : (
          capsules.map((capsule) => {
            const canUnlock = capsule.isUnlocked || 
              (Date.now() / 1000 >= capsule.unlockTimestamp) ||
              (capsule.earlyUnlockEnabled && capsule.timeUntilUnlock > 0);
            
            return (
              <div key={capsule.id} className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-white font-mono text-sm mb-2">{capsule.dreamHash}</p>
                    <p className="text-gray-300 text-sm mb-2">{capsule.message}</p>
                    <p className="text-gray-400 text-xs mb-1">
                      Unlocks: {new Date(capsule.unlockTimestamp * 1000).toLocaleString()}
                    </p>
                    {capsule.timeUntilUnlock > 0 && !capsule.isUnlocked && (
                      <p className="text-gray-500 text-xs">
                        {Math.floor(capsule.timeUntilUnlock / 86400)} days until unlock
                      </p>
                    )}
                    {capsule.earlyUnlockEnabled && (
                      <p className="text-yellow-400 text-xs mt-1">
                        Early unlock available ({capsule.earlyUnlockFee} ETH)
                      </p>
                    )}
                  </div>
                  {capsule.isUnlocked ? (
                    <span className="text-green-400 text-sm">✓ Unlocked</span>
                  ) : canUnlock ? (
                    <button
                      onClick={() => unlockCapsule(capsule.id)}
                      disabled={loading}
                      className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Unlock
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">Locked</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
