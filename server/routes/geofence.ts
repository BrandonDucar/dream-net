import { Router, Request, Response } from "express";
import GeofencingCore from "../../packages/dreamnet-geofence-core/index.js";

const router = Router();
const geofencing = new GeofencingCore();

/**
 * GET /api/geofence/content
 * Get region-specific content based on IP
 */
router.get("/content", async (req: Request, res: Response) => {
  try {
    const ipAddress = req.ip || req.headers["x-forwarded-for"] as string;
    const content = await geofencing.getContentForIP(ipAddress);

    res.json({
      ok: true,
      content,
      detectedRegion: await geofencing.detectRegion(ipAddress),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/geofence/regions
 * Get all configured regions
 */
router.get("/regions", async (req: Request, res: Response) => {
  try {
    const regions = geofencing.getAllRegions();
    res.json({ ok: true, regions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/geofence/region
 * Set region content
 */
router.post("/region", async (req: Request, res: Response) => {
  try {
    const { region, tier, content } = req.body;

    if (!region || tier === undefined || !content) {
      return res.status(400).json({
        error: "region, tier, and content are required",
      });
    }

    geofencing.setRegionContent(region, tier, content);

    res.json({ ok: true, message: "Region content updated" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

