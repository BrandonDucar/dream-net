/**
 * Integrated DreamOps Constellation Orchestrator
 * 
 * Connects all stars to real systems:
 * - BrainHub → GitHub Issues
 * - DeployKeeper → Cloud Run / Vercel
 * - SocialWeaver → Social Media Poster + Telegram
 * - DreamMemory → Database storage
 */

import ConstellationOrchestrator, { ConstellationEvent } from "./orchestrator.js";
import BrainHub, { DevBrief, ContentBrief, DeployOrder } from "./BrainHub/index.js";
import DeployKeeper, { DeploymentStatus } from "./DeployKeeper/index.js";
import DreamMemory from "./DreamMemory/index.js";
import SocialWeaver, { SocialPost } from "./SocialWeaver/index.js";

// Integrations
import GitHubIntegration from "./integrations/github.js";
import CloudRunIntegration from "./integrations/cloud-run.js";
import VercelIntegration from "./integrations/vercel.js";
import TelegramIntegration from "./integrations/telegram.js";
import CursorIntegration from "./integrations/cursor.js";

// External systems
import { broadcastStarbridgeEvent, StarbridgeTopic, StarbridgeSource } from "../../server/starbridge/bus.js";
import { SocialMediaPoster } from "../../packages/social-media-poster/SocialMediaPoster.js";

export class IntegratedConstellationOrchestrator extends ConstellationOrchestrator {
  // Integrations
  private github: GitHubIntegration;
  private cloudRun: CloudRunIntegration;
  private vercel: VercelIntegration;
  private telegram: TelegramIntegration;
  private cursor: CursorIntegration;
  private socialPoster: SocialMediaPoster;

  constructor() {
    super();

    // Initialize integrations
    this.github = new GitHubIntegration();
    this.cloudRun = new CloudRunIntegration();
    this.vercel = new VercelIntegration();
    this.telegram = new TelegramIntegration();
    this.cursor = new CursorIntegration();
    this.socialPoster = new SocialMediaPoster();

    // Subscribe to Starbridge events
    this.setupStarbridgeSubscriptions();
  }

  /**
   * Setup Starbridge event subscriptions
   */
  private setupStarbridgeSubscriptions() {
    // Listen for deployment events
    import("../../server/starbridge/bus.js").then(({ onStarbridgeEvent }) => {
      onStarbridgeEvent((event) => {
        if (event.topic === StarbridgeTopic.DEPLOYMENT) {
          this.handleStarbridgeDeploymentEvent(event.payload);
        } else if (event.topic === StarbridgeTopic.SOCIAL) {
          this.handleStarbridgeSocialEvent(event.payload);
        }
      });
    });
  }

  /**
   * Handle Dev Brief - Create GitHub Issue
   */
  async handleDevBrief(brief: DevBrief): Promise<void> {
    await super.handleDevBrief(brief);

    // Create GitHub issue
    try {
      const issue = await this.github.createIssue({
        title: brief.title,
        body: brief.description,
        labels: ["dreamops", "dev-brief", `priority-${brief.priority}`],
      });

      // Store in memory
      await this.dreamMemory.store("code", `issue-${issue.number}`, {
        briefId: brief.id,
        issueNumber: issue.number,
        issueUrl: issue.url,
      });

      // Send to Cursor
      await this.cursor.sendDevBrief({
        title: brief.title,
        description: brief.description,
        contextPack: brief.contextPack,
      });

      // Broadcast event
      await broadcastStarbridgeEvent({
        topic: StarbridgeTopic.DEVELOPMENT,
        source: StarbridgeSource.DREAMOPS,
        payload: {
          type: "dev-brief-created",
          briefId: brief.id,
          issueNumber: issue.number,
        },
      });

      // Send Telegram notification
      await this.telegram.sendOpsCard(
        `Dev Brief: ${brief.title}`,
        "✅",
        `Created GitHub issue #${issue.number}`,
        issue.url
      );
    } catch (error: any) {
      console.error(`[DreamOps] Failed to create GitHub issue:`, error);
    }
  }

  /**
   * Handle Deployment Order - Deploy to Cloud Run
   */
  async handleDeployOrder(order: DeployOrder): Promise<void> {
    await super.handleDeployOrder(order);

    // Create deployment status
    let deployment: DeploymentStatus;

    try {
      // Deploy to Cloud Run
      const result = await this.cloudRun.deploy({
        service: order.service,
        region: "us-central1",
        project: process.env.GCP_PROJECT_ID || "dreamnet-main",
      });

      // Update deployment status
      deployment = await this.deployKeeper.deploy(
        order.service,
        order.environment,
        order.branch
      );

      // Store in memory
      await this.dreamMemory.store("ops", `deployment-${deployment.id}`, {
        orderId: order.id,
        deploymentId: deployment.id,
        service: order.service,
        environment: order.environment,
        status: deployment.status,
        url: result.url,
      });

      // Broadcast event
      await broadcastStarbridgeEvent({
        topic: StarbridgeTopic.DEPLOYMENT,
        source: StarbridgeSource.DREAMOPS,
        payload: {
          type: "deployment-started",
          deploymentId: deployment.id,
          service: order.service,
          environment: order.environment,
        },
      });

      // Send Telegram notification
      await this.telegram.sendOpsCard(
        `Deployment: ${order.service}`,
        deployment.status === "success" ? "✅" : "⚠️",
        `Deploying to ${order.environment}`,
        result.url
      );

      // Check health after deployment
      setTimeout(async () => {
        const health = await this.cloudRun.checkHealth(result.url);
        await this.handleDeploymentStatus({
          id: deployment.id,
          service: order.service,
          environment: order.environment,
          status: health.status === "ok" ? "success" : "failed",
          url: result.url,
          startedAt: deployment.startedAt,
          completedAt: new Date().toISOString(),
        });
      }, 30000); // Check after 30 seconds
    } catch (error: any) {
      console.error(`[DreamOps] Deployment failed:`, error);
      
      // Send alert
      await this.telegram.sendIncident(
        order.service,
        "high",
        `Deployment failed: ${error.message}`
      );
    }
  }

  /**
   * Handle Content Brief - Post to Social Media
   */
  async handleContentBrief(brief: ContentBrief): Promise<void> {
    await super.handleContentBrief(brief);

    try {
      // Post to social media platforms
      const post = await this.socialWeaver.postNow(
        brief.description,
        brief.platforms,
        undefined,
        { source: "dreamops", briefId: brief.id }
      );

      // Store in memory
      await this.dreamMemory.store("social", `post-${post.id}`, {
        briefId: brief.id,
        postId: post.id,
        platforms: brief.platforms,
        content: brief.description,
      });

      // Broadcast event
      await broadcastStarbridgeEvent({
        topic: StarbridgeTopic.SOCIAL,
        source: StarbridgeSource.DREAMOPS,
        payload: {
          type: "content-posted",
          briefId: brief.id,
          postId: post.id,
          platforms: brief.platforms,
        },
      });

      // Send Telegram notification
      await this.telegram.sendContentThread(
        brief.title,
        brief.description,
        brief.platforms,
        { source: "dreamops" }
      );
    } catch (error: any) {
      console.error(`[DreamOps] Failed to post content:`, error);
    }
  }

  /**
   * Handle deployment status updates
   */
  async handleDeploymentStatus(status: DeploymentStatus): Promise<void> {
    await super.handleDeploymentStatus(status);

    // Update memory
    await this.dreamMemory.store("ops", `deployment-${status.id}`, status);

    // Broadcast event
    await broadcastStarbridgeEvent({
      topic: StarbridgeTopic.DEPLOYMENT,
      source: StarbridgeSource.DREAMOPS,
      payload: {
        type: "deployment-status",
        deploymentId: status.id,
        service: status.service,
        status: status.status,
      },
    });

    // Send Telegram notification
    const emoji = status.status === "success" ? "✅" : status.status === "failed" ? "❌" : "⚠️";
    await this.telegram.sendOpsCard(
      `Deployment: ${status.service}`,
      emoji,
      `Status: ${status.status}`,
      status.url
    );
  }

  /**
   * Handle Starbridge deployment events
   */
  private async handleStarbridgeDeploymentEvent(payload: any) {
    if (payload.type === "deployment-completed") {
      // Update deployment status
      const deployment = this.deployKeeper.getDeployment(payload.deploymentId);
      if (deployment) {
        await this.handleDeploymentStatus(deployment);
      }
    }
  }

  /**
   * Handle Starbridge social events
   */
  private async handleStarbridgeSocialEvent(payload: any) {
    if (payload.type === "post-metrics") {
      // Update post metrics in SocialWeaver
      const post = this.socialWeaver.getPost(payload.postId);
      if (post) {
        post.metrics = payload.metrics;
      }
    }
  }

  /**
   * Start autonomous cycle
   */
  async startAutonomousCycle(): Promise<void> {
    console.log("[DreamOps] Starting autonomous cycle...");

    // 1. Check for PRs ready for deploy
    // TODO: Poll GitHub for PRs with "ready-for-deploy" label

    // 2. Check deployment health
    const deployments = this.deployKeeper.getAllDeployments();
    for (const deployment of deployments) {
      if (deployment.url) {
        const health = await this.cloudRun.checkHealth(deployment.url);
        if (health.status !== "ok") {
          await this.telegram.sendIncident(
            deployment.service,
            "medium",
            `Health check failed: ${health.status}`
          );
        }
      }
    }

    // 3. Generate growth report
    const report = await this.socialWeaver.generateGrowthReport("daily");
    await this.dreamMemory.store("social", `report-${report.id}`, report);

    console.log("[DreamOps] Autonomous cycle completed");
  }
}

export default IntegratedConstellationOrchestrator;

