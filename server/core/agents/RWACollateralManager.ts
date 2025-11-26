/**
 * RWA Collateral Manager for X402
 * 
 * Manages tokenized real-world assets (RWAs) as collateral for X402 payments.
 * Supports yield-bearing tokens like BUIDL, YLDS, and other tokenized assets.
 */

import { JsonRpcProvider, Contract } from "ethers";
import { broadcastStarbridgeEvent } from "../../starbridge/bus";
import { StarbridgeTopic, StarbridgeSource } from "../../starbridge/types";

// ============================================================================
// Types
// ============================================================================

export interface RWACollateral {
  id: string;
  type: 'tokenized-fund' | 'yield-bearing-token' | 'rwa-nft';
  tokenAddress: string;
  chain: string;
  amount: string;
  value: string; // USD value
  yieldRate?: string; // APY if yield-bearing
  lastValuation: Date;
  collateralRatio: number; // 0-1, how much can be used as collateral
}

export interface CollateralPosting {
  collateralId: string;
  agentId: string;
  amount: string;
  postedFor: string; // Payment ID or service ID
  status: 'pending' | 'posted' | 'released' | 'liquidated';
  timestamp: Date;
}

// ERC20 ABI for balance checking
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

// ============================================================================
// RWA Collateral Manager
// ============================================================================

export class RWACollateralManager {
  private collaterals: Map<string, RWACollateral> = new Map();
  private postings: Map<string, CollateralPosting> = new Map();
  private rpcUrls: Record<string, string> = {
    base: process.env.BASE_MAINNET_RPC_URL || "https://mainnet.base.org",
    ethereum: process.env.ETHEREUM_RPC_URL || "https://eth.llamarpc.com",
    polygon: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
  };

  /**
   * Register a tokenized asset as eligible collateral
   */
  registerCollateral(collateral: RWACollateral): void {
    this.collaterals.set(collateral.id, collateral);
    console.log(`[RWACollateral] Registered ${collateral.type}: ${collateral.id}`);
  }

  /**
   * Get collateral value in USD
   */
  async getCollateralValue(collateralId: string, amount: string): Promise<string> {
    const collateral = this.collaterals.get(collateralId);
    if (!collateral) {
      throw new Error(`Collateral ${collateralId} not found`);
    }

    // TODO: Integrate with oracle for real-time valuation
    // For now, use stored value
    const valuePerUnit = parseFloat(collateral.value) / parseFloat(collateral.amount);
    return (parseFloat(amount) * valuePerUnit).toString();
  }

  /**
   * Post collateral for a payment
   */
  async postCollateral(
    collateralId: string,
    agentId: string,
    amount: string,
    postedFor: string
  ): Promise<CollateralPosting> {
    const collateral = this.collaterals.get(collateralId);
    if (!collateral) {
      throw new Error(`Collateral ${collateralId} not found`);
    }

    // Verify agent has enough collateral
    const balance = await this.getCollateralBalance(collateralId, agentId);
    if (parseFloat(balance) < parseFloat(amount)) {
      throw new Error(`Insufficient collateral: have ${balance}, need ${amount}`);
    }

    const posting: CollateralPosting = {
      collateralId,
      agentId,
      amount,
      postedFor,
      status: 'posted',
      timestamp: new Date(),
    };

    const postingId = `posting_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.postings.set(postingId, posting);

    // Broadcast event
    await broadcastStarbridgeEvent(
      {
        topic: StarbridgeTopic.Economy,
        source: StarbridgeSource.External,
        type: "rwa.collateral.posted",
        payload: {
          postingId,
          collateralId,
          agentId,
          amount,
          postedFor,
        },
      }
    );

    return posting;
  }

  /**
   * Release collateral after payment is complete
   */
  async releaseCollateral(postingId: string): Promise<void> {
    const posting = this.postings.get(postingId);
    if (!posting) {
      throw new Error(`Posting ${postingId} not found`);
    }

    posting.status = 'released';

    await broadcastStarbridgeEvent(
      {
        topic: StarbridgeTopic.Economy,
        source: StarbridgeSource.External,
        type: "rwa.collateral.released",
        payload: {
          postingId,
          collateralId: posting.collateralId,
          agentId: posting.agentId,
        },
      }
    );
  }

  /**
   * Get collateral balance for an agent
   */
  async getCollateralBalance(collateralId: string, agentAddress: string): Promise<string> {
    const collateral = this.collaterals.get(collateralId);
    if (!collateral) {
      throw new Error(`Collateral ${collateralId} not found`);
    }

    try {
      const provider = new JsonRpcProvider(this.rpcUrls[collateral.chain]);
      const contract = new Contract(collateral.tokenAddress, ERC20_ABI, provider);
      const balance = await contract.balanceOf(agentAddress);
      const decimals = await contract.decimals();
      return (BigInt(balance.toString()) / BigInt(10 ** Number(decimals))).toString();
    } catch (error) {
      console.error(`[RWACollateral] Error getting balance:`, error);
      return '0';
    }
  }

  /**
   * Get all eligible collaterals
   */
  getEligibleCollaterals(): RWACollateral[] {
    return Array.from(this.collaterals.values());
  }

  /**
   * Get postings for an agent
   */
  getAgentPostings(agentId: string): CollateralPosting[] {
    return Array.from(this.postings.values()).filter(p => p.agentId === agentId);
  }
}

export default RWACollateralManager;

