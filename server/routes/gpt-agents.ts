/**
 * GPT Agent Registry API Routes
 */

import { Router, Request, Response } from "express";
import { gptAgentRegistry } from "../gpt-agents/GPTAgentRegistry";
import { cleanGPTId } from "../gpt-agents/mappers";

export function createGPTAgentsRouter(): Router {
  const router = Router();

  // POST /api/gpt-agents/register - Register a specific GPT
  router.post("/register", async (req: Request, res: Response) => {
    try {
      const { gptName } = req.body;
      if (!gptName) {
        return res.status(400).json({ error: "gptName is required" });
      }

      const gpts = gptAgentRegistry.getAllGPTs();
      const gpt = gpts.find((g) => g.name === gptName || cleanGPTId(g.name) === cleanGPTId(gptName));

      if (!gpt) {
        return res.status(404).json({ error: `GPT not found: ${gptName}` });
      }

      const registration = await gptAgentRegistry.registerGPT(gpt);

      res.json({
        ok: true,
        registration,
        message: `GPT ${gpt.name} registered successfully`,
      });
    } catch (error: any) {
      console.error("Failed to register GPT:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/gpt-agents/bulk-register - Register all GPTs
  router.post("/bulk-register", async (req: Request, res: Response) => {
    try {
      const results = await gptAgentRegistry.registerAll();

      res.json({
        ok: true,
        results,
        message: `Registration complete: ${results.success} succeeded, ${results.failed} failed`,
      });
    } catch (error: any) {
      console.error("Failed to bulk register GPTs:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/gpt-agents - List all GPTs with registration status
  router.get("/", async (req: Request, res: Response) => {
    try {
      const gpts = gptAgentRegistry.getAllGPTs();
      const statuses = gpts.map((gpt) => gptAgentRegistry.getStatus(gpt.name)).filter((s) => s !== null);

      res.json({
        ok: true,
        gpts: statuses,
        count: statuses.length,
      });
    } catch (error: any) {
      console.error("Failed to list GPTs:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/gpt-agents/:gptId - Get specific GPT status
  router.get("/:gptId", async (req: Request, res: Response) => {
    try {
      const { gptId } = req.params;
      const status = gptAgentRegistry.getStatus(gptId);

      if (!status) {
        return res.status(404).json({ error: `GPT not found: ${gptId}` });
      }

      res.json({
        ok: true,
        status,
      });
    } catch (error: any) {
      console.error("Failed to get GPT status:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/gpt-agents/:gptId/heartbeat - Record GPT heartbeat
  router.post("/:gptId/heartbeat", async (req: Request, res: Response) => {
    try {
      const { gptId } = req.params;
      gptAgentRegistry.recordHeartbeat(gptId);

      res.json({
        ok: true,
        message: `Heartbeat recorded for ${gptId}`,
      });
    } catch (error: any) {
      console.error("Failed to record heartbeat:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/gpt-agents/stats - Get registry statistics
  router.get("/stats", async (req: Request, res: Response) => {
    try {
      const stats = gptAgentRegistry.getStats();

      res.json({
        ok: true,
        stats,
      });
    } catch (error: any) {
      console.error("Failed to get stats:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/gpt-agents/registered - Get only registered GPTs
  router.get("/registered", async (req: Request, res: Response) => {
    try {
      const registered = gptAgentRegistry.getRegisteredGPTs();

      res.json({
        ok: true,
        registered,
        count: registered.length,
      });
    } catch (error: any) {
      console.error("Failed to get registered GPTs:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================================================
  // GPT-to-GPT Communication Endpoints
  // ============================================================================

  // POST /api/gpt-agents/:gptId/message - Send message to GPT
  router.post("/:gptId/message", async (req: Request, res: Response) => {
    try {
      const { gptId } = req.params;
      const { from, text, topic, meta } = req.body;

      if (!from || !text) {
        return res.status(400).json({ error: "from and text are required" });
      }

      const { gptCommunicationBridge } = await import("../gpt-agents/GPTCommunicationBridge");
      const result = await gptCommunicationBridge.sendMessage({
        from,
        to: gptId,
        topic,
        text,
        meta,
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json({
        ok: true,
        messageId: result.messageId,
        message: "Message sent successfully",
      });
    } catch (error: any) {
      console.error("Failed to send message:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/gpt-agents/:gptId/query - Query GPT with natural language
  router.post("/:gptId/query", async (req: Request, res: Response) => {
    try {
      const { gptId } = req.params;
      const { from, query, context, sessionId } = req.body;

      if (!from || !query) {
        return res.status(400).json({ error: "from and query are required" });
      }

      const { gptCommunicationBridge } = await import("../gpt-agents/GPTCommunicationBridge");
      const result = await gptCommunicationBridge.queryGPT({
        from,
        to: gptId,
        query,
        context,
        sessionId,
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json({
        ok: true,
        response: result.response,
      });
    } catch (error: any) {
      console.error("Failed to query GPT:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/gpt-agents/:gptId/messages - Get message history
  router.get("/:gptId/messages", async (req: Request, res: Response) => {
    try {
      const { gptId } = req.params;
      const { from, limit } = req.query;

      if (!from) {
        return res.status(400).json({ error: "from parameter is required" });
      }

      const { gptCommunicationBridge } = await import("../gpt-agents/GPTCommunicationBridge");
      const history = gptCommunicationBridge.getMessageHistory(
        from as string,
        gptId,
        limit ? parseInt(limit as string, 10) : undefined
      );

      res.json({
        ok: true,
        history,
      });
    } catch (error: any) {
      console.error("Failed to get messages:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/gpt-agents/broadcast - Broadcast to multiple GPTs
  router.post("/broadcast", async (req: Request, res: Response) => {
    try {
      const { from, toGPTs, message, topic, meta } = req.body;

      if (!from || !toGPTs || !Array.isArray(toGPTs) || !message) {
        return res.status(400).json({ error: "from, toGPTs (array), and message are required" });
      }

      const { gptCommunicationBridge } = await import("../gpt-agents/GPTCommunicationBridge");
      const results = await gptCommunicationBridge.broadcast(from, toGPTs, message, { topic, meta });

      res.json({
        ok: true,
        results,
      });
    } catch (error: any) {
      console.error("Failed to broadcast:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================================================
  // GPT Workflow Endpoints
  // ============================================================================

  // POST /api/gpt-workflows/create - Create a workflow
  router.post("/workflows/create", async (req: Request, res: Response) => {
    try {
      const { steps, name, description, parallel, metadata } = req.body;

      if (!steps || !Array.isArray(steps) || steps.length === 0) {
        return res.status(400).json({ error: "steps array is required" });
      }

      const { gptOrchestrator } = await import("../gpt-agents/GPTOrchestrator");
      const workflow = gptOrchestrator.createWorkflow(steps, {
        name,
        description,
        parallel,
        metadata,
      });

      res.json({
        ok: true,
        workflow,
      });
    } catch (error: any) {
      console.error("Failed to create workflow:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/gpt-workflows/:workflowId/execute - Execute workflow
  router.post("/workflows/:workflowId/execute", async (req: Request, res: Response) => {
    try {
      const { workflowId } = req.params;

      const { gptOrchestrator } = await import("../gpt-agents/GPTOrchestrator");
      const workflow = await gptOrchestrator.executeWorkflow(workflowId);

      res.json({
        ok: true,
        workflow,
      });
    } catch (error: any) {
      console.error("Failed to execute workflow:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/gpt-workflows/:workflowId - Get workflow status
  router.get("/workflows/:workflowId", async (req: Request, res: Response) => {
    try {
      const { workflowId } = req.params;

      const { gptOrchestrator } = await import("../gpt-agents/GPTOrchestrator");
      const workflow = gptOrchestrator.getWorkflow(workflowId);

      if (!workflow) {
        return res.status(404).json({ error: `Workflow not found: ${workflowId}` });
      }

      const execution = gptOrchestrator.getExecutionStatus(workflowId);

      res.json({
        ok: true,
        workflow,
        execution,
      });
    } catch (error: any) {
      console.error("Failed to get workflow:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/gpt-workflows - List all workflows
  router.get("/workflows", async (req: Request, res: Response) => {
    try {
      const { gptOrchestrator } = await import("../gpt-agents/GPTOrchestrator");
      const workflows = gptOrchestrator.getAllWorkflows();

      res.json({
        ok: true,
        workflows,
        count: workflows.length,
      });
    } catch (error: any) {
      console.error("Failed to list workflows:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/gpt-workflows/:workflowId/cancel - Cancel workflow
  router.post("/workflows/:workflowId/cancel", async (req: Request, res: Response) => {
    try {
      const { workflowId } = req.params;

      const { gptOrchestrator } = await import("../gpt-agents/GPTOrchestrator");
      const cancelled = gptOrchestrator.cancelWorkflow(workflowId);

      if (!cancelled) {
        return res.status(404).json({ error: `Workflow not found or not running: ${workflowId}` });
      }

      res.json({
        ok: true,
        message: "Workflow cancelled",
      });
    } catch (error: any) {
      console.error("Failed to cancel workflow:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/gpt-fleets/:category/orchestrate - Orchestrate entire fleet
  router.post("/fleets/:category/orchestrate", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const { objective, steps } = req.body;

      if (!objective) {
        return res.status(400).json({ error: "objective is required" });
      }

      // Get GPTs in this category
      const { customGPTFleetSystem } = await import("../fleets/CustomGPTFleetSystem");
      const fleet = customGPTFleetSystem.getFleet(category);

      if (!fleet) {
        return res.status(404).json({ error: `Fleet not found: ${category}` });
      }

      // If steps provided, use them; otherwise create default workflow
      let workflowSteps = steps;
      if (!workflowSteps) {
        // Create default workflow: message all GPTs in fleet
        workflowSteps = fleet.gpts.map((gpt, index) => ({
          stepId: `step-${index + 1}`,
          gpt: gpt.name,
          action: "message",
          params: {
            message: objective,
            topic: "fleet-orchestration",
          },
        }));
      }

      const { gptOrchestrator } = await import("../gpt-agents/GPTOrchestrator");
      const workflow = gptOrchestrator.createWorkflow(workflowSteps, {
        name: `${fleet.name} Orchestration`,
        description: objective,
        parallel: true, // Fleet operations typically parallel
        metadata: {
          category,
          fleetId: fleet.id,
          objective,
        },
      });

      // Execute workflow
      const executed = await gptOrchestrator.executeWorkflow(workflow.workflowId);

      res.json({
        ok: true,
        workflow: executed,
        fleet: {
          id: fleet.id,
          name: fleet.name,
          gptCount: fleet.gpts.length,
        },
      });
    } catch (error: any) {
      console.error("Failed to orchestrate fleet:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================================================
  // GPT Memory Endpoints
  // ============================================================================

  // POST /api/gpt-agents/:gptId/memory/store - Store GPT output as dream
  router.post("/:gptId/memory/store", async (req: Request, res: Response) => {
    try {
      const { gptId } = req.params;
      const { title, content, description, type, tags, metadata } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: "title and content are required" });
      }

      const { gptMemoryBridge } = await import("../gpt-agents/GPTMemoryBridge");
      const result = await gptMemoryBridge.storeGPTOutput(gptId, {
        title,
        content,
        description,
        type,
        tags,
        metadata,
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json({
        ok: true,
        dreamId: result.dreamId,
        entryId: result.entryId,
        message: "GPT output stored as dream",
      });
    } catch (error: any) {
      console.error("Failed to store GPT memory:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/gpt-agents/:gptId/memory - Get GPT memory entries
  router.get("/:gptId/memory", async (req: Request, res: Response) => {
    try {
      const { gptId } = req.params;
      const { type, since, limit, tags } = req.query;

      const { gptMemoryBridge } = await import("../gpt-agents/GPTMemoryBridge");
      const entries = gptMemoryBridge.queryGPTMemory({
        gptId,
        type: type as any,
        since: since as string,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        tags: tags ? (Array.isArray(tags) ? tags : [tags as string]) : undefined,
      });

      res.json({
        ok: true,
        entries,
        count: entries.length,
      });
    } catch (error: any) {
      console.error("Failed to get GPT memory:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/gpt-agents/:gptId/memory/stats - Get GPT memory statistics
  router.get("/:gptId/memory/stats", async (req: Request, res: Response) => {
    try {
      const { gptId } = req.params;

      const { gptMemoryBridge } = await import("../gpt-agents/GPTMemoryBridge");
      const stats = gptMemoryBridge.getGPTMemoryStats(gptId);

      if (!stats) {
        return res.status(404).json({ error: `GPT not found or has no memory: ${gptId}` });
      }

      res.json({
        ok: true,
        stats,
      });
    } catch (error: any) {
      console.error("Failed to get GPT memory stats:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/gpt-agents/memory/search - Search all GPT memory
  router.get("/memory/search", async (req: Request, res: Response) => {
    try {
      const { q, gptId, limit } = req.query;

      if (!q) {
        return res.status(400).json({ error: "q (query) parameter is required" });
      }

      const { gptMemoryBridge } = await import("../gpt-agents/GPTMemoryBridge");
      const entries = gptMemoryBridge.searchMemory(q as string, {
        gptId: gptId as string,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      res.json({
        ok: true,
        entries,
        count: entries.length,
      });
    } catch (error: any) {
      console.error("Failed to search GPT memory:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/gpt-agents/memory/gpts - Get all GPTs with memory
  router.get("/memory/gpts", async (req: Request, res: Response) => {
    try {
      const { gptMemoryBridge } = await import("../gpt-agents/GPTMemoryBridge");
      const gpts = gptMemoryBridge.getGPTsWithMemory();

      res.json({
        ok: true,
        gpts,
        count: gpts.length,
      });
    } catch (error: any) {
      console.error("Failed to get GPTs with memory:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================================================
  // GPT Event Streaming Endpoints
  // ============================================================================

  // POST /api/gpt-agents/:gptId/events/emit - Emit GPT event
  router.post("/:gptId/events/emit", async (req: Request, res: Response) => {
    try {
      const { gptId } = req.params;
      const { eventType, payload } = req.body;

      if (!eventType) {
        return res.status(400).json({ error: "eventType is required" });
      }

      const { gptEventStream } = await import("../gpt-agents/GPTEventStream");
      const result = await gptEventStream.emitGPTEvent(gptId, eventType, payload || {});

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json({
        ok: true,
        eventId: result.eventId,
        message: "Event emitted successfully",
      });
    } catch (error: any) {
      console.error("Failed to emit GPT event:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/gpt-agents/events/stream - Stream GPT events (SSE)
  router.get("/events/stream", async (req: Request, res: Response) => {
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    res.flushHeaders?.();

    const { gptId, eventTypes, topics } = req.query;

    const { gptEventStream } = await import("../gpt-agents/GPTEventStream");
    const { StarbridgeTopic } = await import("../starbridge/types");

    // Parse topics
    const parsedTopics = topics
      ? (topics as string)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .map((t) => t as StarbridgeTopic)
      : undefined;

    // Parse event types
    const parsedEventTypes = eventTypes
      ? (eventTypes as string)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : undefined;

    // Subscribe to events
    const subscriptionId = gptEventStream.subscribe(
      (event) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      },
      {
        gptId: gptId as string,
        eventTypes: parsedEventTypes as any,
        topics: parsedTopics,
      }
    );

    res.write(": connected\n\n");

    // Heartbeat
    const heartbeat = setInterval(() => {
      res.write(": ping\n\n");
    }, 15000);

    req.on("close", () => {
      clearInterval(heartbeat);
      gptEventStream.unsubscribe(subscriptionId);
    });
  });

  // GET /api/gpt-agents/events/subscriptions - Get active subscriptions
  router.get("/events/subscriptions", async (req: Request, res: Response) => {
    try {
      const { gptEventStream } = await import("../gpt-agents/GPTEventStream");
      const subscriptions = gptEventStream.getSubscriptions();

      res.json({
        ok: true,
        subscriptions: subscriptions.map((sub) => ({
          subscriptionId: sub.subscriptionId,
          gptId: sub.gptId,
          eventTypes: sub.eventTypes,
          topics: sub.topics,
        })),
        count: subscriptions.length,
      });
    } catch (error: any) {
      console.error("Failed to get subscriptions:", error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

