import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  const walletAddress = req.query.walletAddress as string;

  if (!walletAddress) {
    return res.status(400).json({ message: 'Missing walletAddress' });
  }

  const filePath = path.resolve(__dirname, `../data/${walletAddress}-dream.json`);

  if (!fs.existsSync(filePath)) {
    return res.json({ status: 'error', message: 'No saved dream found for that wallet.' });
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const dreamCore = JSON.parse(content);

  return res.json({ status: 'success', dreamCore });
});

export default router;