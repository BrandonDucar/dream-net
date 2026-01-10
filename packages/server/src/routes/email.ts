import { Router } from "express";
import { dreamNetEmail } from "../email/DreamNetEmail";

export function createEmailRouter(): Router {
  const router = Router();

  // POST /api/email/send - Send email
  router.post("/email/send", async (req, res) => {
    try {
      const { to, subject, body, html, metadata } = req.body;
      if (!to || !subject || !body) {
        return res.status(400).json({ error: "to, subject, and body are required" });
      }

      const message = await dreamNetEmail.sendEmail(to, subject, body, html, metadata);
      res.json({ ok: true, message });
    } catch (error) {
      console.error("Failed to send email:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/email/outreach - Generate and send outreach email
  router.post("/email/outreach", async (req, res) => {
    try {
      const { template, variables, to } = req.body;
      if (!template || !to) {
        return res.status(400).json({ error: "template and to are required" });
      }

      const { subject, body, html } = await dreamNetEmail.generateOutreachEmail(
        template,
        variables || {}
      );

      const message = await dreamNetEmail.sendEmail(to, subject, body, html, {
        type: "outreach",
        template,
      });

      res.json({ ok: true, message });
    } catch (error) {
      console.error("Failed to send outreach email:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/email/history - Get email history
  router.get("/email/history", async (req, res) => {
    try {
      const limit = parseInt(String(req.query.limit || 50), 10);
      const history = dreamNetEmail.getEmailHistory(limit);
      res.json({ ok: true, messages: history });
    } catch (error) {
      console.error("Failed to get email history:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/email/configure - Configure email provider
  router.post("/email/configure", async (req, res) => {
    try {
      const config = req.body;
      dreamNetEmail.configure(config);
      res.json({ ok: true, message: "Email configuration updated" });
    } catch (error) {
      console.error("Failed to configure email:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}

