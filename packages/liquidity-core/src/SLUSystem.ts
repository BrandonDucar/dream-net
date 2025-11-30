/**
 * SLU System - Client for Staked Liquidity Units pools
 * 
 * Manages interactions with SLU pools where stSPK acts as base asset
 */

import { ethers } from 'ethers';
import type { SLUPool as SLUPoolContract } from '../../base-mini-apps/contracts/SLUPool.sol';

export interface SLUPoolConfig {
  poolAddress: string;
  stSPKAddress: string;
  pairedTokenAddress: string;
  pairedTokenSymbol: string;
  name: string;
  symbol: string;
}

export interface SLUInfo {
  pool: string;
  stSPKAmount: bigint;
  pairedAmount: bigint;
  stakingRewards: bigint;
  swapFees: bigint;
  emissions: bigint;
}

export interface SLURewards {
  totalStakingRewards: bigint;
  totalSwapFees: bigint;
  totalEmissions: bigint;
}

/**
 * SLU System Client
 */
export class SLUSystem {
  private provider: ethers.Provider;
  private signer?: ethers.Signer;
  private pools: Map<string, ethers.Contract> = new Map();

  constructor(provider: ethers.Provider, signer?: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  /**
   * Register a SLU pool
   */
  registerPool(config: SLUPoolConfig): void {
    // Pool contract ABI would be imported/generated from Solidity
    const poolContract = new ethers.Contract(
      config.poolAddress,
      [
        'function addLiquidity(uint256 stSPKAmount, uint256 pairedAmount, address to) returns (uint256)',
        'function removeLiquidity(uint256 liquidity, address to) returns (uint256, uint256)',
        'function swap(uint256 amountIn, address tokenIn, address tokenOut, address to) returns (uint256)',
        'function getSLUInfo(address user) view returns (tuple(address pool, uint256 stSPKAmount, uint256 pairedAmount, uint256 stakingRewards, uint256 swapFees, uint256 emissions))',
        'function getTotalRewards() view returns (uint256, uint256, uint256)',
        'function claimRewards(address to) returns (uint256, uint256, uint256)',
        'function autoCompound()',
      ],
      this.signer || this.provider
    );

    this.pools.set(config.poolAddress, poolContract);
  }

  /**
   * Add liquidity to a SLU pool
   */
  async addLiquidity(
    poolAddress: string,
    stSPKAmount: bigint,
    pairedAmount: bigint,
    to?: string
  ): Promise<{ txHash: string; liquidity: bigint }> {
    if (!this.signer) {
      throw new Error('Signer required for adding liquidity');
    }

    const pool = this.pools.get(poolAddress);
    if (!pool) {
      throw new Error(`Pool not registered: ${poolAddress}`);
    }

    const toAddress = to || await this.signer.getAddress();
    const tx = await pool.addLiquidity(stSPKAmount, pairedAmount, toAddress);
    const receipt = await tx.wait();

    // Get minted liquidity amount from events
    const liquidity = BigInt(0); // Would parse from events

    return {
      txHash: receipt.hash,
      liquidity,
    };
  }

  /**
   * Remove liquidity from a SLU pool
   */
  async removeLiquidity(
    poolAddress: string,
    liquidity: bigint,
    to?: string
  ): Promise<{ txHash: string; stSPKAmount: bigint; pairedAmount: bigint }> {
    if (!this.signer) {
      throw new Error('Signer required for removing liquidity');
    }

    const pool = this.pools.get(poolAddress);
    if (!pool) {
      throw new Error(`Pool not registered: ${poolAddress}`);
    }

    const toAddress = to || await this.signer.getAddress();
    const tx = await pool.removeLiquidity(liquidity, toAddress);
    const receipt = await tx.wait();

    // Parse return values from events
    const stSPKAmount = BigInt(0);
    const pairedAmount = BigInt(0);

    return {
      txHash: receipt.hash,
      stSPKAmount,
      pairedAmount,
    };
  }

  /**
   * Swap tokens in a SLU pool
   */
  async swap(
    poolAddress: string,
    amountIn: bigint,
    tokenIn: string,
    tokenOut: string,
    to?: string
  ): Promise<{ txHash: string; amountOut: bigint }> {
    if (!this.signer) {
      throw new Error('Signer required for swapping');
    }

    const pool = this.pools.get(poolAddress);
    if (!pool) {
      throw new Error(`Pool not registered: ${poolAddress}`);
    }

    const toAddress = to || await this.signer.getAddress();
    const tx = await pool.swap(amountIn, tokenIn, tokenOut, toAddress);
    const receipt = await tx.wait();

    const amountOut = BigInt(0); // Would parse from events

    return {
      txHash: receipt.hash,
      amountOut,
    };
  }

  /**
   * Get SLU info for a user
   */
  async getSLUInfo(poolAddress: string, userAddress: string): Promise<SLUInfo> {
    const pool = this.pools.get(poolAddress);
    if (!pool) {
      throw new Error(`Pool not registered: ${poolAddress}`);
    }

    const info = await pool.getSLUInfo(userAddress);
    return {
      pool: info.pool,
      stSPKAmount: BigInt(info.stSPKAmount.toString()),
      pairedAmount: BigInt(info.pairedAmount.toString()),
      stakingRewards: BigInt(info.stakingRewards.toString()),
      swapFees: BigInt(info.swapFees.toString()),
      emissions: BigInt(info.emissions.toString()),
    };
  }

  /**
   * Get total rewards for a pool
   */
  async getTotalRewards(poolAddress: string): Promise<SLURewards> {
    const pool = this.pools.get(poolAddress);
    if (!pool) {
      throw new Error(`Pool not registered: ${poolAddress}`);
    }

    const [stakingRewards, swapFees, emissions] = await pool.getTotalRewards();
    return {
      totalStakingRewards: BigInt(stakingRewards.toString()),
      totalSwapFees: BigInt(swapFees.toString()),
      totalEmissions: BigInt(emissions.toString()),
    };
  }

  /**
   * Claim rewards from a SLU pool
   */
  async claimRewards(
    poolAddress: string,
    to?: string
  ): Promise<{ txHash: string; stakingRewards: bigint; swapFees: bigint; emissions: bigint }> {
    if (!this.signer) {
      throw new Error('Signer required for claiming rewards');
    }

    const pool = this.pools.get(poolAddress);
    if (!pool) {
      throw new Error(`Pool not registered: ${poolAddress}`);
    }

    const toAddress = to || await this.signer.getAddress();
    const tx = await pool.claimRewards(toAddress);
    const receipt = await tx.wait();

    // Parse return values
    const stakingRewards = BigInt(0);
    const swapFees = BigInt(0);
    const emissions = BigInt(0);

    return {
      txHash: receipt.hash,
      stakingRewards,
      swapFees,
      emissions,
    };
  }

  /**
   * Trigger auto-compounding
   */
  async autoCompound(poolAddress: string): Promise<{ txHash: string }> {
    if (!this.signer) {
      throw new Error('Signer required for auto-compounding');
    }

    const pool = this.pools.get(poolAddress);
    if (!pool) {
      throw new Error(`Pool not registered: ${poolAddress}`);
    }

    const tx = await pool.autoCompound();
    const receipt = await tx.wait();

    return {
      txHash: receipt.hash,
    };
  }
}

