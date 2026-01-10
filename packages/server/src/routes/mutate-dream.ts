import express from 'express';
import crypto from 'crypto';

const router = express.Router();

router.post('/', (req, res) => {
  const { originalDream } = req.body;
  if (!originalDream) {
    return res.status(400).json({ message: 'Missing dream' });
  }

  const mutated = {
    ...originalDream,
    id: crypto.randomUUID(),
    tags: [...originalDream.tags, 'remixed'],
    score: Math.min(100, (originalDream.score || 60) + 5),
    trustLevel: 'Pending',
    evolution: 'Seed',
    mutatedAt: new Date().toISOString(),
    lineage: {
      parent: originalDream.id || null,
      ancestors: [...(originalDream.lineage?.ancestors || []), originalDream.id || 'root']
    }
  };

  return res.json({ status: 'success', mutatedDream: mutated });
});

export default router;