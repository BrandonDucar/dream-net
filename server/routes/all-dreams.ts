import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  const dir = path.resolve(__dirname, '../data');
  const files = fs.readdirSync(dir);
  const dreams = [];

  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    try {
      const parsed = JSON.parse(content);
      if (parsed.id) dreams.push(parsed);
    } catch {}
  }

  res.json(dreams);
});

export default router;