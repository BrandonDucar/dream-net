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
export declare class ConstellationOrchestrator {
    brainHub: BrainHub;
    deployKeeper: DeployKeeper;
    dreamMemory: DreamMemory;
    socialWeaver: SocialWeaver;
    private events;
    constructor();
    /**
     * Handle a Dev Brief from BrainHub → Cursor
     */
    handleDevBrief(brief: any): Promise<void>;
    /**
     * Handle a Deployment Order from BrainHub → DeployKeeper
     */
    handleDeployOrder(order: any): Promise<void>;
    /**
     * Handle a Content Brief from BrainHub → SocialWeaver
     */
    handleContentBrief(brief: any): Promise<void>;
    /**
     * Handle deployment status from DeployKeeper → BrainHub
     */
    handleDeploymentStatus(status: any): Promise<void>;
    /**
     * Handle social signals from SocialWeaver → BrainHub
     */
    handleSocialSignals(signals: any): Promise<void>;
    /**
     * Get context pack from DreamMemory for an agent
     */
    getContextPack(packId: string): Promise<any>;
    /**
     * Get all events
     */
    getEvents(limit?: number): ConstellationEvent[];
    /**
     * Get events by type
     */
    getEventsByType(type: ConstellationEvent["type"]): ConstellationEvent[];
}
export default ConstellationOrchestrator;
