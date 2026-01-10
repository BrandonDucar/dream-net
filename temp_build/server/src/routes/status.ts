import { Router } from "express";
import { sql } from "drizzle-orm";
import { db } from "../db";
import { listMetrics } from "../trust/metrics";

const router: Router = Router();

router.get("/trust", async (_req, res) => {
  const { executeWithCircuitBreaker } = await import('../core/db-circuit-breaker');

  const vectorRoots = await executeWithCircuitBreaker('status-vector-roots', async (d) => d.execute(sql`
    SELECT * FROM dreamnet_trust.vector_roots ORDER BY batch_date DESC LIMIT 5
  `));

  const zkRoots = await executeWithCircuitBreaker('status-zk-roots', async (d) => d.execute(sql`
    SELECT * FROM dreamnet_trust.zk_roots ORDER BY batch_date DESC LIMIT 5
  `));

  const watchdogAlerts = await executeWithCircuitBreaker('status-watchdog-alerts', async (d) => d.execute(sql`
    SELECT alert_id, severity, message, created_at
    FROM dreamnet_trust.watchdog_alerts
    ORDER BY created_at DESC
    LIMIT 5
  `));

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
