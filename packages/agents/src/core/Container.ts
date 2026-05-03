import { BaseAgent } from './BaseAgent.js';

/**
 * 📦 Agent Container
 * Manages the lifecycle and registry of active agents in a local instance.
 */
export class AgentContainer {
  private agents: Map<string, BaseAgent> = new Map();

  public register(agent: BaseAgent) {
    this.agents.set(agent.constructor.name, agent);
    console.log(`📦 [Container] Registered ${agent.constructor.name}`);
  }

  public get<T extends BaseAgent>(type: new (...args: any[]) => T): T | undefined {
    return this.agents.get(type.name) as T;
  }

  public async igniteAll() {
    console.log(`📦 [Container] Igniting ${this.agents.size} agents...`);
    const ignitions = Array.from(this.agents.values()).map(agent => agent.ignite());
    await Promise.all(ignitions);
    console.log(`📦 [Container] All agents active.`);
  }
}

export const container = new AgentContainer();
