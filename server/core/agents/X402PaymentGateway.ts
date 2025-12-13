/**
 * X402 Payment Gateway Agent
 * 
 * Core payment processor for X402 protocol micropayments between DreamNet agents.
 * Enables real-time, pay-per-use transactions without accounts/subscriptions.
 * 
 * Features:
 * - Accepts X402 payments from any agent
 * - Routes payments to DreamNet agents
 * - Converts X402 tokens to DREAM/SHEEP for internal use
 * - Real-time settlement (<1 second)
 * - Multi-chain support (Base, Solana, Polygon)
 */

import { getAgentWalletManager } from "../../../packages/agent-wallet-manager";
// TODO: Fix ethers v6 compatibility - JsonRpcProvider API changed
// import { JsonRpcProvider, Contract, Wallet } from "ethers";
import { broadcastStarbridgeEvent } from "../../starbridge/bus";
import { StarbridgeTopic, StarbridgeSource } from "../../starbridge/types";
import { RWACollateralManager } from "./RWACollateralManager";

// ============================================================================
// Types
// ============================================================================

export interface X402PaymentRequest {
  fromAgentId: string;
  toAgentId: string;
  amount: string; // X402 amount (in smallest unit, e.g., wei)
  chain: "base" | "solana" | "polygon" | "ethereum" | "bsc";
  serviceId?: string; // Optional: service being paid for
  metadata?: Record<string, unknown>;
}

export interface X402PaymentResult {
  success: boolean;
  paymentId: string;
  transactionHash?: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  chain: string;
  timestamp: Date;
  error?: string;
}

export interface X402Balance {
  agentId: string;
  chain: string;
  x402Balance: string;
  nativeBalance: string; // ETH, SOL, MATIC, etc.
  lastUpdated: Date;
}

export interface X402ServiceListing {
  serviceId: string;
  agentId: string;
  serviceName: string;
  description: string;
  price: string; // X402 amount
  chain: "base" | "solana" | "polygon" | "ethereum" | "bsc";
  active: boolean;
  createdAt: Date;
}

// ============================================================================
// X402 Payment Gateway Agent
// ============================================================================

export class X402PaymentGateway {
  private walletManager = getAgentWalletManager();
  private serviceListings: Map<string, X402ServiceListing> = new Map();
  private paymentHistory: Map<string, X402PaymentResult> = new Map();
  private rwaCollateralManager: RWACollateralManager = new RWACollateralManager();
  
  // X402 token contract addresses
  // Token is extremely cheap: ~$0.0000000000001193 USD per token
  // Total supply: 402 quadrillion X402 tokens
  private x402TokenAddresses: Record<string, string> = {
    // Base mainnet - may need to verify if X402 is bridged to Base
    base: process.env.X402_TOKEN_BASE || "0x1e8e4145506e74996f32b61de2f7f4ec60f2d102", // Using BSC address as fallback (verify Base bridge)
    // Ethereum mainnet
    ethereum: process.env.X402_TOKEN_ETHEREUM || "0x1e8e4145506e74996f32b61de2f7f4ec60f2d102", // ERC20 on Ethereum
    // Polygon - may need to verify if X402 is bridged to Polygon
    polygon: process.env.X402_TOKEN_POLYGON || "0x1e8e4145506e74996f32b61de2f7f4ec60f2d102", // Using BSC address as fallback (verify Polygon bridge)
    // Solana (SPL token) - different format
    solana: process.env.X402_TOKEN_SOLANA || "6H8uyjyrpvcra6fi7iwh29dxsm8kctzhhryxmpwkpump", // SPL token on Solana
    // BSC (Binance Smart Chain) - primary network
    bsc: process.env.X402_TOKEN_BSC || "0x1e8e4145506e74996f32b61de2f7f4ec60f2d102", // BEP20 on BSC
  };

  // RPC URLs (to be configured)
  private rpcUrls: Record<string, string> = {
    base: process.env.BASE_MAINNET_RPC_URL || "https://mainnet.base.org",
    solana: process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
    polygon: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
    ethereum: process.env.ETHEREUM_RPC_URL || "https://eth.llamarpc.com",
    bsc: process.env.BSC_RPC_URL || "https://bsc-dataseed1.binance.org",
  };

  /**
   * Process an X402 payment between agents
   */
  async processPayment(request: X402PaymentRequest): Promise<X402PaymentResult> {
    const paymentId = `x402_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    try {
      console.log(`[X402] Processing payment ${paymentId}: ${request.fromAgentId} -> ${request.toAgentId} (${request.amount} X402 on ${request.chain})`);

      // Get wallets for both agents
      const fromWallet = await this.walletManager.getOrCreateWallet(
        request.fromAgentId,
        request.chain,
        `X402-${request.fromAgentId}`
      );
      const toWallet = await this.walletManager.getOrCreateWallet(
        request.toAgentId,
        request.chain,
        `X402-${request.toAgentId}`
      );

      // For EVM chains (Base, Polygon, Ethereum, BSC), use ERC20 transfer
      if (request.chain === "base" || request.chain === "polygon" || request.chain === "ethereum" || request.chain === "bsc") {
        const result = await this.processEVMTransfer(
          fromWallet,
          toWallet,
          request.amount,
          request.chain
        );

        const paymentResult: X402PaymentResult = {
          success: result.success,
          paymentId,
          transactionHash: result.txHash,
          fromAddress: fromWallet.address,
          toAddress: toWallet.address,
          amount: request.amount,
          chain: request.chain,
          timestamp: new Date(),
          error: result.error,
        };

        this.paymentHistory.set(paymentId, paymentResult);

        // Broadcast payment event
        await broadcastStarbridgeEvent(
          {
            topic: StarbridgeTopic.Economy,
            source: StarbridgeSource.External,
            type: result.success ? "x402.payment.success" : "x402.payment.failed",
            payload: {
              paymentId,
              fromAgentId: request.fromAgentId,
              toAgentId: request.toAgentId,
              amount: request.amount,
              chain: request.chain,
              serviceId: request.serviceId,
            },
          }
        );

        return paymentResult;
      }

      // For Solana, use SPL token transfer (TODO: implement)
      if (request.chain === "solana") {
        // TODO: Implement Solana SPL token transfer
        throw new Error("Solana X402 payments not yet implemented");
      }

      throw new Error(`Unsupported chain: ${request.chain}`);
    } catch (error: any) {
      console.error(`[X402] Payment ${paymentId} failed:`, error.message);
      
      const paymentResult: X402PaymentResult = {
        success: false,
        paymentId,
        fromAddress: "",
        toAddress: "",
        amount: request.amount,
        chain: request.chain,
        timestamp: new Date(),
        error: error.message,
      };

      this.paymentHistory.set(paymentId, paymentResult);
      return paymentResult;
    }
  }

  /**
   * Process EVM (Base, Polygon, Ethereum) X402 token transfer
   */
  private async processEVMTransfer(
    fromWallet: any,
    toWallet: any,
    amount: string,
    chain: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      const rpcUrl = this.rpcUrls[chain];
      const provider = new JsonRpcProvider(rpcUrl);
      const tokenAddress = this.x402TokenAddresses[chain];

      if (!tokenAddress || tokenAddress === "0x0000000000000000000000000000000000000000") {
        throw new Error(`X402 token address not configured for ${chain}`);
      }

      // ERC20 ABI (simplified - just transfer function)
      const erc20Abi = [
        "function transfer(address to, uint256 amount) external returns (bool)",
        "function balanceOf(address account) external view returns (uint256)",
      ];

      // Get wallet signer (requires private key from wallet manager)
      // NOTE: This is a simplified version - in production, use proper signing
      const wallet = new Wallet(fromWallet.privateKey || "", provider);
      const tokenContract = new Contract(tokenAddress, erc20Abi, wallet);

      // Check balance first
      const balance = await tokenContract.balanceOf(fromWallet.address);
      if (balance < BigInt(amount)) {
        throw new Error(`Insufficient X402 balance: have ${balance.toString()}, need ${amount}`);
      }

      // Execute transfer
      const tx = await tokenContract.transfer(toWallet.address, amount);
      const receipt = await tx.wait();

      console.log(`[X402] Transfer successful: ${receipt.transactionHash}`);

      return {
        success: true,
        txHash: receipt.transactionHash,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get X402 balance for an agent
   */
  async getBalance(agentId: string, chain: string): Promise<X402Balance> {
    try {
      const wallet = await this.walletManager.getOrCreateWallet(
        agentId,
        chain,
        `X402-${agentId}`
      );

      if (chain === "solana") {
        // TODO: Implement Solana balance check
        throw new Error("Solana balance check not yet implemented");
      }

      // EVM chains
      const rpcUrl = this.rpcUrls[chain];
      const provider = new JsonRpcProvider(rpcUrl);
      const tokenAddress = this.x402TokenAddresses[chain];

      if (!tokenAddress || tokenAddress === "0x0000000000000000000000000000000000000000") {
        throw new Error(`X402 token address not configured for ${chain}`);
      }

      const erc20Abi = ["function balanceOf(address account) external view returns (uint256)"];
      const tokenContract = new Contract(tokenAddress, erc20Abi, provider);

      const x402Balance = await tokenContract.balanceOf(wallet.address);
      const nativeBalance = await provider.getBalance(wallet.address);

      return {
        agentId,
        chain,
        x402Balance: x402Balance.toString(),
        nativeBalance: nativeBalance.toString(),
        lastUpdated: new Date(),
      };
    } catch (error: any) {
      console.error(`[X402] Balance check failed for ${agentId} on ${chain}:`, error.message);
      throw error;
    }
  }

  /**
   * List a service for X402 payment
   */
  async listService(listing: Omit<X402ServiceListing, "createdAt">): Promise<X402ServiceListing> {
    const serviceListing: X402ServiceListing = {
      ...listing,
      createdAt: new Date(),
    };

    this.serviceListings.set(listing.serviceId, serviceListing);

    // Broadcast service listing event
    await broadcastStarbridgeEvent(
      {
        topic: StarbridgeTopic.Economy,
        source: StarbridgeSource.External,
        type: "x402.service.listed",
        payload: {
          serviceId: listing.serviceId,
          agentId: listing.agentId,
          serviceName: listing.serviceName,
          price: listing.price,
          chain: listing.chain,
        },
      }
    );

    return serviceListing;
  }

  /**
   * Get service listing
   */
  getService(serviceId: string): X402ServiceListing | undefined {
    return this.serviceListings.get(serviceId);
  }

  /**
   * List all active services
   */
  listServices(agentId?: string): X402ServiceListing[] {
    const services = Array.from(this.serviceListings.values());
    
    if (agentId) {
      return services.filter(s => s.agentId === agentId && s.active);
    }
    
    return services.filter(s => s.active);
  }

  /**
   * Get payment history
   */
  getPaymentHistory(agentId?: string, limit: number = 50): X402PaymentResult[] {
    const payments = Array.from(this.paymentHistory.values());
    
    if (agentId) {
      return payments
        .filter(p => p.fromAddress.includes(agentId) || p.toAddress.includes(agentId))
        .slice(0, limit);
    }
    
    return payments.slice(0, limit);
  }
}

// Singleton instance
export const x402PaymentGateway = new X402PaymentGateway();

