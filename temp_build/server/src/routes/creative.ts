
import { Router } from "express";
import { Creative } from "@dreamnet/creative-engine";

export function createCreativeRouter() {
    const router = Router();

    router.post("/creative/brand", (req, res) => {
        try {
            const { name } = req.body;
            if (!name) return res.status(400).json({ error: "Name required" });

            const dna = Creative.generateIdentity(name);
            res.json({ success: true, dna });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}
