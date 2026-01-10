import { Router } from "express";
import { VibeConductor } from "../agents/vibe-conductor.js";
import { NERVE_BUS } from "@dreamnet/nerve";

// GOD VIEW ROUTER
// "See what the Machine sees."

const router = Router();
const conductor = new VibeConductor(); // Connect to the hive mind instance

router.get("/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(`data: ${JSON.stringify({ type: 'INIT', msg: 'Connected to DreamNet Observatory' })}\n\n`);

    conductor.start(); // Ensure the engine is running
    const bioStream = conductor.getBioStream();

    // 1. Listen to Legacy Vibe pulses
    const legacyListener = (event: any) => {
        if (event.type === 'PULSE') {
            res.write(`data: ${JSON.stringify(event)}\n\n`);
        }
    };

    // 2. Listen to NEW Nerve Spine events (The 12 Organs)
    const nerveUnsubscribe = NERVE_BUS.subscribeAll((event) => {
        res.write(`data: ${JSON.stringify({ type: 'NERVE_EVENT', ...event })}\n\n`);
    });

    bioStream.on('event', legacyListener);

    req.on("close", () => {
        bioStream.off('event', legacyListener);
        nerveUnsubscribe();
        res.end();
    });
});

export const createGodViewRouter = () => router;
