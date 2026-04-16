/**
 * Wolf Pack Activation Route
 * 
 * Immediately start hunting for funding opportunities
 */

import { Router } from "express";
import { wolfPack } from "../agents/WolfPack";
import { fleetSystem } from "../fleets/FleetSystem";
import { dreamNetEmail } from "../email/DreamNetEmail";

export function createWolfPackActivateRouter(): Router {
  const router = Router();

  // POST /api/wolf-pack/activate - Activate Wolf Pack hunting
  router.post("/wolf-pack/activate", async (req, res) => {
    try {
      console.log("🐺 [Wolf Pack] ACTIVATION REQUESTED - Starting hunt...");

      // Immediate discovery
      const opportunities = await wolfPack.discoverOpportunities();
      console.log(`🐺 [Wolf Pack] Discovered ${opportunities.length} opportunities`);

      // Create default hunt if none exists
      const existingHunts = wolfPack.getHunts();
      let hunt;
      if (existingHunts.length === 0) {
        hunt = wolfPack.createHunt(10, ["base", "optimism"], undefined);
        console.log(`🐺 [Wolf Pack] Created default hunt: ${hunt.id}`);
      } else {
        hunt = existingHunts[0];
      }

      // Add all opportunities to hunt
      for (const opp of opportunities) {
        wolfPack.addOpportunityToHunt(hunt.id, opp.id);
      }

      // Send activation notification email
      try {
        await dreamNetEmail.sendEmail(
          process.env.DREAMNET_EMAIL || "dreamnet@dreamnet.ink",
          "🐺 Wolf Pack Activated - Hunt Started",
          `Wolf Pack has been activated and is now hunting for funding opportunities.

Discovered Opportunities: ${opportunities.length}
- Base Builder Grants: ${opportunities.filter(o => o.source === "base").length}
- Optimism Retro Funding: ${opportunities.filter(o => o.source === "optimism").length}

Active Hunt: ${hunt.id}
Target: ${hunt.targetAmount} ETH
Sources: ${hunt.targetSources.join(", ")}

The pack is on the hunt! 🐺💰`,
          `<h1>🐺 Wolf Pack Activated</h1>
<p>Wolf Pack has been activated and is now hunting for funding opportunities.</p>
<ul>
  <li>Discovered Opportunities: <strong>${opportunities.length}</strong></li>
  <li>Base Builder Grants: ${opportunities.filter(o => o.source === "base").length}</li>
          <li>Optimism Retro Funding: ${opportunities.filter(o => o.source === "optimism").length}</li>
</ul>
<p><strong>Active Hunt:</strong> ${hunt.id}</p>
<p><strong>Target:</strong> ${hunt.targetAmount} ETH</p>
<p><strong>Sources:</strong> ${hunt.targetSources.join(", ")}</p>
<p>The pack is on the hunt! 🐺💰</p>`,
          { type: "wolf-pack-activation" }
        );
      } catch (emailErr) {
        console.warn("Failed to send activation email:", emailErr);
      }

      res.json({
        ok: true,
        message: "Wolf Pack activated and hunting!",
        hunt,
        opportunities: opportunities.length,
        status: "hunting",
      });
    } catch (error) {
      console.error("Failed to activate Wolf Pack:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/wolf-pack/status - Get hunting status
  router.get("/wolf-pack/status", async (req, res) => {
    try {
      const hunts = wolfPack.getHunts();
      const opportunities = wolfPack.getOpportunities();
      const activeHunts = hunts.filter(h => h.status === "active");

      res.json({
        ok: true,
        status: "hunting",
        activeHunts: activeHunts.length,
        totalOpportunities: opportunities.length,
        opportunitiesBySource: {
          base: opportunities.filter(o => o.source === "base").length,
          optimism: opportunities.filter(o => o.source === "optimism").length,
          other: opportunities.filter(o => !["base", "optimism"].includes(o.source)).length,
        },
        hunts: activeHunts.map(h => ({
          id: h.id,
          targetAmount: h.targetAmount,
          targetSources: h.targetSources,
          opportunities: h.opportunities.length,
        })),
      });
    } catch (error) {
      console.error("Failed to get Wolf Pack status:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}

