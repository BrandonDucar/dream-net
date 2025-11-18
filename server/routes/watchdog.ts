import { Router } from "express";
import { sql } from "drizzle-orm";
import { db } from "../db";

const router: Router = Router();
const ALERTS = "dreamnet_trust.watchdog_alerts";

router.get("/alerts", async (_req, res) => {
  const result = await db.execute(sql`
    SELECT alert_id, severity, message, diff, created_at
    FROM ${sql.raw(ALERTS)}
    ORDER BY created_at DESC
    LIMIT 100
  `);
  res.json({ success: true, alerts: result.rows });
});

export default router;
