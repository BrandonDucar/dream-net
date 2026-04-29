import { NERVE_BUS } from '@dreamnet/nerve';
import type { NerveEvent, NerveTransport } from '@dreamnet/nerve';
import { natsService } from './NatsService.js';
import { vertexAIService } from './VertexAIService.js';
import { apiHopper } from '../../packages/api/src/services/APIHopperService.js';

export interface BrainTask {
  id: string;
  type: 'CODE_GENERATION' | 'CODE_REVIEW' | 'ARCHITECTURAL_DECISION' | 'SWARM_OPTIMIZATION';
  context: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
  brainType: 'GOOSE' | 'PI' | 'ANY';
}

/**
 * 🧠 BrainBridge
 * Connects high-level AI reasoning (Goose/Pi Brains) to the Nerve Bus.
 * Listens for system-wide reinforcement requests and delegates to Vertex AI or Claude.
 */
export class BrainBridge {
  private static instance: BrainBridge;
  private taskHistory: BrainTask[] = [];

  private constructor() {
    this.setupListeners();
  }

  public static getInstance(): BrainBridge {
    if (!BrainBridge.instance) {
      BrainBridge.instance = new BrainBridge();
    }
    return BrainBridge.instance;
  }

  private setupListeners() {
    console.log("🧠 [BrainBridge] Listening for advanced reasoning tasks...");

    // Listen for reinforcement requests from the Nerve Bus
    NERVE_BUS.subscribe('System.ReinforcementRequested', async (event) => {
      await this.handleReinforcementRequest(event);
    });

    // Listen for direct swarm tasks from NATS
    natsService.subscribe('dreamnet.swarm.task', async (data: BrainTask) => {
      await this.processTask(data);
    });
  }

  private async handleReinforcementRequest(event: any) {
    const task: BrainTask = {
      id: `task-${Date.now()}`,
      type: 'SWARM_OPTIMIZATION',
      context: event.payload,
      priority: 'high',
      brainType: 'ANY'
    };
    await this.processTask(task);
  }

  public async processTask(task: BrainTask) {
    console.log(`🧠 [BrainBridge] Processing task ${task.id} (${task.type}) using ${task.brainType}...`);
    this.taskHistory.push(task);

    try {
      let response;
      if (task.brainType === 'PI' || (task.brainType === 'ANY' && Math.random() > 0.5)) {
        // Use Vertex AI (Pi Brain)
        response = await vertexAIService.generateContent(`Process task: ${task.type} with context ${JSON.stringify(task.context)}`);
      } else {
        // Use APIHopper (handles Claude/Goose, Groq, etc.)
        const result = await apiHopper.query(
          "You are the DreamNet Goose Brain.",
          `Process task: ${task.type} with context ${JSON.stringify(task.context)}`,
          { providerId: 'groq' } // Default to a free fast provider if preferred
        );
        response = result.response;
      }

      console.log(`✅ [BrainBridge] Task ${task.id} complete.`);
      
      // Publish result back to the bus
      await natsService.publish(`dreamnet.swarm.task_result.${task.id}`, {
        taskId: task.id,
        status: 'success',
        result: response,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error(`❌ [BrainBridge] Task ${task.id} failed:`, error);
      await natsService.publish(`dreamnet.swarm.task_result.${task.id}`, {
        taskId: task.id,
        status: 'error',
        error: (error as Error).message
      });
    }
  }

  public getStatus() {
    return {
      activeTasks: this.taskHistory.filter(t => !t.context?.completed).length,
      totalProcessed: this.taskHistory.length,
      lastTask: this.taskHistory[this.taskHistory.length - 1]
    };
  }
}

export const brainBridge = BrainBridge.getInstance();
