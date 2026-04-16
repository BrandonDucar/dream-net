import { Router } from "express";
import { sql } from "drizzle-orm";
import { db } from "../db";
import { listMetrics } from "../trust/metrics";

const router: Router = Router();

router.get("/trust", async (_req, res) => {
  const vectorRoots = await db.execute(sql`
    SELECT * FROM dreamnet_trust.vector_roots ORDER BY batch_date DESC LIMIT 5
  `);

  const zkRoots = await db.execute(sql`
    SELECT * FROM dreamnet_trust.zk_roots ORDER BY batch_date DESC LIMIT 5
  `);

  const watchdogAlerts = await db.execute(sql`
    SELECT alert_id, severity, message, created_at
    FROM dreamnet_trust.watchdog_alerts
    ORDER BY created_at DESC
    LIMIT 5
  `);

  const metrics = await listMetrics();

  res.json({
    success: true,
    vectorRoots: vectorRoots.rows,
    zkRoots: zkRoots.rows,
    watchdogAlerts: watchdogAlerts.rows,
    metrics,
  });
});

export default router;
