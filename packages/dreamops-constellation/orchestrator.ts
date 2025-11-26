/**
 * DreamOps Constellation Orchestrator
 * 
 * Coordinates handoffs between stars (BrainHub, DeployKeeper, DreamMemory, SocialWeaver)
 */

import BrainHub from "./BrainHub/index.js";
import DeployKeeper from "./DeployKeeper/index.js";
import DreamMemory from "./DreamMemory/index.js";
import SocialWeaver from "./SocialWeaver/index.js";

export interface ConstellationEvent {
  id: string;
  type: "dev-brief" | "content-brief" | "deploy-order" | "memory-store" | "social-post";
  from: "BrainHub" | "DeployKeeper" | "DreamMemory" | "SocialWeaver";
  to: "BrainHub" | "DeployKeeper" | "DreamMemory" | "SocialWeaver" | "Cursor" | "Vercel" | "Telegram";
  payload: any;
  timestamp: string;
}

export class ConstellationOrchestrator {
  public brainHub: BrainHub;
  public deployKeeper: DeployKeeper;
  public dreamMemory: DreamMemory;
  public socialWeaver: SocialWeaver;
  
  private events: ConstellationEvent[] = [];

  constructor() {
    this.brainHub = new BrainHub();
    this.deployKeeper = new DeployKeeper();
    this.dreamMemory = new DreamMemory();
    this.socialWeaver = new SocialWeaver();
  }

  /**
   * Handle a Dev Brief from BrainHub → Cursor
   */
  async handleDevBrief(brief: any): Promise<void> {
    const event: ConstellationEvent = {
      id: `event-${Date.now()}`,
      type: "dev-brief",
      from: "BrainHub",
      to: "Cursor",
      payload: brief,
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    
    // TODO: Send to Cursor Tasks API
    console.log(`[Orchestrator] Routing Dev Brief to Cursor: ${brief.title}`);
  }

  /**
   * Handle a Deployment Order from BrainHub → DeployKeeper
   */
  async handleDeployOrder(order: any): Promise<void> {
    const event: ConstellationEvent = {
      id: `event-${Date.now()}`,
      type: "deploy-order",
      from: "BrainHub",
      to: "DeployKeeper",
      payload: order,
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    
    // Execute deployment
    await this.deployKeeper.deploy(
      order.service,
      order.environment,
      order.branch
    );
    
    console.log(`[Orchestrator] Executing deployment: ${order.service} to ${order.environment}`);
  }

  /**
   * Handle a Content Brief from BrainHub → SocialWeaver
   */
  async handleContentBrief(brief: any): Promise<void> {
    const event: ConstellationEvent = {
      id: `event-${Date.now()}`,
      type: "content-brief",
      from: "BrainHub",
      to: "SocialWeaver",
      payload: brief,
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    
    // Schedule post
    await this.socialWeaver.schedulePost(
      brief.description,
      brief.platforms,
      brief.scheduledFor || new Date().toISOString()
    );
    
    console.log(`[Orchestrator] Scheduling content: ${brief.title}`);
  }

  /**
   * Handle deployment status from DeployKeeper → BrainHub
   */
  async handleDeploymentStatus(status: any): Promise<void> {
    const event: ConstellationEvent = {
      id: `event-${Date.now()}`,
      type: "deploy-order",
      from: "DeployKeeper",
      to: "BrainHub",
      payload: status,
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    
    // Store in memory
    await this.dreamMemory.store("ops", `deployment-${status.id}`, status);
    
    console.log(`[Orchestrator] Deployment status: ${status.service} - ${status.status}`);
  }

  /**
   * Handle social signals from SocialWeaver → BrainHub
   */
  async handleSocialSignals(signals: any): Promise<void> {
    const event: ConstellationEvent = {
      id: `event-${Date.now()}`,
      type: "social-post",
      from: "SocialWeaver",
      to: "BrainHub",
      payload: signals,
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    
    // Store in memory
    await this.dreamMemory.store("social", `signals-${Date.now()}`, signals);
    
    console.log(`[Orchestrator] Social signals received: ${signals.platform}`);
  }

  /**
   * Get context pack from DreamMemory for an agent
   */
  async getContextPack(packId: string): Promise<any> {
    const pack = await this.dreamMemory.getContextPack(packId);
    if (!pack) {
      throw new Error(`Context pack ${packId} not found`);
    }

    const memories = await this.dreamMemory.getContextPackMemories(packId);
    return {
      pack,
      memories,
    };
  }

  /**
   * Get all events
   */
  getEvents(limit?: number): ConstellationEvent[] {
    if (limit) {
      return this.events.slice(-limit);
    }
    return this.events;
  }

  /**
   * Get events by type
   */
  getEventsByType(type: ConstellationEvent["type"]): ConstellationEvent[] {
    return this.events.filter((e) => e.type === type);
  }
}

export default ConstellationOrchestrator;

