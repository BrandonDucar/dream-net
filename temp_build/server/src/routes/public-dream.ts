import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  const filePath = path.resolve(__dirname, `../data/shared/${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Dream not found.' });
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const dreamCore = JSON.parse(content);

  // Increment view count
  dreamCore.views = (dreamCore.views || 0) + 1;
  fs.writeFileSync(filePath, JSON.stringify(dreamCore, null, 2));

  return res.json(dreamCore);
});

export default router;