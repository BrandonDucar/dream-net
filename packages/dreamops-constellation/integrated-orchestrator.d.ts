/**
 * Integrated DreamOps Constellation Orchestrator
 *
 * Connects all stars to real systems:
 * - BrainHub → GitHub Issues
 * - DeployKeeper → Cloud Run / Vercel
 * - SocialWeaver → Social Media Poster + Telegram
 * - DreamMemory → Database storage
 */
import ConstellationOrchestrator from "./orchestrator.js";
import { DevBrief, ContentBrief, DeployOrder } from "./BrainHub/index.js";
import { DeploymentStatus } from "./DeployKeeper/index.js";
export declare class IntegratedConstellationOrchestrator extends ConstellationOrchestrator {
    private github;
    private cloudRun;
    private vercel;
    private telegram;
    private cursor;
    private socialPoster;
    constructor();
    /**
     * Setup Starbridge event subscriptions
     */
    private setupStarbridgeSubscriptions;
    /**
     * Handle Dev Brief - Create GitHub Issue
     */
    handleDevBrief(brief: DevBrief): Promise<void>;
    /**
     * Handle Deployment Order - Deploy to Cloud Run
     */
    handleDeployOrder(order: DeployOrder): Promise<void>;
    /**
     * Handle Content Brief - Post to Social Media
     */
    handleContentBrief(brief: ContentBrief): Promise<void>;
    /**
     * Handle deployment status updates
     */
    handleDeploymentStatus(status: DeploymentStatus): Promise<void>;
    /**
     * Handle Starbridge deployment events
     */
    private handleStarbridgeDeploymentEvent;
    /**
     * Handle Starbridge social events
     */
    private handleStarbridgeSocialEvent;
    /**
     * Start autonomous cycle
     */
    startAutonomousCycle(): Promise<void>;
}
export default IntegratedConstellationOrchestrator;
