
import { Router } from "express";
import { Vibes } from "@dreamnet/vibes-core";

export function createVibesRouter() {
    const router = Router();

    router.get("/vibes/sense", (req, res) => {
        try {
            const { state } = req.query;
            const context = String(state || "IDLE");
            const vibe = Vibes.sense(context);
            res.json({ success: true, vibe });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}
