
import { Router } from "express";
import { TrendHunter } from "@dreamnet/trend-hijack-core";

export function createHunterRouter() {
    const router = Router();
    const hunter = new TrendHunter("hunter_api_01");

    router.post("/hunt", async (req, res) => {
        try {
            const { platform, keyword } = req.body;
            console.log(`🏹 [API] Hunter scanning ${platform} for '${keyword}'...`);

            // Trigger the hunt (pass as array)
            const targets = [platform || "base"];
            await TrendHunter.hunt(targets);

            const dummyTrends = [
                { topic: keyword, momentum: 85, sentiment: "bullish" },
                { topic: `distorted_${keyword}`, momentum: 45, sentiment: "neutral" }
            ];

            res.json({ success: true, trends: dummyTrends, message: "Hunt triggered" });
        } catch (error: any) {
            console.error("❌ [API] Hunter failed:", error);
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}
