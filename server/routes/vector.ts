import { Router } from "express";
import {
  getVectorEvent,
  getVectorHistory,
  logVectorEvent,
  verifyVectorEvent,
} from "../vector-ledger/service";

const router = Router();

router.post("/log", async (req, res) => {
  try {
    const { objectType, objectId, model, vector, payload, hashAlgo } = req.body ?? {};
    if (!objectType || !objectId || !model) {
      return res.status(400).json({ success: false, error: "objectType, objectId, and model are required" });
    }

    const record = await logVectorEvent({
      objectType,
      objectId,
      model,
      vector,
      payload,
      hashAlgo,
    });

    return res.status(201).json({
      success: true,
      event: record,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message ?? "Failed to log vector event",
    });
  }
});

router.get("/history", async (req, res) => {
  const objectType = String(req.query.objectType ?? "");
  const objectId = String(req.query.objectId ?? "");
  const limit = req.query.limit ? Number(req.query.limit) : 100;

  if (!objectType || !objectId) {
    return res.status(400).json({ success: false, error: "objectType and objectId are required" });
  }

  const history = await getVectorHistory(objectType, objectId, limit);
  return res.json({
    success: true,
    events: history,
  });
});

router.get("/proof", async (req, res) => {
  const id = String(req.query.id ?? "");
  if (!id) {
    return res.status(400).json({ success: false, error: "id is required" });
  }

  const event = await getVectorEvent(id);
  if (!event) {
    return res.status(404).json({ success: false, error: "not_found" });
  }

  return res.json({
    success: true,
    event,
  });
});

router.post("/verify", async (req, res) => {
  const { id, vector, payload } = req.body ?? {};
  if (!id) {
    return res.status(400).json({ success: false, error: "id is required" });
  }

  const result = await verifyVectorEvent({ id, vector, payload });
  return res.json({
    success: result.ok,
    ...result,
  });
});

export default router;
