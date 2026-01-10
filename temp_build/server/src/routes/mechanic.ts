
import { Router } from "express";
import { Router } from "express";
import { ForgeMechanic } from "@dreamnet/forge-fix-core";

export function createMechanicRouter() {
    const router = Router();
    // Initialize the Mechanic
    // In a real app, you might want to reuse a singleton instance
    const mechanic = new ForgeMechanic("mechanic_api_01");

    router.post("/diagnose", async (req, res) => {
        try {
            const { errorLog } = req.body;
            if (!errorLog) {
                return res.status(400).json({ error: "errorLog is required" });
            }

            console.log("🔧 [API] Mechanic diagnosing error...");
            const fix = await mechanic.diagnose(errorLog);
            res.json({ success: true, fix });
        } catch (error: any) {
            console.error("❌ [API] Mechanic failed:", error);
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}
