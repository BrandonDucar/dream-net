/**
 * Billable Actions API Routes
 * Two-phase commit pattern for financial operations
 */

import express from "express";
import { getBillableAction, getBillableStats } from "../middleware/billable";

const router = express.Router();

// GET /api/billable/stats - Get billable action statistics
router.get("/stats", (req, res) => {
  try {
    const stats = getBillableStats();
    res.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/billable/:actionId - Get billable action status
router.get("/:actionId", (req, res) => {
  try {
    const actionId = req.params.actionId;
    const action = getBillableAction(actionId);
    
    if (!action) {
      return res.status(404).json({
        success: false,
        error: "Action not found",
      });
    }
    
    res.json({
      success: true,
      action,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

