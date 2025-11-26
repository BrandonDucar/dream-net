/**
 * Data Integrity API Routes
 * Endpoints for data integrity operations
 */

import { Router } from "express";

const router = Router();

/**
 * GET /api/data-integrity/status
 * Get data integrity core status
 */
router.get("/status", (req, res) => {
  try {
    const dataIntegrityCore = (global as any).dataIntegrityCore;
    if (!dataIntegrityCore) {
      return res.status(503).json({
        error: "Data Integrity Core not initialized",
      });
    }

    const status = dataIntegrityCore.getStatus();
    res.json({
      success: true,
      status,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to get data integrity status",
      message: error.message,
    });
  }
});

/**
 * POST /api/data-integrity/hash
 * Hash data and queue for blockchain submission
 */
router.post("/hash", async (req, res) => {
  try {
    const dataIntegrityCore = (global as any).dataIntegrityCore;
    if (!dataIntegrityCore) {
      return res.status(503).json({
        error: "Data Integrity Core not initialized",
      });
    }

    const { data, dataType } = req.body;

    if (!data || !dataType) {
      return res.status(400).json({
        error: "data and dataType are required",
      });
    }

    const hash = await dataIntegrityCore.hashData(data, dataType);

    res.json({
      success: true,
      hash,
      queued: true,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to hash data",
      message: error.message,
    });
  }
});

/**
 * GET /api/data-integrity/verify/:hash
 * Verify hash exists on blockchain
 */
router.get("/verify/:hash", async (req, res) => {
  try {
    const dataIntegrityCore = (global as any).dataIntegrityCore;
    if (!dataIntegrityCore) {
      return res.status(503).json({
        error: "Data Integrity Core not initialized",
      });
    }

    const { hash } = req.params;
    const exists = await dataIntegrityCore.verifyHash(hash);

    res.json({
      success: true,
      hash,
      exists,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to verify hash",
      message: error.message,
    });
  }
});

/**
 * GET /api/data-integrity/pending
 * Get pending hashes in queue
 */
router.get("/pending", (req, res) => {
  try {
    const dataIntegrityCore = (global as any).dataIntegrityCore;
    if (!dataIntegrityCore) {
      return res.status(503).json({
        error: "Data Integrity Core not initialized",
      });
    }

    const pending = dataIntegrityCore.getPendingHashes();

    res.json({
      success: true,
      pending,
      count: pending.length,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to get pending hashes",
      message: error.message,
    });
  }
});

/**
 * GET /api/data-integrity/batches
 * Get all batches
 */
router.get("/batches", (req, res) => {
  try {
    const dataIntegrityCore = (global as any).dataIntegrityCore;
    if (!dataIntegrityCore) {
      return res.status(503).json({
        error: "Data Integrity Core not initialized",
      });
    }

    const batches = dataIntegrityCore.getAllBatches();

    res.json({
      success: true,
      batches,
      count: batches.length,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to get batches",
      message: error.message,
    });
  }
});

/**
 * GET /api/data-integrity/batches/:batchId
 * Get specific batch
 */
router.get("/batches/:batchId", (req, res) => {
  try {
    const dataIntegrityCore = (global as any).dataIntegrityCore;
    if (!dataIntegrityCore) {
      return res.status(503).json({
        error: "Data Integrity Core not initialized",
      });
    }

    const { batchId } = req.params;
    const batch = dataIntegrityCore.getBatch(batchId);

    if (!batch) {
      return res.status(404).json({
        error: "Batch not found",
      });
    }

    res.json({
      success: true,
      batch,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to get batch",
      message: error.message,
    });
  }
});

export default router;

