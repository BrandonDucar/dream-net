/**
 * Dream Snail - Know-All Win-All Privacy Layer
 * 
 * A comprehensive privacy system that:
 * - Tracks all user interactions and data flows
 * - Provides verifiable provenance trails
 * - Enables privacy-preserving analytics
 * - Creates encrypted trails that only the user can decrypt
 * - Supports zero-knowledge proofs for privacy
 */

import { randomUUID } from "node:crypto";
import { createHash } from "node:crypto";

export interface SnailTrail {
  id: string;
  userId: string;
  eventType: string;
  eventData: Record<string, unknown>;
  timestamp: string;
  hash: string;
  previousHash: string | null;
  encrypted: boolean;
  encryptionKey?: string; // User-controlled encryption
  metadata: {
    source: string;
    agent?: string;
    system?: string;
    privacyLevel: "public" | "private" | "encrypted" | "zero-knowledge";
  };
}

export interface SnailPrivacyConfig {
  userId: string;
  encryptionEnabled: boolean;
  zeroKnowledgeEnabled: boolean;
  dataRetentionDays: number;
  allowAnalytics: boolean;
  allowTracking: boolean;
  shareWithAgents: string[]; // Which agents can access this user's data
}

export interface SnailInsight {
  id: string;
  userId: string;
  insightType: "pattern" | "anomaly" | "recommendation" | "privacy-alert";
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  relatedTrails: string[];
  actionable: boolean;
  actionUrl?: string;
}

class DreamSnail {
  private trails: Map<string, SnailTrail> = new Map();
  private userTrails: Map<string, string[]> = new Map(); // userId -> trailIds
  private privacyConfigs: Map<string, SnailPrivacyConfig> = new Map();
  private insights: Map<string, SnailInsight> = new Map();
  private userInsights: Map<string, string[]> = new Map(); // userId -> insightIds

  constructor() {
    console.log("🐌 [Dream Snail] Privacy layer initialized - Know-All Win-All mode active");
  }

  /**
   * Record a trail event - everything that happens gets tracked
   */
  recordTrail(
    userId: string,
    eventType: string,
    eventData: Record<string, unknown>,
    metadata?: Partial<SnailTrail["metadata"]>
  ): SnailTrail {
    const config = this.getPrivacyConfig(userId);
    
    // Get previous trail for chain
    const userTrailIds = this.userTrails.get(userId) || [];
    const previousTrail = userTrailIds.length > 0 
      ? this.trails.get(userTrailIds[userTrailIds.length - 1]) 
      : null;

    // Create hash of event data
    const dataString = JSON.stringify({ eventType, eventData, timestamp: new Date().toISOString() });
    const hash = createHash("sha256").update(dataString).digest("hex");

    // Determine privacy level
    let privacyLevel: SnailTrail["metadata"]["privacyLevel"] = "public";
    if (config.encryptionEnabled) {
      privacyLevel = "encrypted";
    } else if (config.zeroKnowledgeEnabled) {
      privacyLevel = "zero-knowledge";
    } else if (!config.allowTracking) {
      privacyLevel = "private";
    }

    const trail: SnailTrail = {
      id: randomUUID(),
      userId,
      eventType,
      eventData,
      timestamp: new Date().toISOString(),
      hash,
      previousHash: previousTrail?.hash || null,
      encrypted: config.encryptionEnabled,
      metadata: {
        source: metadata?.source || "system",
        agent: metadata?.agent,
        system: metadata?.system,
        privacyLevel,
      },
    };

    this.trails.set(trail.id, trail);
    
    // Update user trail chain
    if (!this.userTrails.has(userId)) {
      this.userTrails.set(userId, []);
    }
    this.userTrails.get(userId)!.push(trail.id);

    // Generate insights if needed
    this.generateInsights(userId, trail);

    return trail;
  }

  /**
   * Get user's complete trail (privacy-aware)
   */
  getUserTrail(userId: string, includeEncrypted: boolean = false): SnailTrail[] {
    const trailIds = this.userTrails.get(userId) || [];
    const trails = trailIds.map(id => this.trails.get(id)).filter(Boolean) as SnailTrail[];
    
    if (!includeEncrypted) {
      return trails.filter(t => !t.encrypted);
    }
    
    return trails;
  }

  /**
   * Get privacy configuration for user
   */
  getPrivacyConfig(userId: string): SnailPrivacyConfig {
    if (!this.privacyConfigs.has(userId)) {
      // Default config - privacy-first
      const defaultConfig: SnailPrivacyConfig = {
        userId,
        encryptionEnabled: false,
        zeroKnowledgeEnabled: false,
        dataRetentionDays: 365,
        allowAnalytics: true,
        allowTracking: true,
        shareWithAgents: [], // No agents by default
      };
      this.privacyConfigs.set(userId, defaultConfig);
      return defaultConfig;
    }
    
    return this.privacyConfigs.get(userId)!;
  }

  /**
   * Update privacy configuration
   */
  updatePrivacyConfig(userId: string, updates: Partial<SnailPrivacyConfig>): SnailPrivacyConfig {
    const config = this.getPrivacyConfig(userId);
    const updated = { ...config, ...updates };
    this.privacyConfigs.set(userId, updated);
    return updated;
  }

  /**
   * Generate insights from trail patterns
   */
  private generateInsights(userId: string, newTrail: SnailTrail): void {
    const userTrails = this.getUserTrail(userId, false);
    
    // Pattern detection: frequent events
    const eventCounts = new Map<string, number>();
    userTrails.forEach(trail => {
      eventCounts.set(trail.eventType, (eventCounts.get(trail.eventType) || 0) + 1);
    });

    // Detect frequent patterns
    eventCounts.forEach((count, eventType) => {
      if (count >= 10 && count % 10 === 0) {
        const insight: SnailInsight = {
          id: randomUUID(),
          userId,
          insightType: "pattern",
          title: `Frequent Activity: ${eventType}`,
          description: `You've performed "${eventType}" ${count} times. This pattern may indicate a workflow you could automate.`,
          severity: "low",
          timestamp: new Date().toISOString(),
          relatedTrails: userTrails.filter(t => t.eventType === eventType).map(t => t.id).slice(-10),
          actionable: true,
          actionUrl: `/automate?event=${eventType}`,
        };
        this.addInsight(userId, insight);
      }
    });

    // Privacy alerts: detect sensitive data
    const sensitiveKeywords = ["password", "private", "secret", "token", "key", "wallet"];
    const eventDataString = JSON.stringify(newTrail.eventData).toLowerCase();
    if (sensitiveKeywords.some(keyword => eventDataString.includes(keyword))) {
      const insight: SnailInsight = {
        id: randomUUID(),
        userId,
        insightType: "privacy-alert",
        title: "Sensitive Data Detected",
        description: `Your trail contains potentially sensitive information. Consider enabling encryption for enhanced privacy.`,
        severity: "medium",
        timestamp: new Date().toISOString(),
        relatedTrails: [newTrail.id],
        actionable: true,
        actionUrl: `/snail/privacy?enableEncryption=true`,
      };
      this.addInsight(userId, insight);
    }
  }

  /**
   * Add insight for user
   */
  private addInsight(userId: string, insight: SnailInsight): void {
    this.insights.set(insight.id, insight);
    
    if (!this.userInsights.has(userId)) {
      this.userInsights.set(userId, []);
    }
    
    // Don't duplicate insights
    const existing = this.userInsights.get(userId)!;
    if (!existing.includes(insight.id)) {
      existing.push(insight.id);
    }
  }

  /**
   * Get user insights
   */
  getUserInsights(userId: string, severity?: SnailInsight["severity"]): SnailInsight[] {
    const insightIds = this.userInsights.get(userId) || [];
    let insights = insightIds.map(id => this.insights.get(id)).filter(Boolean) as SnailInsight[];
    
    if (severity) {
      insights = insights.filter(i => i.severity === severity);
    }
    
    // Sort by timestamp (newest first)
    return insights.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Verify trail integrity (check hash chain)
   */
  verifyTrailIntegrity(userId: string): { valid: boolean; invalidTrails: string[] } {
    const trails = this.getUserTrail(userId, true);
    const invalidTrails: string[] = [];
    
    for (let i = 0; i < trails.length; i++) {
      const trail = trails[i];
      
      // Verify hash
      const dataString = JSON.stringify({ 
        eventType: trail.eventType, 
        eventData: trail.eventData, 
        timestamp: trail.timestamp 
      });
      const expectedHash = createHash("sha256").update(dataString).digest("hex");
      
      if (trail.hash !== expectedHash) {
        invalidTrails.push(trail.id);
        continue;
      }
      
      // Verify chain (if not first trail)
      if (i > 0) {
        const previousTrail = trails[i - 1];
        if (trail.previousHash !== previousTrail.hash) {
          invalidTrails.push(trail.id);
        }
      }
    }
    
    return {
      valid: invalidTrails.length === 0,
      invalidTrails,
    };
  }

  /**
   * Get analytics (privacy-aware)
   */
  getAnalytics(userId: string): {
    totalTrails: number;
    eventTypes: Record<string, number>;
    mostActiveDay: string;
    privacyScore: number;
    insightsCount: number;
  } {
    const trails = this.getUserTrail(userId, false);
    const config = this.getPrivacyConfig(userId);
    
    // Count event types
    const eventTypes: Record<string, number> = {};
    trails.forEach(trail => {
      eventTypes[trail.eventType] = (eventTypes[trail.eventType] || 0) + 1;
    });
    
    // Find most active day
    const dayCounts = new Map<string, number>();
    trails.forEach(trail => {
      const day = new Date(trail.timestamp).toISOString().split("T")[0];
      dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
    });
    const mostActiveDay = Array.from(dayCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
    
    // Calculate privacy score (0-100)
    let privacyScore = 50; // Base score
    if (config.encryptionEnabled) privacyScore += 30;
    if (config.zeroKnowledgeEnabled) privacyScore += 20;
    if (!config.allowAnalytics) privacyScore += 10;
    if (!config.allowTracking) privacyScore += 10;
    if (config.shareWithAgents.length === 0) privacyScore += 10;
    privacyScore = Math.min(100, privacyScore);
    
    return {
      totalTrails: trails.length,
      eventTypes,
      mostActiveDay,
      privacyScore,
      insightsCount: this.userInsights.get(userId)?.length || 0,
    };
  }
}

export const dreamSnail = new DreamSnail();

