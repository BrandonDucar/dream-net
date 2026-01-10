import { Router } from "express";
import { db } from "../db";
import { dreams } from '@dreamnet/shared';
import { eq, sql } from "drizzle-orm";

export function createDreamInteractionsRouter(): Router {
  const router = Router();

  // POST /api/dreams/:id/like
  router.post("/dreams/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      const userId = (req.headers["x-user-id"] as string) || req.body.userId || "anonymous";

      // Increment likes count
      await db
        .update(dreams)
        .set({
          likes: sql`${dreams.likes} + 1`,
        })
        .where(eq(dreams.id, id));

      // Get updated dream
      const [dream] = await db.select().from(dreams).where(eq(dreams.id, id));

      res.json({ ok: true, likes: dream?.likes || 0 });
    } catch (error) {
      console.error("Failed to like dream:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/dreams/:id/unlike
  router.post("/dreams/:id/unlike", async (req, res) => {
    try {
      const { id } = req.params;

      // Decrement likes count (don't go below 0)
      await db
        .update(dreams)
        .set({
          likes: sql`GREATEST(${dreams.likes} - 1, 0)`,
        })
        .where(eq(dreams.id, id));

      const [dream] = await db.select().from(dreams).where(eq(dreams.id, id));

      res.json({ ok: true, likes: dream?.likes || 0 });
    } catch (error) {
      console.error("Failed to unlike dream:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/dreams/:id/comment
  router.post("/dreams/:id/comment", async (req, res) => {
    try {
      const { id } = req.params;
      const { comment, userId } = req.body;

      if (!comment) {
        return res.status(400).json({ error: "Comment text required" });
      }

      // Increment comments count
      await db
        .update(dreams)
        .set({
          comments: sql`${dreams.comments} + 1`,
        })
        .where(eq(dreams.id, id));

      const [dream] = await db.select().from(dreams).where(eq(dreams.id, id));

      res.json({
        ok: true,
        comments: dream?.comments || 0,
        comment: {
          id: `comment-${Date.now()}`,
          text: comment,
          userId: userId || "anonymous",
          createdAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Failed to comment on dream:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/dreams/:id/remix
  router.post("/dreams/:id/remix", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, userId } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Dream name required" });
      }

      // Get original dream
      const [original] = await db.select().from(dreams).where(eq(dreams.id, id));
      if (!original) {
        return res.status(404).json({ error: "Dream not found" });
      }

      // Increment remix count on original
      await db
        .update(dreams)
        .set({
          remixCount: sql`${dreams.remixCount} + 1`,
        })
        .where(eq(dreams.id, id));

      // Create remix dream
      const [remix] = await db
        .insert(dreams)
        .values({
          name,
          title: name,
          description: description || `Remix of: ${original.name || original.title}`,
          creator: userId || "anonymous",
          wallet: userId || "anonymous",
          remixOf: id,
          tags: original.tags || [],
          status: "Draft",
          dreamStatus: "pending",
        })
        .returning();

      res.json({ ok: true, remix, remixCount: (original.remixCount || 0) + 1 });
    } catch (error) {
      console.error("Failed to remix dream:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/dreams/:id/comments
  router.get("/dreams/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      // For now, return empty array - comments storage can be added later
      res.json({ ok: true, comments: [] });
    } catch (error) {
      console.error("Failed to get comments:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}

