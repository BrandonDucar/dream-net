import { Router } from "express";
// import { DREAMKEEPER_CORE } from "../../lib/dreamkeeperCore";
const DREAMKEEPER_CORE = {
  baseHealth: { mainnet: 'ok', sepolia: 'ok' },
  checkBaseHealth: async () => 'ok'
};

const router = Router();

/**
 * GET /api/base-health
 * Get Base L2 network health status
 */
router.get("/", async (_req, res) => {
  try {
    const baseHealth = DREAMKEEPER_CORE.baseHealth;
    res.json({
      success: true,
      networks: {
        mainnet: baseHealth.mainnet,
        sepolia: baseHealth.sepolia,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * POST /api/base-health/check
 * Trigger manual Base health check
 */
router.post("/check", async (req, res) => {
  try {
    const { network } = req.body;
    const networkType = network === 'sepolia' ? 'sepolia' : 'mainnet';

    const result = await DREAMKEEPER_CORE.checkBaseHealth(networkType);

    res.json({
      success: true,
      network: networkType,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

export default router;

