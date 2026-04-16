import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.post('/', (req, res) => {
  const { id, wallet } = req.body;
  const dir = path.resolve(__dirname, '../data');
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    try {
      const parsed = JSON.parse(content);
      if (parsed.id === id) {
        parsed.claimed = true;
        parsed.owner = wallet;
        fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2));
        return res.json({ status: 'success', message: 'Fusion claimed and saved!' });
      }
    } catch {}
  }

  res.status(404).json({ status: 'error', message: 'Dream not found' });
});

export default router;