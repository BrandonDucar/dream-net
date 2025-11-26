/**
 * X402 Payment Gateway API Routes
 * 
 * Enables X402 protocol micropayments between DreamNet agents.
 */

import { Router } from "express";
import { x402PaymentGateway } from "../core/agents/X402PaymentGateway";
import type { X402PaymentRequest, X402ServiceListing } from "../core/agents/X402PaymentGateway";

const router = Router();

// ============================================================================
// Payment Processing
// ============================================================================

/**
 * POST /api/x402/payment
 * Process an X402 payment between agents
 */
router.post("/payment", async (req, res) => {
  try {
    const paymentRequest: X402PaymentRequest = {
      fromAgentId: req.body.fromAgentId,
      toAgentId: req.body.toAgentId,
      amount: req.body.amount,
      chain: req.body.chain || "base",
      serviceId: req.body.serviceId,
      metadata: req.body.metadata,
    };

    if (!paymentRequest.fromAgentId || !paymentRequest.toAgentId || !paymentRequest.amount) {
      return res.status(400).json({
        success: false,
        error: "fromAgentId, toAgentId, and amount are required",
      });
    }

    const result = await x402PaymentGateway.processPayment(paymentRequest);

    if (result.success) {
      res.status(200).json({
        success: true,
        payment: result,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        payment: result,
      });
    }
  } catch (error: any) {
    console.error("[X402] Payment processing error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Payment processing failed",
    });
  }
});

// ============================================================================
// Balance Queries
// ============================================================================

/**
 * GET /api/x402/balance/:agentId/:chain
 * Get X402 balance for an agent
 */
router.get("/balance/:agentId/:chain", async (req, res) => {
  try {
    const { agentId, chain } = req.params;

    const balance = await x402PaymentGateway.getBalance(agentId, chain);

    res.status(200).json({
      success: true,
      balance,
    });
  } catch (error: any) {
    console.error("[X402] Balance query error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Balance query failed",
    });
  }
});

// ============================================================================
// Service Listings
// ============================================================================

/**
 * POST /api/x402/services
 * List a service for X402 payment
 */
router.post("/services", async (req, res) => {
  try {
    const listing: Omit<X402ServiceListing, "createdAt"> = {
      serviceId: req.body.serviceId || `service_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      agentId: req.body.agentId,
      serviceName: req.body.serviceName,
      description: req.body.description,
      price: req.body.price,
      chain: req.body.chain || "base",
      active: req.body.active !== false,
    };

    if (!listing.agentId || !listing.serviceName || !listing.price) {
      return res.status(400).json({
        success: false,
        error: "agentId, serviceName, and price are required",
      });
    }

    const service = await x402PaymentGateway.listService(listing);

    res.status(201).json({
      success: true,
      service,
    });
  } catch (error: any) {
    console.error("[X402] Service listing error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Service listing failed",
    });
  }
});

/**
 * GET /api/x402/services
 * List all active services (optionally filter by agentId)
 */
router.get("/services", async (req, res) => {
  try {
    const agentId = req.query.agentId as string | undefined;
    const services = x402PaymentGateway.listServices(agentId);

    res.status(200).json({
      success: true,
      services,
      count: services.length,
    });
  } catch (error: any) {
    console.error("[X402] Service listing query error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Service listing query failed",
    });
  }
});

/**
 * GET /api/x402/services/:serviceId
 * Get a specific service listing
 */
router.get("/services/:serviceId", async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = x402PaymentGateway.getService(serviceId);

    if (service) {
      res.status(200).json({
        success: true,
        service,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }
  } catch (error: any) {
    console.error("[X402] Service query error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Service query failed",
    });
  }
});

// ============================================================================
// Payment History
// ============================================================================

/**
 * GET /api/x402/payments
 * Get payment history (optionally filter by agentId)
 */
router.get("/payments", async (req, res) => {
  try {
    const agentId = req.query.agentId as string | undefined;
    const limit = parseInt(req.query.limit as string) || 50;
    const payments = x402PaymentGateway.getPaymentHistory(agentId, limit);

    res.status(200).json({
      success: true,
      payments,
      count: payments.length,
    });
  } catch (error: any) {
    console.error("[X402] Payment history query error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Payment history query failed",
    });
  }
});

// ============================================================================
// Health & Status
// ============================================================================

/**
 * GET /api/x402/status
 * Get X402 Payment Gateway status
 */
router.get("/status", async (_req, res) => {
  try {
    const services = x402PaymentGateway.listServices();
    const recentPayments = x402PaymentGateway.getPaymentHistory(undefined, 10);

    res.status(200).json({
      success: true,
      status: "operational",
      services: {
        total: services.length,
        active: services.filter(s => s.active).length,
      },
      recentPayments: {
        count: recentPayments.length,
        successful: recentPayments.filter(p => p.success).length,
        failed: recentPayments.filter(p => !p.success).length,
      },
      supportedChains: ["base", "polygon", "ethereum"], // Solana coming soon
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[X402] Status query error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Status query failed",
    });
  }
});

export { router as createX402PaymentGatewayRouter };

