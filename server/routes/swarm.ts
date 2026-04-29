import { Router, Request, Response } from "express";
import { superSpine } from "../core/SuperSpine.js";
import { brainBridge } from "../services/BrainBridge.js";
import { wolfPackFundingHunter } from "../agents/WolfPackFundingHunter.js";
import { aryaExecutioner } from "../agents/AryaStarkAgent.js";
import { natsService } from "../services/NatsService.js";
import { guildSystem } from "../core/GuildSystem.js";
import { swarmDaemon } from "../services/SwarmDaemon.js";

const router = Router();

/**
 * GET /api/swarm/status
 * Comprehensive status of the DreamNet swarm.
 */
router.get("/status", async (req: Request, res: Response) => {
  try {
    const agents = superSpine.getAllAgents();
    const brainStatus = brainBridge.getStatus();
    const wolfPackStatus = wolfPackFundingHunter.getStatus();
    const aryaStatus = (aryaExecutioner as any).getStatus?.() || { status: 'active' };
    const guildStatus = guildSystem.getStatus();
    const daemonStatus = swarmDaemon.getStatus();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      swarm: {
        totalAgents: agents.length,
        activeAgents: agents.filter(a => a.status === 'active').length,
      },
      advancedReasoning: {
        brainBridge: brainStatus,
        providers: ['VertexAI (Pi)', 'Claude 3.5 (Goose)', 'Groq', 'Ollama'],
      },
      specializedAgents: {
        wolfPack: wolfPackStatus,
        aryaStark: aryaStatus,
      },
      infrastructure: {
        nats: 'connected',
        nerveBus: 'active',
        superSpine: 'stable',
        daemon: daemonStatus,
        guilds: guildStatus
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/swarm/dispatch
 * Send a manual task to the Goose/Pi Brains.
 */
router.post("/dispatch", async (req: Request, res: Response) => {
  const { type, context, brainType } = req.body;
  
  if (!type || !context) {
    return res.status(400).json({ error: "Missing type or context" });
  }

  const taskId = `manual-${Date.now()}`;
  await natsService.publish('dreamnet.swarm.task', {
    id: taskId,
    type,
    context,
    priority: 'high',
    brainType: brainType || 'ANY'
  });

  res.json({
    success: true,
    message: "Task dispatched to BrainBridge",
    taskId
  });
});

export default router;
