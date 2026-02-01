import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const dir = path.resolve(__dirname, '../data');
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    try {
      const parsed = JSON.parse(content);
      if (parsed.id === id) return res.json(parsed);
    } catch {}
  }

  return res.status(404).json({ error: 'Dream not found' });
});

export default router;