import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.post('/', (req, res) => {
  const { dream, wallet } = req.body;
  if (!dream || !wallet) {
    return res.status(400).json({ status: 'error', message: 'Missing dream or wallet.' });
  }

  const filePath = path.resolve(__dirname, `../data/${wallet}-dream.json`);
  fs.writeFileSync(filePath, JSON.stringify(dream, null, 2));

  return res.json({ status: 'success' });
});

export default router;