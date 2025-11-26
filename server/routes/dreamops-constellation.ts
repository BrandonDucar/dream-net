import { Router, Request, Response } from "express";
import IntegratedConstellationOrchestrator from "../../packages/dreamops-constellation/integrated-orchestrator.js";

const router = Router();
const orchestrator = new IntegratedConstellationOrchestrator();

/**
 * POST /api/dreamops/brainhub/brief
 * Create dev/content brief
 */
router.post("/brainhub/brief", async (req: Request, res: Response) => {
  try {
    const { type, title, description, ...rest } = req.body;

    if (type === "dev") {
      const brief = await orchestrator.brainHub.generateDevBrief(
        title,
        description,
        rest.contextPack
      );
      await orchestrator.handleDevBrief(brief);
      res.json({ ok: true, brief });
    } else if (type === "content") {
      const brief = await orchestrator.brainHub.generateContentBrief(
        title,
        description,
        rest.platforms || [],
        rest.targetAudience || "",
        rest.tone || ""
      );
      await orchestrator.handleContentBrief(brief);
      res.json({ ok: true, brief });
    } else {
      res.status(400).json({ error: "Invalid brief type" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/dreamops/deploykeeper/deploy
 * Trigger deployment
 */
router.post("/deploykeeper/deploy", async (req: Request, res: Response) => {
  try {
    const { service, environment, branch } = req.body;
    
    const order = await orchestrator.brainHub.generateDeployOrder(
      service,
      environment || "staging",
      branch || "main"
    );
    
    await orchestrator.handleDeployOrder(order);
    
    res.json({ ok: true, order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/dreamops/socialweaver/announce
 * Post announcement
 */
router.post("/socialweaver/announce", async (req: Request, res: Response) => {
  try {
    const { title, content, platforms, utmTags } = req.body;
    
    const post = await orchestrator.socialWeaver.postNow(
      content,
      platforms || [],
      undefined,
      utmTags
    );
    
    res.json({ ok: true, post });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/dreamops/dreammemory/snapshot
 * Save context snapshot
 */
router.post("/dreammemory/snapshot", async (req: Request, res: Response) => {
  try {
    const { namespace, key, content, metadata } = req.body;
    
    const entry = await orchestrator.dreamMemory.store(
      namespace,
      key,
      content,
      metadata
    );
    
    res.json({ ok: true, entry });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/dreamops/status
 * Get constellation status
 */
router.get("/status", async (req: Request, res: Response) => {
  try {
    res.json({
      ok: true,
      stars: {
        brainHub: orchestrator.brainHub.getAllTasks().length,
        deployKeeper: orchestrator.deployKeeper.getAllDeployments().length,
        dreamMemory: orchestrator.dreamMemory.getMemoriesByNamespace("code").length,
        socialWeaver: orchestrator.socialWeaver.getAllPosts().length,
      },
      events: orchestrator.getEvents(10),
      integrations: {
        github: !!process.env.GITHUB_TOKEN,
        telegram: !!process.env.TELEGRAM_BOT_TOKEN,
        cloudRun: !!process.env.GCP_PROJECT_ID,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/dreamops/start-cycle
 * Start autonomous cycle
 */
router.post("/start-cycle", async (req: Request, res: Response) => {
  try {
    await orchestrator.startAutonomousCycle();
    res.json({ ok: true, message: "Autonomous cycle started" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

