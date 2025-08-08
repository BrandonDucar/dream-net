import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  const dir = path.resolve(__dirname, '../data');
  const fusions = [];

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.json')) continue;
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    try {
      const parsed = JSON.parse(content);
      if (parsed.evolution === 'Fusion') fusions.push(parsed);
    } catch {}
  }

  res.json(fusions);
});

export default router;