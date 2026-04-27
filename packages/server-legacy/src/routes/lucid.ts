import express from 'express';
import { lucidV1, LucidInput } from '../agents/LUCID';

const router = express.Router();

router.post('/', (req, res) => {
  const input: LucidInput = req.body;

  try {
    const result = lucidV1(input);
    return res.json({
      status: "success",
      routedTo: result.nextAgent,
      instructions: result.instructions,
      fallbackOptions: result.fallbackOptions
    });
  } catch (err) {
    console.error("🧠 LUCID error:", err);
    return res.status(500).json({ error: 'LUCID routing failed.' });
  }
});

export default router;