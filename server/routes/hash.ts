import { Router } from "express";
import { availableAlgos, hashBuffer } from "../trust/hash";

const router = Router();

router.get("/bench", async (_req, res) => {
  const payload = Buffer.alloc(1024 * 1024, "dreamnet"); // 1MB sample
  const results: Record<string, { iterations: number; elapsedMs: number }> = {};

  for (const algo of availableAlgos()) {
    const iterations = 50;
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      hashBuffer(payload, algo);
    }
    const elapsed = performance.now() - start;
    results[algo] = { iterations, elapsedMs: elapsed };
  }

  res.json({ success: true, results });
});

router.get("/algorithms", (_req, res) => {
  res.json({ success: true, algorithms: availableAlgos() });
});

export default router;
