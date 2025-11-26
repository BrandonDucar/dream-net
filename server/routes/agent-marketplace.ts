/**
 * Agent Marketplace API Routes
 * 
 * X402-powered marketplace where DreamNet agents can buy/sell services.
 */

import { Router } from "express";
import { agentMarketplace } from "../core/agents/AgentMarketplace";
import type { MarketplaceService } from "../core/agents/AgentMarketplace";

const router = Router();

// ============================================================================
// Service Listings
// ============================================================================

/**
 * POST /api/marketplace/services
 * List a service on the marketplace
 */
router.post("/services", async (req, res) => {
  try {
    const service: Omit<MarketplaceService, "serviceId" | "createdAt" | "updatedAt" | "purchaseCount" | "reviewCount"> = {
      agentId: req.body.agentId,
      agentName: req.body.agentName,
      serviceName: req.body.serviceName,
      description: req.body.description,
      category: req.body.category || "general",
      price: req.body.price,
      chain: req.body.chain || "base",
      active: req.body.active !== false,
      metadata: req.body.metadata,
    };

    if (!service.agentId || !service.serviceName || !service.price) {
      return res.status(400).json({
        success: false,
        error: "agentId, serviceName, and price are required",
      });
    }

    const listedService = await agentMarketplace.listService(service);

    res.status(201).json({
      success: true,
      service: listedService,
    });
  } catch (error: any) {
    console.error("[Marketplace] Service listing error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Service listing failed",
    });
  }
});

/**
 * GET /api/marketplace/services
 * List all services (with optional filters)
 */
router.get("/services", async (req, res) => {
  try {
    const options = {
      agentId: req.query.agentId as string | undefined,
      category: req.query.category as string | undefined,
      active: req.query.active === "true" ? true : req.query.active === "false" ? false : undefined,
      minPrice: req.query.minPrice as string | undefined,
      maxPrice: req.query.maxPrice as string | undefined,
      chain: req.query.chain as string | undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const services = agentMarketplace.listServices(options);

    res.status(200).json({
      success: true,
      services,
      count: services.length,
    });
  } catch (error: any) {
    console.error("[Marketplace] Service listing query error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Service listing query failed",
    });
  }
});

/**
 * GET /api/marketplace/services/:serviceId
 * Get a specific service
 */
router.get("/services/:serviceId", async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = agentMarketplace.getService(serviceId);

    if (service) {
      // Get reviews for this service
      const reviews = agentMarketplace.getServiceReviews(serviceId);

      res.status(200).json({
        success: true,
        service,
        reviews,
        reviewCount: reviews.length,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }
  } catch (error: any) {
    console.error("[Marketplace] Service query error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Service query failed",
    });
  }
});

// ============================================================================
// Service Purchases
// ============================================================================

/**
 * POST /api/marketplace/purchase
 * Purchase a service
 */
router.post("/purchase", async (req, res) => {
  try {
    const { serviceId, buyerAgentId, metadata } = req.body;

    if (!serviceId || !buyerAgentId) {
      return res.status(400).json({
        success: false,
        error: "serviceId and buyerAgentId are required",
      });
    }

    const purchase = await agentMarketplace.purchaseService(serviceId, buyerAgentId, metadata);

    if (purchase.status === "completed") {
      res.status(200).json({
        success: true,
        purchase,
      });
    } else if (purchase.status === "failed") {
      res.status(400).json({
        success: false,
        error: purchase.error,
        purchase,
      });
    } else {
      res.status(202).json({
        success: true,
        purchase,
        message: "Purchase processing",
      });
    }
  } catch (error: any) {
    console.error("[Marketplace] Purchase error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Purchase failed",
    });
  }
});

/**
 * GET /api/marketplace/purchases/:purchaseId
 * Get a specific purchase
 */
router.get("/purchases/:purchaseId", async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const purchase = agentMarketplace.getPurchase(purchaseId);

    if (purchase) {
      res.status(200).json({
        success: true,
        purchase,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Purchase not found",
      });
    }
  } catch (error: any) {
    console.error("[Marketplace] Purchase query error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Purchase query failed",
    });
  }
});

/**
 * GET /api/marketplace/purchases
 * Get purchase history for an agent
 */
router.get("/purchases", async (req, res) => {
  try {
    const agentId = req.query.agentId as string;
    const asBuyer = req.query.asBuyer !== "false";
    const asSeller = req.query.asSeller === "true";
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: "agentId is required",
      });
    }

    const purchases = agentMarketplace.getPurchaseHistory(agentId, {
      asBuyer,
      asSeller,
      limit,
    });

    res.status(200).json({
      success: true,
      purchases,
      count: purchases.length,
    });
  } catch (error: any) {
    console.error("[Marketplace] Purchase history query error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Purchase history query failed",
    });
  }
});

// ============================================================================
// Reviews
// ============================================================================

/**
 * POST /api/marketplace/reviews
 * Add a review for a service
 */
router.post("/reviews", async (req, res) => {
  try {
    const { purchaseId, rating, comment } = req.body;

    if (!purchaseId || !rating) {
      return res.status(400).json({
        success: false,
        error: "purchaseId and rating are required",
      });
    }

    const review = await agentMarketplace.addReview(purchaseId, rating, comment);

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error: any) {
    console.error("[Marketplace] Review error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Review failed",
    });
  }
});

/**
 * GET /api/marketplace/services/:serviceId/reviews
 * Get reviews for a service
 */
router.get("/services/:serviceId/reviews", async (req, res) => {
  try {
    const { serviceId } = req.params;
    const reviews = agentMarketplace.getServiceReviews(serviceId);

    res.status(200).json({
      success: true,
      reviews,
      count: reviews.length,
    });
  } catch (error: any) {
    console.error("[Marketplace] Reviews query error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Reviews query failed",
    });
  }
});

// ============================================================================
// Statistics
// ============================================================================

/**
 * GET /api/marketplace/stats
 * Get marketplace statistics
 */
router.get("/stats", async (_req, res) => {
  try {
    const stats = agentMarketplace.getStats();

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error("[Marketplace] Stats query error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Stats query failed",
    });
  }
});

export { router as createAgentMarketplaceRouter };

