import { Router, Request, Response } from "express";
import BrandGradingCore from "../../packages/dreamnet-video-brand-core/index.js";

const router = Router();
const brandGrading = new BrandGradingCore();

/**
 * POST /api/brand-grading/apply
 * Apply brand grading to video
 */
router.post("/apply", async (req: Request, res: Response) => {
  try {
    const { videoPath, presetId, outputPath } = req.body;

    if (!videoPath || !presetId) {
      return res.status(400).json({
        error: "videoPath and presetId are required",
      });
    }

    const result = await brandGrading.applyGrading(videoPath, presetId, outputPath);

    res.json({
      ok: true,
      outputPath: result,
      preset: brandGrading.getPreset(presetId),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/brand-grading/presets
 * List available presets
 */
router.get("/presets", async (req: Request, res: Response) => {
  try {
    const presets = brandGrading.listPresets();
    res.json({ ok: true, presets });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/brand-grading/presets/:id
 * Get specific preset
 */
router.get("/presets/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const preset = brandGrading.getPreset(id);

    if (!preset) {
      return res.status(404).json({ error: "Preset not found" });
    }

    res.json({ ok: true, preset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/brand-grading/custom
 * Create custom brand pair
 */
router.post("/custom", async (req: Request, res: Response) => {
  try {
    const { name, primaryColor, accentColor, intensity } = req.body;

    if (!name || !primaryColor || !accentColor) {
      return res.status(400).json({
        error: "name, primaryColor, and accentColor are required",
      });
    }

    const preset = brandGrading.createCustomPreset(
      name,
      primaryColor,
      accentColor,
      intensity
    );

    res.json({ ok: true, preset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

