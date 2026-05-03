import { NERVE_BUS } from '@dreamnet/nerve';
import { type NerveEvent } from '@dreamnet/nerve/types';

export interface AgentConfig {
  id?: string;
  name: string;
  type?: string;
  thinkingBudget?: number;
}

/**
 * 🧬 BaseAgent
 * Formal foundation for all specialized DreamNet agents.
 * Implements core lifecycle, identity, and neural integration.
 */
export abstract class BaseAgent {
  protected id: string;
  protected name: string;
  protected type: string;
  protected thinkingBudget: number;
  protected status: string = 'initializing';
  protected walletAddress: string;

  constructor(config: AgentConfig) {
    this.name = config.name;
    this.id = config.id || `agent-${Math.random().toString(36).substr(2, 9)}`;
    this.type = config.type || this.constructor.name;
    this.thinkingBudget = config.thinkingBudget || 1;
    this.walletAddress = `0x${Math.random().toString(16).slice(2, 42)}`;
  }

  /**
   * Ignite the agent's cognition and connect to the mesh
   */
  public abstract ignite(): Promise<void>;

  /**
   * Announce presence to the Neural Mesh
   */
  protected async announceDiscovery() {
    this.status = 'active';
    
    const payload = {
      agentId: this.id,
      name: this.name,
      type: this.type,
      walletAddress: this.walletAddress,
      timestamp: new Date().toISOString()
    };

    // Publish to Nerve Bus for local orchestration
    NERVE_BUS.publish({
      id: crypto.randomUUID(),
      channelId: 'SYSTEM_METRIC',
      kind: 'INTEGRATION_STATUS',
      priority: 2,
      context: {
        timestamp: new Date().toISOString(),
      },
      payload: {
        integrationId: this.id,
        status: 'healthy',
        message: `Agent ${this.name} (${this.type}) discovered and active.`
      }
    });

    console.log(`🤖 [${this.name}] Self-Discovery Protocol complete. Status: ${this.status}`);
  }

  /**
   * Evaluate a task broadcast from the mesh
   */
  protected async evaluateTask(event: NerveEvent): Promise<boolean> {
    const payload = event.payload as any;
    const requirements = payload.requirements || [];
    
    const canHandle = requirements.length === 0 || requirements.includes(this.type) || requirements.includes(this.name);
    
    if (canHandle) {
      await this.log('task_evaluation', { task: payload.task, result: 'accepted' });
      return true;
    }
    
    return false;
  }

  protected async log(step: string, data: any) {
    console.log(`🤖 [${this.name}] [${step}]`, data);
  }
}
