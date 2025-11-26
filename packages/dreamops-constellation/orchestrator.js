/**
 * DreamOps Constellation Orchestrator
 *
 * Coordinates handoffs between stars (BrainHub, DeployKeeper, DreamMemory, SocialWeaver)
 */
import BrainHub from "./BrainHub/index.js";
import DeployKeeper from "./DeployKeeper/index.js";
import DreamMemory from "./DreamMemory/index.js";
import SocialWeaver from "./SocialWeaver/index.js";
export class ConstellationOrchestrator {
    brainHub;
    deployKeeper;
    dreamMemory;
    socialWeaver;
    events = [];
    constructor() {
        this.brainHub = new BrainHub();
        this.deployKeeper = new DeployKeeper();
        this.dreamMemory = new DreamMemory();
        this.socialWeaver = new SocialWeaver();
    }
    /**
     * Handle a Dev Brief from BrainHub → Cursor
     */
    async handleDevBrief(brief) {
        const event = {
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
    async handleDeployOrder(order) {
        const event = {
            id: `event-${Date.now()}`,
            type: "deploy-order",
            from: "BrainHub",
            to: "DeployKeeper",
            payload: order,
            timestamp: new Date().toISOString(),
        };
        this.events.push(event);
        // Execute deployment
        await this.deployKeeper.deploy(order.service, order.environment, order.branch);
        console.log(`[Orchestrator] Executing deployment: ${order.service} to ${order.environment}`);
    }
    /**
     * Handle a Content Brief from BrainHub → SocialWeaver
     */
    async handleContentBrief(brief) {
        const event = {
            id: `event-${Date.now()}`,
            type: "content-brief",
            from: "BrainHub",
            to: "SocialWeaver",
            payload: brief,
            timestamp: new Date().toISOString(),
        };
        this.events.push(event);
        // Schedule post
        await this.socialWeaver.schedulePost(brief.description, brief.platforms, brief.scheduledFor || new Date().toISOString());
        console.log(`[Orchestrator] Scheduling content: ${brief.title}`);
    }
    /**
     * Handle deployment status from DeployKeeper → BrainHub
     */
    async handleDeploymentStatus(status) {
        const event = {
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
    async handleSocialSignals(signals) {
        const event = {
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
    async getContextPack(packId) {
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
    getEvents(limit) {
        if (limit) {
            return this.events.slice(-limit);
        }
        return this.events;
    }
    /**
     * Get events by type
     */
    getEventsByType(type) {
        return this.events.filter((e) => e.type === type);
    }
}
export default ConstellationOrchestrator;
