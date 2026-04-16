import express from 'express';
import { runLucid, runCanvas, runRoot } from '../lib/agents';

const router = express.Router();

router.post('/', async (req, res) => {
  const { dreamCore } = req.body;

  if (!dreamCore) {
    return res.status(400).json({ status: 'error', message: 'No Dream Core provided.' });
  }

  try {
    const lucidData = await runLucid(dreamCore);
    const canvasData = await runCanvas(dreamCore);
    const rootData = await runRoot(dreamCore);

    const updatedCore = {
      ...dreamCore,
      lucidData,
      componentCode: canvasData.componentCode,
      schema: rootData.schema
    };

    return res.json({ status: 'success', dreamCore: updatedCore });
  } catch (err: any) {
    console.error("🔥 Reactivation error:", err);
    return res.status(500).json({ status: 'error', message: 'Agent re-run failed.' });
  }
});

export default router;