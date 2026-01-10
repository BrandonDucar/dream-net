import express from 'express';
import { nanoid } from 'nanoid';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { dreamCore } = req.body;

    if (!dreamCore) {
      return res.status(400).json({ status: 'error', message: 'No Dream Core provided.' });
    }

    // Generate unique slug
    const slug = nanoid(12);
    
    // Create shared dreams directory if it doesn't exist
    const sharedDir = path.join(process.cwd(), 'server', 'data', 'shared');
    await fs.mkdir(sharedDir, { recursive: true });

    // Save shared dream core with metadata
    const sharedDream = {
      ...dreamCore,
      slug,
      sharedAt: new Date().toISOString(),
      views: 0,
      status: 'shared'
    };

    const filePath = path.join(sharedDir, `${slug}.json`);
    await fs.writeFile(filePath, JSON.stringify(sharedDream, null, 2));

    res.json({
      status: 'success',
      slug,
      message: 'Dream core shared successfully'
    });

  } catch (error: any) {
    console.error('Generate dream link error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to generate share link' });
  }
});

export default router;