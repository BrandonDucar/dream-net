import { Router, Request, Response } from "express";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const router = Router();

/**
 * GET /api/heartbeat-cron
 * Vercel cron endpoint that runs the heartbeat script
 */
router.get("/heartbeat-cron", async (req: Request, res: Response) => {
  try {
    // Run the heartbeat script
    // Note: In production, you might want to import and run the function directly
    // instead of executing a script
    const { stdout, stderr } = await execAsync("tsx ops/heartbeat.ts");
    
    console.log("[Heartbeat Cron] Output:", stdout);
    if (stderr) {
      console.error("[Heartbeat Cron] Errors:", stderr);
    }

    res.json({
      ok: true,
      message: "Heartbeat completed",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Heartbeat Cron] Failed:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;

