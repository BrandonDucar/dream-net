import { Router } from "express";
import { getAttestation, proveContent, verifyContent } from "../zk/service";

const router: Router = Router();

router.post("/prove", async (req, res) => {
  try {
    const { payload } = req.body ?? {};
    if (!payload) {
      return res.status(400).json({ success: false, error: "payload required" });
    }

    const result = await proveContent(payload);
    res.status(201).json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message ?? "Failed to generate proof",
    });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { payload, proof, publicSignals } = req.body ?? {};
    if (!payload || !proof || !publicSignals) {
      return res.status(400).json({ success: false, error: "payload, proof, publicSignals required" });
    }

    const result = await verifyContent(payload, proof, publicSignals);
    res.json({ success: result.ok, ...result });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message ?? "Failed to verify proof",
    });
  }
});

router.get("/attestation", async (req, res) => {
  const contentHash = String(req.query.contentHash ?? "");
  if (!contentHash) {
    return res.status(400).json({ success: false, error: "contentHash required" });
  }

  const attestation = await getAttestation(contentHash);
  if (!attestation) {
    return res.status(404).json({ success: false, error: "not_found" });
  }

  res.json({ success: true, attestation });
});

export default router;
