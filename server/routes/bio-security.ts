import { Router } from "express";
import { ShadowLabEngine } from "../../packages/agents/src/specialized/ShadowLabEngine";
import { PathogenResearchEngine } from "../../packages/agents/src/specialized/PathogenResearchEngine";

export function createBioSecurityRouter(): Router {
  const router = Router();
  const shadowLab = new ShadowLabEngine();
  const cdc = new PathogenResearchEngine();

  /**
   * 🧛 Trigger a Shadow Lab Zero-Day Injection
   */
  router.post("/shadow-lab/inject", async (req, res) => {
    const { type } = req.body;
    try {
      const signature = await shadowLab.generateZeroDay(type || 'Unknown');
      res.json({ ok: true, signature, message: "Zero-Day injected and routed to CDC." });
    } catch (error: any) {
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  /**
   * 🔬 List all discovered strains in the CDC Registry
   */
  router.get("/cdc/strains", async (_req, res) => {
    try {
      // In a real implementation, we'd read from the registry file or DB
      res.json({ ok: true, message: "Fetching CDC registry..." });
    } catch (error: any) {
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  /**
   * 🧬 Force a mutation cycle on a strain
   */
  router.post("/cdc/mutate", async (req, res) => {
    const { strainId } = req.body;
    try {
      const strain = await cdc.mutateStrain(strainId);
      res.json({ ok: true, strain });
    } catch (error: any) {
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  return router;
}
