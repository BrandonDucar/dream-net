import { natsService } from './NatsService.js';
import { IftttService } from './IftttService.js';

export interface SwarmAgent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'offline';
  lastHeartbeat: number;
  metadata: Record<string, any>;
}

export class OnboardingRegistry {
  private static agents: Map<string, SwarmAgent> = new Map();
  private static heartbeatInterval: NodeJS.Timeout | null = null;

  public static async initialize() {
    console.log("🐝 [Onboarding Registry] Initializing Swarm Discovery...");

    // Subscribe to self-discovery events
    natsService.subscribe('dreamnet.swarm.onboarding', async (agent: any) => {
      this.registerAgent(agent);
    });

    // Start health monitoring loop
    this.startHealthCheck();

    console.log("🐝 [Onboarding Registry] Ready for 500+ agent swarm.");
  }

  private static registerAgent(agent: any) {
    const id = agent.id || `agent_${Math.random().toString(36).substr(2, 9)}`;
    const newAgent: SwarmAgent = {
      id,
      name: agent.name || 'Unknown Agent',
      type: agent.type || 'generic',
      status: 'active',
      lastHeartbeat: Date.now(),
      metadata: agent.metadata || {}
    };

    this.agents.set(id, newAgent);
    console.log(`🐝 [Onboarding Registry] Registered agent: ${newAgent.name} (${id})`);

    // Notify external world via IFTTT
    IftttService.triggerWebhook('agent_onboarded', {
      value1: newAgent.name,
      value2: newAgent.type,
      value3: newAgent.id
    });
  }

  private static startHealthCheck() {
    if (this.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();
      const timeout = 60 * 1000; // 1 minute timeout

      this.agents.forEach((agent, id) => {
        if (now - agent.lastHeartbeat > timeout && agent.status !== 'offline') {
          agent.status = 'offline';
          console.warn(`🐝 [Onboarding Registry] Agent offline: ${agent.name} (${id})`);
          
          IftttService.triggerWebhook('agent_offline', {
            value1: agent.name,
            value2: agent.type,
            value3: 'Heartbeat timeout'
          });
        }
      });
    }, 30 * 1000); // Check every 30 seconds
  }

  public static getAgents(): SwarmAgent[] {
    return Array.from(this.agents.values());
  }
}
