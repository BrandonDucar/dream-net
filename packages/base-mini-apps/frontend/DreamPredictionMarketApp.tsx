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

const PREDICTION_ABI = [
  {
    name: 'createPrediction',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'description', type: 'string' },
      { name: 'endTime', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'stakeOnPrediction',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'predictionId', type: 'uint256' },
      { name: 'outcome', type: 'bool' },
    ],
    outputs: [],
  },
  {
    name: 'resolvePrediction',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'predictionId', type: 'uint256' },
      { name: 'outcome', type: 'bool' },
    ],
    outputs: [],
  },
  {
    name: 'claimWinnings',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'predictionId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'getPrediction',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'predictionId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'description', type: 'string' },
          { name: 'creator', type: 'address' },
          { name: 'endTime', type: 'uint256' },
          { name: 'resolved', type: 'bool' },
          { name: 'outcome', type: 'bool' },
          { name: 'resolver', type: 'address' },
          { name: 'totalStaked', type: 'uint256' },
          { name: 'createdAt', type: 'uint256' },
        ],
      },
    ],
  },
  {
    name: 'getPoolSizes',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'predictionId', type: 'uint256' }],
    outputs: [
      { name: 'yesPool', type: 'uint256' },
      { name: 'noPool', type: 'uint256' },
    ],
  },
  {
    name: 'getUserStake',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'predictionId', type: 'uint256' },
      { name: 'user', type: 'address' },
      { name: 'outcome', type: 'bool' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'predictionCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
];

export function DreamPredictionMarketApp() {
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
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [stakeAmounts, setStakeAmounts] = useState<Record<number, string>>({});
  const [formData, setFormData] = useState({
    description: '',
    endDate: '',
  });

  useEffect(() => {
    if (isConnected && signer) {
      loadPredictions();
    }
  }, [isConnected, signer]);

  const loadPredictions = async () => {
    if (!signer) return;
    try {
      setLoading(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.DreamPredictionMarket, PREDICTION_ABI, signer);
      const count = await contract.predictionCount();
      
      const predictionPromises = [];
      for (let i = 0; i < Number(count); i++) {
        predictionPromises.push(
          Promise.all([
            contract.getPrediction(i),
            contract.getPoolSizes(i),
            address ? contract.getUserStake(i, address, true) : Promise.resolve(0),
            address ? contract.getUserStake(i, address, false) : Promise.resolve(0),
          ])
        );
      }
      
      const predictionData = await Promise.all(predictionPromises);
      const loadedPredictions = predictionData.map(([pred, pools, yesStake, noStake]: any, index: number) => ({
        id: index,
        description: pred.description,
        creator: pred.creator,
        endTime: Number(pred.endTime),
        resolved: pred.resolved,
        outcome: pred.outcome,
        resolver: pred.resolver,
        totalStaked: ethers.formatEther(pred.totalStaked),
        createdAt: Number(pred.createdAt),
        yesPool: ethers.formatEther(pools[0]),
        noPool: ethers.formatEther(pools[1]),
        userYesStake: ethers.formatEther(yesStake),
        userNoStake: ethers.formatEther(noStake),
      }));
      
      setPredictions(loadedPredictions.filter((p: any) => !p.resolved || p.userYesStake !== '0.0' || p.userNoStake !== '0.0'));
    } catch (err: any) {
      console.error('Failed to load predictions:', err);
      setError(err.message || 'Failed to load predictions');
    } finally {
      setLoading(false);
    }
  };

  const createPrediction = async () => {
    if (!isConnected || !signer || !address) {
      await connect();
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    if (!formData.endDate) {
      setError('End date is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTxHash(null);

      const endTimestamp = Math.floor(new Date(formData.endDate).getTime() / 1000);
      if (endTimestamp <= Date.now() / 1000) {
        setError('End date must be in the future');
        return;
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESSES.DreamPredictionMarket, PREDICTION_ABI, signer);
      const tx = await contract.createPrediction(formData.description, endTimestamp);

      setTxHash(tx.hash);
      await tx.wait();
      
      setFormData({ description: '', endDate: '' });
      setShowCreate(false);
      await loadPredictions();
    } catch (err: any) {
      console.error('Create prediction failed:', err);
      setError(err.message || 'Failed to create prediction');
    } finally {
      setLoading(false);
    }
  };

  const stakeOnPrediction = async (predictionId: number, outcome: boolean, amount: string) => {
    if (!signer || !amount || parseFloat(amount) <= 0) {
      setError('Invalid stake amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTxHash(null);

      const contract = new ethers.Contract(CONTRACT_ADDRESSES.DreamPredictionMarket, PREDICTION_ABI, signer);
      const amountWei = ethers.parseEther(amount);

      const tx = await contract.stakeOnPrediction(predictionId, outcome, {
        value: amountWei,
      });

      setTxHash(tx.hash);
      await tx.wait();
      setStakeAmounts({ ...stakeAmounts, [predictionId]: '' });
      await loadPredictions();
    } catch (err: any) {
      console.error('Stake failed:', err);
      setError(err.message || 'Failed to stake');
    } finally {
      setLoading(false);
    }
  };

  const claimWinnings = async (predictionId: number) => {
    if (!signer) return;

    try {
      setLoading(true);
      setError(null);
      setTxHash(null);

      const contract = new ethers.Contract(CONTRACT_ADDRESSES.DreamPredictionMarket, PREDICTION_ABI, signer);
      const tx = await contract.claimWinnings(predictionId);

      setTxHash(tx.hash);
      await tx.wait();
      await loadPredictions();
    } catch (err: any) {
      console.error('Claim winnings failed:', err);
      setError(err.message || 'Failed to claim winnings');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Dream Prediction Market</h1>
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <p className="text-gray-300 mb-4">Connect your wallet to create predictions and stake</p>
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
      <h1 className="text-3xl font-bold mb-6 text-white">Dream Prediction Market</h1>
      
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
          {showCreate ? 'Cancel' : 'Create Prediction'}
        </button>
      </div>

      {showCreate && (
        <div className="mb-6 bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">Create New Prediction</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm">Prediction Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
                placeholder="e.g., Will Agent X complete Mission Y by date Z?"
                rows={3}
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm">End Date</label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded mt-1"
              />
            </div>
            <button
              onClick={createPrediction}
              disabled={loading || !formData.description.trim() || !formData.endDate}
              className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded"
            >
              {loading ? 'Creating...' : 'Create Prediction'}
            </button>
          </div>
        </div>
      )}

      {loading && !showCreate && (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading predictions...</p>
        </div>
      )}

      <div className="space-y-4">
        {predictions.length === 0 && !loading ? (
          <p className="text-gray-400">No active predictions. Create your first one!</p>
        ) : (
          predictions.map((prediction) => {
            const userStaked = parseFloat(prediction.userYesStake) > 0 || parseFloat(prediction.userNoStake) > 0;
            const stakeAmount = stakeAmounts[prediction.id] || '0.01';

            return (
              <div key={prediction.id} className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{prediction.description}</h3>
                    <p className="text-gray-400 text-sm mb-2">
                      Ends: {new Date(prediction.endTime * 1000).toLocaleString()}
                    </p>
                    {prediction.resolved && (
                      <p className={`text-sm font-semibold ${prediction.outcome ? 'text-green-400' : 'text-red-400'}`}>
                        Result: {prediction.outcome ? 'YES' : 'NO'}
                      </p>
                    )}
                    {userStaked && (
                      <p className="text-cyan-400 text-sm mt-2">
                        Your stake: {prediction.userYesStake !== '0.0' ? `${prediction.userYesStake} ETH (YES)` : `${prediction.userNoStake} ETH (NO)`}
                      </p>
                    )}
                  </div>
                  {prediction.resolved && userStaked ? (
                    <button
                      onClick={() => claimWinnings(prediction.id)}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white px-4 py-2 rounded"
                    >
                      Claim Winnings
                    </button>
                  ) : prediction.resolved ? (
                    <span className="text-gray-400 text-sm">Resolved</span>
                  ) : (
                    <span className="text-yellow-400 text-sm">Active</span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-700 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">YES Pool</p>
                    <p className="text-green-400 text-lg font-semibold">{prediction.yesPool} ETH</p>
                  </div>
                  <div className="bg-gray-700 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">NO Pool</p>
                    <p className="text-red-400 text-lg font-semibold">{prediction.noPool} ETH</p>
                  </div>
                </div>

                {!prediction.resolved && (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Amount (ETH)"
                      step="0.001"
                      min="0.001"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmounts({ ...stakeAmounts, [prediction.id]: e.target.value })}
                      className="flex-1 bg-gray-700 text-white px-4 py-2 rounded"
                    />
                    <button
                      onClick={() => stakeOnPrediction(prediction.id, true, stakeAmount)}
                      disabled={loading || !stakeAmount || parseFloat(stakeAmount) <= 0}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded"
                    >
                      Bet YES
                    </button>
                    <button
                      onClick={() => stakeOnPrediction(prediction.id, false, stakeAmount)}
                      disabled={loading || !stakeAmount || parseFloat(stakeAmount) <= 0}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded"
                    >
                      Bet NO
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
