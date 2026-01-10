
import { Router } from "express";
import { LiquidityEngine } from "../../packages/liquidity-engine";

export function createLiquidityRouter(): Router {
    const router = Router();

    /**
     * GET /api/liquidity/status
     * Get overall liquidity engine status
     */
    router.get("/liquidity/status", (req, res) => {
        try {
            const status = LiquidityEngine.status();
            res.json({ ok: true, status });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    /**
     * GET /api/liquidity/pools
     * List all configured pools (including SLU pools)
     */
    router.get("/liquidity/pools", (req, res) => {
        try {
            const configs = LiquidityEngine.listConfigs();
            const statuses = LiquidityEngine.listStatuses();

            // Merge config and status
            const pools = configs.map(cfg => {
                const status = statuses.find(s => s.configId === cfg.id);
                return {
                    ...cfg,
                    status: status ? status.state : "unknown",
                    health: status ? status.health : "unknown",
                    tvl: status ? status.tvl : 0,
                };
            });

            res.json({ ok: true, pools, count: pools.length });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}
