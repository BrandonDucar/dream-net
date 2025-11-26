/**
 * 🚀 DreamNet Drive Engine
 * 
 * The motivator that gives all packs and agents a "drive" to act autonomously.
 * 
 * Components:
 * - Purpose Engine: Defines what drives each pack
 * - Hunger System: Measures how "hungry" each pack is
 * - Momentum System: Maintains velocity of actions
 * - Action Generator: Generates actions based on drive
 * - Feedback Loop: Adjusts drive based on outcomes
 */

import type { WolfPackStatus } from "../../packages/wolf-pack/types";

export interface PackDriveProfile {
  packId: string;
  packName: string;
  purpose: string;
  goals: string[];
  metrics: string[];
  motivation: string;
  hungerLevel: number; // 0-1
  momentum: number; // 0-1
  lastActionAt?: number;
  successRate: number; // 0-1
  driveMultiplier: number; // 0-2 (can boost or reduce drive)
}

export interface DriveAction {
  actionId: string;
  packId: string;
  actionType: "seek" | "pursue" | "optimize" | "expand";
  priority: number; // 0-1
  context: Record<string, any>;
  generatedAt: number;
}

export interface DriveFeedback {
  actionId: string;
  packId: string;
  outcome: "success" | "failure" | "partial" | "no_response";
  result?: any;
  learned?: Record<string, any>;
}

export class DriveEngine {
  private packProfiles: Map<string, PackDriveProfile> = new Map();
  private actionQueue: DriveAction[] = [];
  private feedbackHistory: DriveFeedback[] = [];

  constructor() {
    this.initializePackProfiles();
  }

  /**
   * Initialize drive profiles for all packs
   */
  private initializePackProfiles(): void {
    // Wolf Pack - Funding
    this.packProfiles.set("wolf-pack", {
      packId: "wolf-pack",
      packName: "Wolf Pack",
      purpose: "Find and pursue funding opportunities",
      goals: ["maximize_funding", "increase_applications", "improve_response_rate"],
      metrics: ["opportunities_found", "applications_sent", "funding_secured"],
      motivation: "Each opportunity = potential funding",
      hungerLevel: 0.5,
      momentum: 0.5,
      successRate: 0.5,
      driveMultiplier: 1.0,
    });

    // Whale Pack - Commerce
    this.packProfiles.set("whale-pack", {
      packId: "whale-pack",
      packName: "Whale Pack",
      purpose: "Drive commerce and product management",
      goals: ["maximize_revenue", "increase_users", "improve_products"],
      metrics: ["products_launched", "sales_made", "users_acquired", "revenue_generated"],
      motivation: "Each product = potential revenue",
      hungerLevel: 0.5,
      momentum: 0.5,
      successRate: 0.5,
      driveMultiplier: 1.0,
    });

    // Orca Pack - Communication
    this.packProfiles.set("orca-pack", {
      packId: "orca-pack",
      packName: "Orca Pack",
      purpose: "Drive communication and narrative",
      goals: ["maximize_engagement", "increase_reach", "improve_messaging"],
      metrics: ["messages_sent", "stories_shared", "engagement_received", "reach_expanded"],
      motivation: "Each message = potential connection",
      hungerLevel: 0.5,
      momentum: 0.5,
      successRate: 0.5,
      driveMultiplier: 1.0,
    });

    // Shield Core - Security
    this.packProfiles.set("shield-core", {
      packId: "shield-core",
      packName: "Shield Core",
      purpose: "Protect and defend DreamNet",
      goals: ["maximize_security", "increase_resilience", "improve_threat_detection"],
      metrics: ["threats_detected", "vulnerabilities_patched", "attacks_blocked", "systems_secured"],
      motivation: "Each threat = potential danger",
      hungerLevel: 0.5,
      momentum: 0.5,
      successRate: 0.5,
      driveMultiplier: 1.0,
    });
  }

  /**
   * Update pack status from external sources
   */
  updatePackStatus(packId: string, status: any): void {
    const profile = this.packProfiles.get(packId);
    if (!profile) return;

    // Update based on pack-specific status
    if (packId === "wolf-pack" && status.opportunities) {
      // More opportunities = more hunger
      profile.hungerLevel = Math.min(1.0, status.opportunities.length / 10);
    }

    if (status.lastActionAt) {
      profile.lastActionAt = status.lastActionAt;
    }

    if (status.successRate !== undefined) {
      profile.successRate = status.successRate;
    }
  }

  /**
   * Calculate hunger level for a pack
   */
  calculateHunger(packId: string, context?: Record<string, any>): number {
    const profile = this.packProfiles.get(packId);
    if (!profile) return 0;

    const now = Date.now();
    const timeSinceLastAction = profile.lastActionAt
      ? (now - profile.lastActionAt) / (1000 * 60 * 60) // hours
      : 24; // Default to 24 hours if never acted

    // Hunger factors
    const opportunitiesFactor = context?.opportunitiesAvailable
      ? Math.min(1.0, context.opportunitiesAvailable / 10)
      : 0.5;
    const timeFactor = Math.min(1.0, timeSinceLastAction / 24); // Max hunger after 24 hours
    const successFactor = profile.successRate;
    const resourcesFactor = context?.resourcesAvailable ? 1.0 : 0.5;

    // Calculate hunger
    const hunger = (
      opportunitiesFactor * 0.4 +
      timeFactor * 0.3 +
      successFactor * 0.2 +
      resourcesFactor * 0.1
    ) * profile.driveMultiplier;

    profile.hungerLevel = Math.min(1.0, Math.max(0.0, hunger));
    return profile.hungerLevel;
  }

  /**
   * Calculate momentum for a pack
   */
  calculateMomentum(packId: string, context?: Record<string, any>): number {
    const profile = this.packProfiles.get(packId);
    if (!profile) return 0;

    const recentActions = context?.recentActionsCount || 0;
    const velocity = context?.velocity || 0.5; // Actions per hour
    const consistency = context?.consistency || 0.5; // How regular actions are

    // Calculate momentum
    const momentum = (
      Math.min(1.0, recentActions / 10) * 0.3 +
      profile.successRate * 0.3 +
      Math.min(1.0, velocity) * 0.2 +
      consistency * 0.2
    );

    profile.momentum = Math.min(1.0, Math.max(0.0, momentum));
    return profile.momentum;
  }

  /**
   * Generate actions based on drive
   */
  generateActions(packId: string, context?: Record<string, any>): DriveAction[] {
    const profile = this.packProfiles.get(packId);
    if (!profile) return [];

    const hunger = this.calculateHunger(packId, context);
    const momentum = this.calculateMomentum(packId, context);
    const actions: DriveAction[] = [];

    // High hunger + High momentum = Immediate action
    if (hunger > 0.7 && momentum > 0.7) {
      actions.push({
        actionId: `drive-${packId}-${Date.now()}-pursue`,
        packId,
        actionType: "pursue",
        priority: 0.9,
        context: { ...context, hunger, momentum },
        generatedAt: Date.now(),
      });
    }
    // High hunger + Low momentum = Build momentum
    else if (hunger > 0.7 && momentum < 0.5) {
      actions.push({
        actionId: `drive-${packId}-${Date.now()}-seek`,
        packId,
        actionType: "seek",
        priority: 0.8,
        context: { ...context, hunger, momentum },
        generatedAt: Date.now(),
      });
    }
    // Low hunger + High momentum = Maintain momentum
    else if (hunger < 0.5 && momentum > 0.7) {
      actions.push({
        actionId: `drive-${packId}-${Date.now()}-optimize`,
        packId,
        actionType: "optimize",
        priority: 0.6,
        context: { ...context, hunger, momentum },
        generatedAt: Date.now(),
      });
    }
    // Low hunger + Low momentum = Seek opportunities
    else {
      actions.push({
        actionId: `drive-${packId}-${Date.now()}-seek`,
        packId,
        actionType: "seek",
        priority: 0.5,
        context: { ...context, hunger, momentum },
        generatedAt: Date.now(),
      });
    }

    // Add to queue
    this.actionQueue.push(...actions);
    return actions;
  }

  /**
   * Process feedback and adjust drive
   */
  processFeedback(feedback: DriveFeedback): void {
    this.feedbackHistory.push(feedback);
    const profile = this.packProfiles.get(feedback.packId);
    if (!profile) return;

    // Adjust based on outcome
    if (feedback.outcome === "success") {
      // Success → Increase drive, maintain momentum
      profile.driveMultiplier = Math.min(2.0, profile.driveMultiplier * 1.1);
      profile.successRate = Math.min(1.0, profile.successRate + 0.1);
      profile.momentum = Math.min(1.0, profile.momentum + 0.1);
    } else if (feedback.outcome === "failure") {
      // Failure → Adjust drive, learn from failure
      profile.driveMultiplier = Math.max(0.5, profile.driveMultiplier * 0.9);
      profile.successRate = Math.max(0.0, profile.successRate - 0.05);
      profile.momentum = Math.max(0.0, profile.momentum - 0.1);
    } else if (feedback.outcome === "partial") {
      // Partial success → Moderate adjustment
      profile.driveMultiplier = Math.min(1.5, profile.driveMultiplier * 1.05);
      profile.successRate = Math.min(1.0, profile.successRate + 0.05);
    } else if (feedback.outcome === "no_response") {
      // No response → Increase hunger, try different approach
      profile.hungerLevel = Math.min(1.0, profile.hungerLevel + 0.1);
      profile.driveMultiplier = Math.max(0.8, profile.driveMultiplier * 0.95);
    }

    // Apply learned patterns
    if (feedback.learned) {
      // Store learned patterns for future use
      // This could be stored in Brain Store for long-term learning
    }
  }

  /**
   * Get drive status for all packs
   */
  getDriveStatus(): Record<string, PackDriveProfile> {
    const status: Record<string, PackDriveProfile> = {};
    for (const [packId, profile] of this.packProfiles.entries()) {
      status[packId] = { ...profile };
    }
    return status;
  }

  /**
   * Get next action from queue
   */
  getNextAction(): DriveAction | null {
    if (this.actionQueue.length === 0) return null;

    // Sort by priority
    this.actionQueue.sort((a, b) => b.priority - a.priority);
    return this.actionQueue.shift() || null;
  }

  /**
   * Get actions for a specific pack
   */
  getPackActions(packId: string): DriveAction[] {
    return this.actionQueue.filter((action) => action.packId === packId);
  }
}

// Singleton instance
export const driveEngine = new DriveEngine();

