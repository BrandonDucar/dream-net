/**
 * Market Data API Routes
 * Endpoints for accessing real-time market data (metals, crypto, stocks)
 */

import { Router } from "express";

const router = Router();

/**
 * GET /api/market-data/status
 * Get status of all market data spikes
 */
router.get("/status", (req, res) => {
  try {
    const marketDataCore = (global as any).marketDataCore;
    if (!marketDataCore) {
      return res.status(503).json({
        error: "Market Data Core not initialized",
      });
    }

    const status = marketDataCore.getStatus();
    res.json({
      success: true,
      status,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to get market data status",
      message: error.message,
    });
  }
});

/**
 * GET /api/market-data/metals
 * Get current metals prices
 */
router.get("/metals", async (req, res) => {
  try {
    const marketDataCore = (global as any).marketDataCore;
    if (!marketDataCore) {
      return res.status(503).json({
        error: "Market Data Core not initialized",
      });
    }

    const metalsSpike = marketDataCore.getMetalsSpike();
    const prices = await metalsSpike.fetchPrices();

    if (!prices) {
      return res.status(503).json({
        error: "Failed to fetch metals prices",
      });
    }

    res.json({
      success: true,
      prices,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to fetch metals prices",
      message: error.message,
    });
  }
});

/**
 * GET /api/market-data/crypto
 * Get current crypto prices
 */
router.get("/crypto", async (req, res) => {
  try {
    const marketDataCore = (global as any).marketDataCore;
    if (!marketDataCore) {
      return res.status(503).json({
        error: "Market Data Core not initialized",
      });
    }

    const cryptoSpike = marketDataCore.getCryptoSpike();
    const prices = await cryptoSpike.fetchPrices();

    if (!prices) {
      return res.status(503).json({
        error: "Failed to fetch crypto prices",
      });
    }

    res.json({
      success: true,
      prices,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to fetch crypto prices",
      message: error.message,
    });
  }
});

/**
 * GET /api/market-data/stocks
 * Get current stock prices
 */
router.get("/stocks", async (req, res) => {
  try {
    const marketDataCore = (global as any).marketDataCore;
    if (!marketDataCore) {
      return res.status(503).json({
        error: "Market Data Core not initialized",
      });
    }

    const stockSpike = marketDataCore.getStockSpike();
    const prices = await stockSpike.fetchPrices();

    if (!prices) {
      return res.status(503).json({
        error: "Failed to fetch stock prices",
      });
    }

    res.json({
      success: true,
      prices,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to fetch stock prices",
      message: error.message,
    });
  }
});

/**
 * GET /api/market-data/all
 * Get all market data (metals, crypto, stocks)
 */
router.get("/all", async (req, res) => {
  try {
    const marketDataCore = (global as any).marketDataCore;
    if (!marketDataCore) {
      return res.status(503).json({
        error: "Market Data Core not initialized",
      });
    }

    const [metals, crypto, stocks] = await Promise.allSettled([
      marketDataCore.getMetalsSpike().fetchPrices(),
      marketDataCore.getCryptoSpike().fetchPrices(),
      marketDataCore.getStockSpike().fetchPrices(),
    ]);

    res.json({
      success: true,
      metals: metals.status === "fulfilled" ? metals.value : null,
      crypto: crypto.status === "fulfilled" ? crypto.value : null,
      stocks: stocks.status === "fulfilled" ? stocks.value : null,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to fetch market data",
      message: error.message,
    });
  }
});

/**
 * GET /api/market-data/agents
 * Get agent metrics and health for all spike agents
 */
router.get("/agents", (req, res) => {
  try {
    const marketDataCore = (global as any).marketDataCore;
    if (!marketDataCore) {
      return res.status(503).json({
        error: "Market Data Core not initialized",
      });
    }

    const metalsAgent = marketDataCore.getMetalsAgent();
    const cryptoAgent = marketDataCore.getCryptoAgent();
    const stockAgent = marketDataCore.getStockAgent();

    res.json({
      success: true,
      agents: {
        metals: {
          metrics: metalsAgent.getMetrics(),
          spikeStatus: metalsAgent.getSpikeStatus(),
        },
        crypto: {
          metrics: cryptoAgent.getMetrics(),
          spikeStatus: cryptoAgent.getSpikeStatus(),
        },
        stocks: {
          metrics: stockAgent.getMetrics(),
          spikeStatus: stockAgent.getSpikeStatus(),
        },
      },
      timestamp: Date.now(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to get agent metrics",
      message: error.message,
    });
  }
});

export default router;

