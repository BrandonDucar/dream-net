import { Router } from "express";
import { db } from "../db";
import { dreams } from '@dreamnet/shared';
import { eq, sql } from "drizzle-orm";

export function createDreamContributionsRouter(): Router {
  const router = Router();

  // POST /api/dreams/:id/contribute
  router.post("/dreams/:id/contribute", async (req, res) => {
    const userId = req.headers["x-user-id"] as string | undefined;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID required" });
    }

    try {
      const dreamId = req.params.id;
      const { type, amount, token, skill, service, message } = req.body;

      if (!type) {
        return res.status(400).json({ error: "Contribution type is required" });
      }

      // Fetch the dream
      const dream = await db.query.dreams.findFirst({
        where: eq(dreams.id, dreamId),
      });

      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }

      // Handle different contribution types
      if (type === 'financial') {
        // Record financial contribution
        // Update dream's blessings or create a new contribution record
        const currentBlessings = (dream.blessings as Array<{
          wallet: string;
          message: string;
          amount: number;
          timestamp: number;
        }>) || [];

        const newBlessing = {
          wallet: userId,
          message: message || `Contributed ${amount} ${token}`,
          amount: parseFloat(amount),
          timestamp: Date.now(),
        };

        await db
          .update(dreams)
          .set({
            blessings: sql`${dreams.blessings} || ${JSON.stringify([newBlessing])}::jsonb`,
            xp: sql`${dreams.xp} + ${Math.floor(parseFloat(amount) * 10)}`, // Award XP based on contribution
          })
          .where(eq(dreams.id, dreamId));

        res.json({
          ok: true,
          message: `Thank you for contributing ${amount} ${token}!`,
          contribution: newBlessing,
        });
      } else if (type === 'skill' || type === 'service') {
        // Record skill/service contribution
        // Add to contributors array if not already there
        const currentContributors = (dream.contributors as Array<{
          wallet: string;
          role: 'Builder' | 'Artist' | 'Coder' | 'Visionary' | 'Promoter';
          joinedAt: string;
        }>) || [];

        // Determine role based on skill/service
        let role: 'Builder' | 'Artist' | 'Coder' | 'Visionary' | 'Promoter' = 'Builder';
        if (skill) {
          if (skill === 'coding') role = 'Coder';
          else if (skill === 'design') role = 'Artist';
          else if (skill === 'marketing' || skill === 'community') role = 'Promoter';
          else if (skill === 'strategy' || skill === 'writing') role = 'Visionary';
        }

        // Check if user is already a contributor
        const existingContributor = currentContributors.find(c => c.wallet.toLowerCase() === userId.toLowerCase());
        
        if (!existingContributor) {
          const newContributor = {
            wallet: userId,
            role: role,
            joinedAt: new Date().toISOString(),
          };

          await db
            .update(dreams)
            .set({
              contributors: sql`${dreams.contributors} || ${JSON.stringify([newContributor])}::jsonb`,
              xp: sql`${dreams.xp} + 50`, // Award XP for skill contribution
            })
            .where(eq(dreams.id, dreamId));

          res.json({
            ok: true,
            message: `Thank you for offering your ${skill || 'service'}! You've been added as a ${role}.`,
            contributor: newContributor,
          });
        } else {
          res.json({
            ok: true,
            message: `You're already contributing to this dream as a ${existingContributor.role}.`,
            contributor: existingContributor,
          });
        }
      } else {
        return res.status(400).json({ error: "Invalid contribution type" });
      }
    } catch (error) {
      console.error("Failed to record contribution:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/dreams/:id/contributions
  router.get("/dreams/:id/contributions", async (req, res) => {
    try {
      const dreamId = req.params.id;
      
      const dream = await db.query.dreams.findFirst({
        where: eq(dreams.id, dreamId),
      });

      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }

      const contributions = {
        financial: (dream.blessings as Array<{
          wallet: string;
          message: string;
          amount: number;
          timestamp: number;
        }>) || [],
        contributors: (dream.contributors as Array<{
          wallet: string;
          role: 'Builder' | 'Artist' | 'Coder' | 'Visionary' | 'Promoter';
          joinedAt: string;
        }>) || [],
      };

      res.json({ ok: true, contributions });
    } catch (error) {
      console.error("Failed to fetch contributions:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}

