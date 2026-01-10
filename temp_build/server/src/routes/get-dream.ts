import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/:slug', (req, res) => {
  const { slug } = req.params;
  
  try {
    // Try shared directory first
    const sharedPath = path.resolve(__dirname, `../data/shared/${slug}.json`);
    if (fs.existsSync(sharedPath)) {
      const content = fs.readFileSync(sharedPath, 'utf8');
      return res.json(JSON.parse(content));
    }

    // Try data directory
    const dataPath = path.resolve(__dirname, `../data/${slug}.json`);
    if (fs.existsSync(dataPath)) {
      const content = fs.readFileSync(dataPath, 'utf8');
      return res.json(JSON.parse(content));
    }

    return res.status(404).json({ error: 'Dream not found' });

  } catch (error) {
    console.error('Get dream error:', error);
    return res.status(500).json({ error: 'Failed to load dream' });
  }
});

export default router;