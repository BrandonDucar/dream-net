import express from 'express';
import { loadDream, saveDream, getAllDreams, Dream } from './shared-dream-storage';

const router = express.Router();

// Your exact pattern implementation
router.post('/', (req, res) => {
  const { originalId, wallet } = req.body;
  const original = loadDream(originalId);

  if (!original || !wallet) {
    return res.status(400).json({ success: false, error: 'Missing data' });
  }

  const newId = `remix-${Date.now()}`;
  const remix = {
    ...original,
    id: newId,
    title: `${original.title} (Remix)`,
    lineage: {
      ancestors: [original.id]
    },
    createdByAgent: 'LUCID',
    wallet,
    remix: true,
    createdAt: new Date().toISOString(),
    bountyId: original.bountyId || original.id,  // depending on where it started
    forkedFrom: original.id,
  };

  saveDream(newId, remix);

  return res.json({ success: true, newDreamId: newId });
});

// Additional endpoint to get available dreams for remixing
router.get('/available-dreams', (req, res) => {
  const dreams = getAllDreams().map(dream => ({
    id: dream.id,
    title: dream.title,
    type: dream.type,
    createdByAgent: dream.createdByAgent
  }));

  res.json({ dreams });
});

// Get specific dream details
router.get('/dream/:id', (req, res) => {
  const { id } = req.params;
  const dream = loadDream(id);

  if (!dream) {
    return res.status(404).json({ success: false, error: 'Dream not found' });
  }

  res.json({ success: true, dream });
});

// Your exact pattern for getting dream by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const dream = loadDream(id);
  if (!dream) return res.status(404).json({ error: 'Dream not found' });
  res.json(dream);
});

export default router;