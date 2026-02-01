import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ status: 'error', message: 'Slug required' });
    }

    const filePath = path.join(process.cwd(), 'server', 'data', 'shared', `${slug}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const sharedDream = JSON.parse(data);

      // Increment view count
      sharedDream.views = (sharedDream.views || 0) + 1;
      await fs.writeFile(filePath, JSON.stringify(sharedDream, null, 2));

      res.json({
        status: 'success',
        dreamCore: sharedDream
      });

    } catch (fileError) {
      res.status(404).json({ status: 'error', message: 'Shared dream not found' });
    }

  } catch (error: any) {
    console.error('Shared dream retrieval error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve shared dream' });
  }
});

export default router;