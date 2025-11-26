/**
 * Agent Marketplace Agent
 * 
 * X402-powered marketplace where DreamNet agents can buy/sell services from each other.
 * 
 * Features:
 * - Agents list services with X402 pricing
 * - Other agents browse and purchase services
 * - Automatic payment via X402 protocol
 * - Service discovery and rating system
 * - Escrow for complex multi-step services
 */

import { x402PaymentGateway } from "./X402PaymentGateway";
import { broadcastStarbridgeEvent } from "../../starbridge/bus";
import { StarbridgeTopic, StarbridgeSource } from "../../starbridge/types";
import { gptAgentRegistry } from "../gpt-agents/GPTAgentRegistry";

// ============================================================================
// Types
// ============================================================================

export interface MarketplaceService {
  serviceId: string;
  agentId: string;
  agentName: string;
  serviceName: string;
  description: string;
  category: string; // e.g., "deployment", "analysis", "research", "automation"
  price: string; // X402 amount
  chain: "base" | "solana" | "polygon" | "ethereum" | "bsc";
  active: boolean;
  rating?: number; // 0-5 stars
  reviewCount?: number;
  purchaseCount?: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    estimatedDuration?: string; // e.g., "5 minutes", "1 hour"
    requirements?: string[]; // e.g., ["API key", "wallet address"]
    tags?: string[];
    [key: string]: unknown;
  };
}

export interface ServicePurchase {
  purchaseId: string;
  serviceId: string;
  buyerAgentId: string;
  sellerAgentId: string;
  price: string;
  chain: string;
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  paymentId?: string;
  transactionHash?: string;
  purchasedAt: Date;
  completedAt?: Date;
  result?: Record<string, unknown>; // Service execution result
  error?: string;
}

export interface ServiceReview {
  reviewId: string;
  purchaseId: string;
  serviceId: string;
  buyerAgentId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
}

// ============================================================================
// Agent Marketplace Agent
// ============================================================================

export class AgentMarketplace {
  private services: Map<string, MarketplaceService> = new Map();
  private purchases: Map<string, ServicePurchase> = new Map();
  private reviews: Map<string, ServiceReview> = new Map();

  /**
   * List a service on the marketplace
   */
  async listService(service: Omit<MarketplaceService, "serviceId" | "createdAt" | "updatedAt" | "purchaseCount" | "reviewCount">): Promise<MarketplaceService> {
    const serviceId = `service_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Get agent name from registry if available
    let agentName = service.agentName;
    if (!agentName) {
      const registeredAgent = gptAgentRegistry.getRegisteredGPTAgent(service.agentId);
      agentName = registeredAgent?.gpt?.name || service.agentId;
    }

    const marketplaceService: MarketplaceService = {
      ...service,
      serviceId,
      agentName,
      purchaseCount: 0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.services.set(serviceId, marketplaceService);

    // Also register with X402 Payment Gateway
    await x402PaymentGateway.listService({
      serviceId,
      agentId: service.agentId,
      serviceName: service.serviceName,
      description: service.description,
      price: service.price,
      chain: service.chain,
      active: service.active,
    });

    // Broadcast service listing event
    await broadcastStarbridgeEvent(
      {
        topic: StarbridgeTopic.Economy,
        source: StarbridgeSource.AgentMarketplace,
        type: "marketplace.service.listed",
      },
      {
        serviceId,
        agentId: service.agentId,
        serviceName: service.serviceName,
        price: service.price,
        category: service.category,
      }
    );

    console.log(`[Marketplace] Service listed: ${service.serviceName} by ${agentName} (${service.price} X402)`);

    return marketplaceService;
  }

  /**
   * Purchase a service
   */
  async purchaseService(
    serviceId: string,
    buyerAgentId: string,
    metadata?: Record<string, unknown>
  ): Promise<ServicePurchase> {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    if (!service.active) {
      throw new Error(`Service ${serviceId} is not active`);
    }

    const purchaseId = `purchase_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create purchase record
    const purchase: ServicePurchase = {
      purchaseId,
      serviceId,
      buyerAgentId,
      sellerAgentId: service.agentId,
      price: service.price,
      chain: service.chain,
      status: "pending",
      purchasedAt: new Date(),
    };

    this.purchases.set(purchaseId, purchase);

    try {
      // Process X402 payment
      const paymentResult = await x402PaymentGateway.processPayment({
        fromAgentId: buyerAgentId,
        toAgentId: service.agentId,
        amount: service.price,
        chain: service.chain,
        serviceId,
        metadata: {
          ...metadata,
          purchaseId,
        },
      });

      if (paymentResult.success) {
        purchase.status = "processing";
        purchase.paymentId = paymentResult.paymentId;
        purchase.transactionHash = paymentResult.transactionHash;

        // Update service purchase count
        service.purchaseCount = (service.purchaseCount || 0) + 1;
        service.updatedAt = new Date();
        this.services.set(serviceId, service);

        // Execute service (this would call the actual agent service)
        // For now, we'll mark it as completed
        // In production, this would trigger the actual service execution
        purchase.status = "completed";
        purchase.completedAt = new Date();
        purchase.result = {
          message: "Service purchased successfully",
          paymentId: paymentResult.paymentId,
        };

        // Broadcast purchase event
        await broadcastStarbridgeEvent(
          {
            topic: StarbridgeTopic.Economy,
            source: StarbridgeSource.AgentMarketplace,
            type: "marketplace.service.purchased",
          },
          {
            purchaseId,
            serviceId,
            buyerAgentId,
            sellerAgentId: service.agentId,
            price: service.price,
          }
        );

        console.log(`[Marketplace] Service purchased: ${service.serviceName} by ${buyerAgentId} (${service.price} X402)`);
      } else {
        purchase.status = "failed";
        purchase.error = paymentResult.error || "Payment failed";
        throw new Error(`Payment failed: ${purchase.error}`);
      }
    } catch (error: any) {
      purchase.status = "failed";
      purchase.error = error.message;
      console.error(`[Marketplace] Purchase failed: ${error.message}`);
    }

    this.purchases.set(purchaseId, purchase);
    return purchase;
  }

  /**
   * Get a service by ID
   */
  getService(serviceId: string): MarketplaceService | undefined {
    return this.services.get(serviceId);
  }

  /**
   * List all services (with optional filters)
   */
  listServices(options?: {
    agentId?: string;
    category?: string;
    active?: boolean;
    minPrice?: string;
    maxPrice?: string;
    chain?: string;
    limit?: number;
    offset?: number;
  }): MarketplaceService[] {
    let services = Array.from(this.services.values());

    // Apply filters
    if (options?.agentId) {
      services = services.filter(s => s.agentId === options.agentId);
    }
    if (options?.category) {
      services = services.filter(s => s.category === options.category);
    }
    if (options?.active !== undefined) {
      services = services.filter(s => s.active === options.active);
    }
    if (options?.chain) {
      services = services.filter(s => s.chain === options.chain);
    }
    if (options?.minPrice) {
      services = services.filter(s => BigInt(s.price) >= BigInt(options.minPrice!));
    }
    if (options?.maxPrice) {
      services = services.filter(s => BigInt(s.price) <= BigInt(options.maxPrice!));
    }

    // Sort by purchase count (popularity) or rating
    services.sort((a, b) => {
      const aScore = (a.purchaseCount || 0) * 10 + (a.rating || 0) * 2;
      const bScore = (b.purchaseCount || 0) * 10 + (b.rating || 0) * 2;
      return bScore - aScore;
    });

    // Apply pagination
    const offset = options?.offset || 0;
    const limit = options?.limit || 50;
    return services.slice(offset, offset + limit);
  }

  /**
   * Get purchase by ID
   */
  getPurchase(purchaseId: string): ServicePurchase | undefined {
    return this.purchases.get(purchaseId);
  }

  /**
   * Get purchase history for an agent
   */
  getPurchaseHistory(agentId: string, options?: {
    asBuyer?: boolean;
    asSeller?: boolean;
    limit?: number;
  }): ServicePurchase[] {
    let purchases = Array.from(this.purchases.values());

    if (options?.asBuyer !== false && options?.asSeller !== true) {
      purchases = purchases.filter(p => p.buyerAgentId === agentId);
    } else if (options?.asSeller) {
      purchases = purchases.filter(p => p.sellerAgentId === agentId);
    }

    purchases.sort((a, b) => b.purchasedAt.getTime() - a.purchasedAt.getTime());

    const limit = options?.limit || 50;
    return purchases.slice(0, limit);
  }

  /**
   * Add a review for a service
   */
  async addReview(
    purchaseId: string,
    rating: number,
    comment?: string
  ): Promise<ServiceReview> {
    const purchase = this.purchases.get(purchaseId);
    if (!purchase) {
      throw new Error(`Purchase ${purchaseId} not found`);
    }

    if (purchase.status !== "completed") {
      throw new Error(`Cannot review purchase ${purchaseId} - not completed`);
    }

    const reviewId = `review_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const review: ServiceReview = {
      reviewId,
      purchaseId,
      serviceId: purchase.serviceId,
      buyerAgentId: purchase.buyerAgentId,
      rating: Math.max(1, Math.min(5, rating)), // Clamp to 1-5
      comment,
      createdAt: new Date(),
    };

    this.reviews.set(reviewId, review);

    // Update service rating
    const service = this.services.get(purchase.serviceId);
    if (service) {
      const serviceReviews = Array.from(this.reviews.values())
        .filter(r => r.serviceId === purchase.serviceId);
      
      const avgRating = serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length;
      service.rating = avgRating;
      service.reviewCount = serviceReviews.length;
      service.updatedAt = new Date();
      this.services.set(purchase.serviceId, service);
    }

    // Broadcast review event
    await broadcastStarbridgeEvent(
      {
        topic: StarbridgeTopic.Economy,
        source: StarbridgeSource.AgentMarketplace,
        type: "marketplace.service.reviewed",
      },
      {
        reviewId,
        serviceId: purchase.serviceId,
        rating,
      }
    );

    return review;
  }

  /**
   * Get reviews for a service
   */
  getServiceReviews(serviceId: string): ServiceReview[] {
    return Array.from(this.reviews.values())
      .filter(r => r.serviceId === serviceId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get marketplace statistics
   */
  getStats(): {
    totalServices: number;
    activeServices: number;
    totalPurchases: number;
    totalRevenue: string; // Total X402 revenue
    topCategories: Array<{ category: string; count: number }>;
    topAgents: Array<{ agentId: string; agentName: string; serviceCount: number; revenue: string }>;
  } {
    const services = Array.from(this.services.values());
    const purchases = Array.from(this.purchases.values());
    const completedPurchases = purchases.filter(p => p.status === "completed");

    // Calculate revenue
    const totalRevenue = completedPurchases.reduce(
      (sum, p) => sum + BigInt(p.price),
      BigInt(0)
    ).toString();

    // Top categories
    const categoryCounts = new Map<string, number>();
    services.forEach(s => {
      categoryCounts.set(s.category, (categoryCounts.get(s.category) || 0) + 1);
    });
    const topCategories = Array.from(categoryCounts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top agents
    const agentStats = new Map<string, { agentName: string; serviceCount: number; revenue: bigint }>();
    services.forEach(s => {
      if (!agentStats.has(s.agentId)) {
        agentStats.set(s.agentId, { agentName: s.agentName, serviceCount: 0, revenue: BigInt(0) });
      }
      const stats = agentStats.get(s.agentId)!;
      stats.serviceCount++;
    });
    completedPurchases.forEach(p => {
      if (agentStats.has(p.sellerAgentId)) {
        const stats = agentStats.get(p.sellerAgentId)!;
        stats.revenue += BigInt(p.price);
      }
    });
    const topAgents = Array.from(agentStats.entries())
      .map(([agentId, stats]) => ({
        agentId,
        agentName: stats.agentName,
        serviceCount: stats.serviceCount,
        revenue: stats.revenue.toString(),
      }))
      .sort((a, b) => {
        const aRevenue = BigInt(a.revenue);
        const bRevenue = BigInt(b.revenue);
        return aRevenue > bRevenue ? -1 : aRevenue < bRevenue ? 1 : 0;
      })
      .slice(0, 10);

    return {
      totalServices: services.length,
      activeServices: services.filter(s => s.active).length,
      totalPurchases: purchases.length,
      totalRevenue,
      topCategories,
      topAgents,
    };
  }
}

// Singleton instance
export const agentMarketplace = new AgentMarketplace();

