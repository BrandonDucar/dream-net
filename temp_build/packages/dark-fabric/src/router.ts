import { Router } from "express";
import {
  createFabricTask,
  getFabricTask,
  listFabricTasks,
  updateFabricTask,
  runFabricTask,
  approveFabricTask,
  rejectFabricTask,
} from "./fabricEngine";

export function createFabricRouter(): Router {
  const router = Router();

  router.get("/fabric/tasks", (req, res) => {
    const filters = {
      type: req.query.type as any,
      status: req.query.status as any,
    };
    const tasks = listFabricTasks(filters);
    res.json({ ok: true, tasks });
  });

  router.get("/fabric/tasks/:id", (req, res) => {
    const task = getFabricTask(req.params.id);
    if (!task) {
      res.status(404).json({ ok: false, error: "Task not found" });
      return;
    }
    res.json({ ok: true, task });
  });

  router.post("/fabric/tasks", (req, res) => {
    try {
      const task = createFabricTask(req.body);
      res.json({ ok: true, task });
    } catch (error) {
      res.status(400).json({ ok: false, error: (error as Error).message });
    }
  });

  router.put("/fabric/tasks/:id", (req, res) => {
    const task = updateFabricTask(req.params.id, req.body);
    if (!task) {
      res.status(404).json({ ok: false, error: "Task not found" });
      return;
    }
    res.json({ ok: true, task });
  });

  router.post("/fabric/tasks/:id/run", async (req, res) => {
    try {
      const task = await runFabricTask(req.params.id);
      res.json({ ok: true, task });
    } catch (error) {
      res.status(400).json({ ok: false, error: (error as Error).message });
    }
  });

  router.post("/fabric/tasks/:id/approve", (req, res) => {
    const approvedBy = req.body.approvedBy || "system";
    const reason = req.body.reason;
    const task = approveFabricTask(req.params.id, approvedBy, reason);
    if (!task) {
      res.status(404).json({ ok: false, error: "Task not found" });
      return;
    }
    res.json({ ok: true, task });
  });

  router.post("/fabric/tasks/:id/reject", (req, res) => {
    const rejectedBy = req.body.rejectedBy || "system";
    const reason = req.body.reason;
    const task = rejectFabricTask(req.params.id, rejectedBy, reason);
    if (!task) {
      res.status(404).json({ ok: false, error: "Task not found" });
      return;
    }
    res.json({ ok: true, task });
  });

  return router;
}

