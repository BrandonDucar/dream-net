import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/:wallet', (req, res) => {
  const { wallet } = req.params;
  
  if (!wallet) {
    return res.status(400).json({ error: 'Wallet address required' });
  }

  try {
    const dataDir = path.resolve(__dirname, '../data');
    
    if (!fs.existsSync(dataDir)) {
      return res.json({ dreams: [] });
    }

    const files = fs.readdirSync(dataDir);
    const walletFiles = files.filter(f => f.startsWith(`${wallet}-`) && f.endsWith('.json'));
    
    const dreams = walletFiles.map(filename => {
      const filepath = path.join(dataDir, filename);
      const content = fs.readFileSync(filepath, 'utf8');
      return JSON.parse(content);
    });

    return res.json({ dreams });

  } catch (error) {
    console.error('Load dreams error:', error);
    return res.status(500).json({ error: 'Failed to load dreams' });
  }
});

export default router;