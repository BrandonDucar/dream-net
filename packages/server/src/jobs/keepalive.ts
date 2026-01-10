import { registerRailJob } from "../magnetic-rail/scheduler";
import { keepaliveService } from "../services/KeepaliveService";

/**
 * Scheduled job to run the keepalive heartbeat.
 * Should be triggered every 24 hours.
 */
registerRailJob({
    id: "upstash_keepalive",
    name: "Upstash Search Index Keepalive",
    cronExpression: "0 4 * * *", // 04:00 UTC daily
    active: true,
    handler: async () => {
        console.log("[Job] Starting Upstash keepalive heartbeat...");
        try {
            const result = await keepaliveService.ping();
            console.log("[Job] Keepalive heartbeat successful:", result);
        } catch (error) {
            console.error("[Job] Keepalive heartbeat failed:", error);
        }
    },
});
