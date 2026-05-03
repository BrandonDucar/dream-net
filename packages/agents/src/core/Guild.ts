import { BaseAgent } from './BaseAgent.js';

/**
 * 🏛️ Agent Guild
 * Represents a collective of specialized agents working toward a shared purpose.
 */
export class Guild {
  private members: Set<BaseAgent> = new Set();

  constructor(public readonly name: string, public readonly purpose: string) {}

  public addMember(agent: BaseAgent) {
    this.members.add(agent);
    console.log(`🏛️ [Guild: ${this.name}] Added member: ${agent.constructor.name}`);
  }

  public broadcast(message: string) {
    console.log(`🏛️ [Guild: ${this.name}] Broadcasting to ${this.members.size} members: ${message}`);
  }
}
