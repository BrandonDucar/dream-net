/**
 * SLU Pool App - Frontend for Staked Liquidity Units pools
 * 
 * Allows users to:
 * - Add liquidity with stSPK + paired tokens
 * - View SLU positions and rewards
 * - Claim triple yield (staking + fees + emissions)
 * - Monitor pool health
 */

import { useState, useEffect } from 'react';
import { useAccount, useBalance, useContractWrite, useContractRead } from 'wagmi';
import { ethers } from 'ethers';
import { 
  Wallet, 
  TrendingUp, 
  Zap, 
  Shield, 
  ArrowUpDown,
  Coins,
  Activity
} from 'lucide-react';

interface SLUPoolAppProps {
  poolAddress: string;
  stSPKAddress: string;
  pairedTokenAddress: string;
  pairedTokenSymbol: string;
}

export function SLUPoolApp({ 
  poolAddress, 
  stSPKAddress, 
  pairedTokenAddress,
  pairedTokenSymbol 
}: SLUPoolAppProps) {
  const { address, isConnected } = useAccount();
  const [stSPKAmount, setStSPKAmount] = useState('');
  const [pairedAmount, setPairedAmount] = useState('');
  const [action, setAction] = useState<'add' | 'remove' | 'claim'>('add');

  // Fetch balances
  const { data: stSPKBalance } = useBalance({
    address,
    token: stSPKAddress as `0x${string}`,
    enabled: isConnected,
  });

  const { data: pairedBalance } = useBalance({
    address,
    token: pairedTokenAddress as `0x${string}`,
    enabled: isConnected,
  });

  // Fetch SLU info
  const { data: sluInfo } = useContractRead({
    address: poolAddress as `0x${string}`,
    abi: [
      {
        name: 'getSLUInfo',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'user', type: 'address' }],
        outputs: [
          {
            components: [
              { name: 'pool', type: 'address' },
              { name: 'stSPKAmount', type: 'uint256' },
              { name: 'pairedAmount', type: 'uint256' },
              { name: 'stakingRewards', type: 'uint256' },
              { name: 'swapFees', type: 'uint256' },
              { name: 'emissions', type: 'uint256' },
            ],
            name: '',
            type: 'tuple',
          },
        ],
      },
    ],
    functionName: 'getSLUInfo',
    args: [address as `0x${string}`],
    enabled: isConnected && !!address,
  });

  // Fetch total rewards
  const { data: totalRewards } = useContractRead({
    address: poolAddress as `0x${string}`,
    abi: [
      {
        name: 'getTotalRewards',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [
          { name: '', type: 'uint256' },
          { name: '', type: 'uint256' },
          { name: '', type: 'uint256' },
        ],
      },
    ],
    functionName: 'getTotalRewards',
    enabled: isConnected,
  });

  // Add liquidity
  const { write: addLiquidity, isLoading: addingLiquidity } = useContractWrite({
    address: poolAddress as `0x${string}`,
    abi: [
      {
        name: 'addLiquidity',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'stSPKAmount', type: 'uint256' },
          { name: 'pairedAmount', type: 'uint256' },
          { name: 'to', type: 'address' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'addLiquidity',
  });

  // Claim rewards
  const { write: claimRewards, isLoading: claimingRewards } = useContractWrite({
    address: poolAddress as `0x${string}`,
    abi: [
      {
        name: 'claimRewards',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'to', type: 'address' }],
        outputs: [
          { name: '', type: 'uint256' },
          { name: '', type: 'uint256' },
          { name: '', type: 'uint256' },
        ],
      },
    ],
    functionName: 'claimRewards',
  });

  const handleAddLiquidity = async () => {
    if (!address || !stSPKAmount || !pairedAmount) return;

    try {
      const stSPKWei = ethers.parseEther(stSPKAmount);
      const pairedWei = ethers.parseEther(pairedAmount);

      addLiquidity({
        args: [stSPKWei, pairedWei, address],
      });
    } catch (error) {
      console.error('Failed to add liquidity:', error);
    }
  };

  const handleClaimRewards = async () => {
    if (!address) return;

    try {
      claimRewards({
        args: [address],
      });
    } catch (error) {
      console.error('Failed to claim rewards:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Connect Wallet</h2>
          <p className="text-gray-400">Connect your wallet to interact with SLU pools</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Staked Liquidity Units (SLU)</h1>
        <p className="text-gray-400">
          Earn triple yield: Staking Rewards + Swap Fees + Emissions
        </p>
      </div>

      {/* Pool Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            <span className="text-gray-400">Total Rewards</span>
          </div>
          <div className="text-2xl font-bold">
            {totalRewards ? (
              <>
                {(Number(totalRewards[0]) / 1e18).toFixed(4)} Staking
                <br />
                {(Number(totalRewards[1]) / 1e18).toFixed(4)} Fees
                <br />
                {(Number(totalRewards[2]) / 1e18).toFixed(4)} Emissions
              </>
            ) : (
              'Loading...'
            )}
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center mb-2">
            <Coins className="w-5 h-5 mr-2 text-blue-400" />
            <span className="text-gray-400">Your Position</span>
          </div>
          <div className="text-2xl font-bold">
            {sluInfo ? (
              <>
                {(Number(sluInfo.stSPKAmount) / 1e18).toFixed(4)} stSPK
                <br />
                {(Number(sluInfo.pairedAmount) / 1e18).toFixed(4)} {pairedTokenSymbol}
              </>
            ) : (
              'No position'
            )}
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center mb-2">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            <span className="text-gray-400">Your Rewards</span>
          </div>
          <div className="text-2xl font-bold">
            {sluInfo ? (
              <>
                {(Number(sluInfo.stakingRewards) / 1e18).toFixed(4)} Staking
                <br />
                {(Number(sluInfo.swapFees) / 1e18).toFixed(4)} Fees
                <br />
                {(Number(sluInfo.emissions) / 1e18).toFixed(4)} Emissions
              </>
            ) : (
              '0'
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setAction('add')}
            className={`px-4 py-2 rounded ${
              action === 'add'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            Add Liquidity
          </button>
          <button
            onClick={() => setAction('remove')}
            className={`px-4 py-2 rounded ${
              action === 'remove'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            Remove Liquidity
          </button>
          <button
            onClick={() => setAction('claim')}
            className={`px-4 py-2 rounded ${
              action === 'claim'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            Claim Rewards
          </button>
        </div>

        {action === 'add' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                stSPK Amount
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={stSPKAmount}
                  onChange={(e) => setStSPKAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-gray-800 rounded px-4 py-2"
                />
                <button
                  onClick={() => {
                    if (stSPKBalance) {
                      setStSPKAmount(ethers.formatEther(stSPKBalance.value));
                    }
                  }}
                  className="px-4 py-2 bg-gray-800 rounded"
                >
                  Max
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Balance: {stSPKBalance ? ethers.formatEther(stSPKBalance.value) : '0'} stSPK
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {pairedTokenSymbol} Amount
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pairedAmount}
                  onChange={(e) => setPairedAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-gray-800 rounded px-4 py-2"
                />
                <button
                  onClick={() => {
                    if (pairedBalance) {
                      setPairedAmount(ethers.formatEther(pairedBalance.value));
                    }
                  }}
                  className="px-4 py-2 bg-gray-800 rounded"
                >
                  Max
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Balance: {pairedBalance ? ethers.formatEther(pairedBalance.value) : '0'} {pairedTokenSymbol}
              </p>
            </div>

            <button
              onClick={handleAddLiquidity}
              disabled={addingLiquidity || !stSPKAmount || !pairedAmount}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded"
            >
              {addingLiquidity ? 'Adding Liquidity...' : 'Add Liquidity'}
            </button>
          </div>
        )}

        {action === 'claim' && (
          <div>
            <button
              onClick={handleClaimRewards}
              disabled={claimingRewards || !sluInfo || (
                Number(sluInfo.stakingRewards) === 0 &&
                Number(sluInfo.swapFees) === 0 &&
                Number(sluInfo.emissions) === 0
              )}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded"
            >
              {claimingRewards ? 'Claiming...' : 'Claim All Rewards'}
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="w-5 h-5 mr-2 text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-bold mb-1">Triple Yield System</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Staking Rewards: stSPK continues earning while in pool</li>
              <li>• Swap Fees: Earn 0.3% on every trade</li>
              <li>• Emissions: Gauge staking rewards (AERO/other tokens)</li>
              <li>• Auto-Compounding: Rewards automatically reinvested</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

