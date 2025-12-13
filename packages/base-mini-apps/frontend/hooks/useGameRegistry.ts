/**
 * React Hook for GameRegistry Contract
 * Handles score submission, leaderboards, and achievements
 */

import { useContractWrite, useContractRead, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../config';

// GameRegistry ABI (simplified - full ABI would be generated from contract)
const GAME_REGISTRY_ABI = [
  {
    name: 'submitScore',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'gameType', type: 'uint8' },
      { name: 'score', type: 'uint256' },
      { name: 'metadata', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'getBestScore',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'gameType', type: 'uint8' },
      { name: 'player', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'getTopPlayers',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'gameType', type: 'uint8' },
      { name: 'count', type: 'uint256' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'player', type: 'address' },
          { name: 'score', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'rank', type: 'uint256' },
        ],
      },
    ],
  },
  {
    name: 'getPlayerRank',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'gameType', type: 'uint8' },
      { name: 'player', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'getPlayerAchievements',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'gameType', type: 'uint8' },
      { name: 'player', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256[]' }],
  },
] as const;

export enum GameType {
  JaggyStealthRun = 0,
  DreamDNASequencerGame = 1,
  DreamLatticeGame = 2,
  WormholeEscape = 3,
  DreamBetArcade = 4,
  OctopusPatternMaster = 5,
  LabubuPopSmash = 6,
  ReactionTestMini = 7,
  DreamSnailDrift = 8,
  DreamCloudBuilder = 9,
  DreamNebulaExplorer = 10,
}

export function useGameRegistry() {
  const { address } = useAccount();

  const submitScore = useContractWrite({
    address: CONTRACT_ADDRESSES.GameRegistry as `0x${string}`,
    abi: GAME_REGISTRY_ABI,
    functionName: 'submitScore',
  });

  const getBestScore = (gameType: GameType) => {
    return useContractRead({
      address: CONTRACT_ADDRESSES.GameRegistry as `0x${string}`,
      abi: GAME_REGISTRY_ABI,
      functionName: 'getBestScore',
      args: [gameType, address as `0x${string}`],
      enabled: !!address,
    });
  };

  const getTopPlayers = (gameType: GameType, count: number = 10) => {
    return useContractRead({
      address: CONTRACT_ADDRESSES.GameRegistry as `0x${string}`,
      abi: GAME_REGISTRY_ABI,
      functionName: 'getTopPlayers',
      args: [gameType, BigInt(count)],
    });
  };

  const getPlayerRank = (gameType: GameType) => {
    return useContractRead({
      address: CONTRACT_ADDRESSES.GameRegistry as `0x${string}`,
      abi: GAME_REGISTRY_ABI,
      functionName: 'getPlayerRank',
      args: [gameType, address as `0x${string}`],
      enabled: !!address,
    });
  };

  const getPlayerAchievements = (gameType: GameType) => {
    return useContractRead({
      address: CONTRACT_ADDRESSES.GameRegistry as `0x${string}`,
      abi: GAME_REGISTRY_ABI,
      functionName: 'getPlayerAchievements',
      args: [gameType, address as `0x${string}`],
      enabled: !!address,
    });
  };

  return {
    submitScore,
    getBestScore,
    getTopPlayers,
    getPlayerRank,
    getPlayerAchievements,
  };
}

