
import { Router } from "express";
import { OctopusExecutor } from "@dreamnet/octopus-executor";
import { withCluster } from "@dreamnet/dreamnet-control-core/controlCoreMiddleware";

export function createOctopusTriggerRouter(): Router {
    const router = Router();

    // Attach OCTOPUS cluster to this router
    router.use(withCluster("OCTOPUS"));

    /**
     * POST /api/octopus/tick
     * Manually trigger an Octopus execution cycle.
     * Secured by Admin/Service Key via Control Core.
     */
    router.post("/octopus/tick", async (req, res) => {
        try {
            console.log("🐙 [Octopus] HTTP Tick Triggered");

            // Generate a synthetic context for the run
            const context = {
                timestamp: Date.now(),
                // We could pass in overrides from body if needed
                ...req.body
            };

            // Trigger the run asynchronously (don't block HTTP response too long)
            // Or await it if we want to return the result. 
            // For Workflows, awaiting is better to confirm success.
            await OctopusExecutor.run(context);

            const status = OctopusExecutor.status();

            res.json({
                ok: true,
                message: "Octopus Cycle Completed",
                status
            });

        } catch (error: any) {
            console.error("Failed to tick Octopus:", error);
            res.status(500).json({ error: error.message });
        }
    });

    /**
     * GET /api/octopus/status
     * Get current 8-Arm status.
     */
    router.get("/octopus/status", (req, res) => {
        try {
            const status = OctopusExecutor.status();
            res.json({ ok: true, status });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}
