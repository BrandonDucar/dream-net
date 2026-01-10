import express from 'express';
import { rootAgent, RootInput } from '../agents/ROOT';

const router = express.Router();

router.post('/', async (req, res) => {
  const input: RootInput = req.body;
  try {
    const result = await rootAgent(input);
    return res.json(result);
  } catch (err) {
    console.error("🌱 ROOT error:", err);
    return res.status(500).json({ 
      status: 'error',
      message: 'ROOT backend planning failed.' 
    });
  }
});

export default router;