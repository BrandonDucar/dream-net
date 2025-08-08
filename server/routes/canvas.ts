import express from 'express';
import { canvasAgent, CanvasInput } from '../agents/CANVAS';

const router = express.Router();

router.post('/', async (req, res) => {
  const input: CanvasInput = req.body;
  try {
    const result = await canvasAgent(input);
    return res.json(result);
  } catch (err) {
    console.error("🎨 CANVAS error:", err);
    return res.status(500).json({ 
      status: 'error',
      message: 'CANVAS processing failed.' 
    });
  }
});

export default router;