/**
 * Wolf Pack Funding Hunter
 * 
 * Coordinated funding hunt agent that:
 * - Discovers grant opportunities (Base, OP, etc.)
 * - Tracks application status
 * - Automates outreach and follow-ups
 * - Manages funding pipeline
 * - Can be used as paid feature for users
 */

import { randomUUID } from "node:crypto";

export type FundingSource = "base" | "optimism" | "arbitrum" | "polygon" | "other";
export type FundingStatus = "discovered" | "researching" | "applied" | "interview" | "approved" | "rejected" | "funded";

export interface FundingOpportunity {
  id: string;
  source: FundingSource;
  name: string;
  description: string;
  url: string;
  amount?: {
    min: number;
    max: number;
    currency: string;
  };
  deadline?: string;
  requirements: string[];
  status: FundingStatus;
  discoveredAt: string;
  appliedAt?: string;
  notes?: string;
  tags: string[];
  priority: "low" | "medium" | "high" | "critical";
}

export interface FundingHunt {
  id: string;
  userId?: string; // For paid feature - user requesting hunt
  targetAmount: number;
  targetSources: FundingSource[];
  status: "active" | "paused" | "completed";
  opportunities: FundingOpportunity[];
  createdAt: string;
  updatedAt: string;
}

export interface OutreachTemplate {
  id: string;
  name: string;
  source: FundingSource;
  subject: string;
  body: string;
  variables: string[]; // e.g., ["projectName", "amount", "deadline"]
}

class WolfPackFundingHunter {
  private hunts: Map<string, FundingHunt> = new Map();
  private opportunities: Map<string, FundingOpportunity> = new Map();
  private templates: OutreachTemplate[] = [];

  constructor() {
    this.initializeTemplates();
    this.startDiscoveryLoop();
  }

  /**
   * Initialize outreach templates for different funding sources
   */
  private initializeTemplates(): void {
    this.templates = [
      {
        id: "base-builder-grant",
        name: "Base Builder Grant Application",
        source: "base",
        subject: "Base Builder Grant Application - DreamNet",
        body: `Hello Base Team,

I'm reaching out regarding the Base Builder Grant program. DreamNet is building a living mesh of autonomous agents and mini-apps on Base, and we believe we're a strong fit for your grant program.

**Project Overview:**
DreamNet is a decentralized platform where dreams evolve into autonomous products. We're deploying mini-apps on Base including:
- DREAM Rewards Hub (live)
- Creator Subscriptions (live)
- Dream Social Feed (live)
- Dream Contributions (live)

**Why Base:**
- We're committed to Base as our settlement layer
- Our DeployKeeper agent automates Base deployments
- Revenue routing flows through Base contracts
- We're building composable mini-apps that enhance Base ecosystem

**Grant Request:**
We're seeking {{amount}} to accelerate development of:
- Additional mini-apps
- Agent system improvements
- Base-native integrations
- Community growth initiatives

**Metrics:**
- {{metrics}}

Looking forward to discussing how DreamNet can contribute to the Base ecosystem.

Best,
DreamNet Team`,
        variables: ["amount", "metrics"],
      },
      {
        id: "op-retro-funding",
        name: "Optimism Retroactive Funding",
        source: "optimism",
        subject: "Retroactive Public Goods Funding - DreamNet",
        body: `Hello Optimism Team,

DreamNet is applying for Retroactive Public Goods Funding. We've built open-source infrastructure that benefits the entire ecosystem.

**What We've Built:**
- Open-source agent orchestration system
- Base mini-app framework
- Decentralized dream evolution platform
- Public goods tooling

**Impact:**
{{impact}}

**Request:**
{{amount}} in retroactive funding for our public goods contributions.

Thank you for considering DreamNet.

Best,
DreamNet Team`,
        variables: ["impact", "amount"],
      },
    ];
  }

  /**
   * Start automated discovery loop
   */
  private startDiscoveryLoop(): void {
    // Run discovery every 6 hours (more aggressive for active hunting)
    setInterval(() => {
      this.discoverOpportunities().catch((err) => {
        console.error("[Wolf Pack] Discovery error:", err);
      });
    }, 6 * 60 * 60 * 1000); // 6 hours

    // Initial discovery - START HUNTING NOW
    console.log("🐺 [Wolf Pack] Starting hunt...");
    this.discoverOpportunities().catch((err) => {
      console.error("[Wolf Pack] Initial discovery error:", err);
    });
  }

  /**
   * Discover funding opportunities
   */
  async discoverOpportunities(): Promise<FundingOpportunity[]> {
    const discovered: FundingOpportunity[] = [];

    // Base Builder Grants
    discovered.push({
      id: randomUUID(),
      source: "base",
      name: "Base Builder Grant",
      description: "Retroactive grants for builders on Base (1-5 ETH)",
      url: "https://base.org/ecosystem/grants",
      amount: { min: 1, max: 5, currency: "ETH" },
      requirements: [
        "Building on Base",
        "Active project with users",
        "Clear roadmap",
      ],
      status: "discovered",
      discoveredAt: new Date().toISOString(),
      tags: ["base", "builder", "retroactive"],
      priority: "high",
    });

    // Optimism Retroactive Funding
    discovered.push({
      id: randomUUID(),
      source: "optimism",
      name: "Optimism Retroactive Public Goods Funding",
      description: "Retroactive funding for public goods contributions",
      url: "https://optimism.io/retropgf",
      amount: { min: 1, max: 10, currency: "OP" },
      requirements: [
        "Public goods contribution",
        "Open source",
        "Ecosystem benefit",
      ],
      status: "discovered",
      discoveredAt: new Date().toISOString(),
      tags: ["optimism", "retroactive", "public-goods"],
      priority: "medium",
    });

    // Store discovered opportunities
    for (const opp of discovered) {
      this.opportunities.set(opp.id, opp);
    }

    console.log(`[Wolf Pack] Discovered ${discovered.length} funding opportunities`);
    return discovered;
  }

  /**
   * Create a new funding hunt
   */
  createHunt(
    targetAmount: number,
    targetSources: FundingSource[],
    userId?: string,
  ): FundingHunt {
    const hunt: FundingHunt = {
      id: randomUUID(),
      userId,
      targetAmount,
      targetSources,
      status: "active",
      opportunities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.hunts.set(hunt.id, hunt);
    return hunt;
  }

  /**
   * Add opportunity to hunt
   */
  addOpportunityToHunt(huntId: string, opportunityId: string): void {
    const hunt = this.hunts.get(huntId);
    const opp = this.opportunities.get(opportunityId);
    if (!hunt || !opp) return;

    if (!hunt.opportunities.find((o) => o.id === opportunityId)) {
      hunt.opportunities.push(opp);
      hunt.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Update opportunity status
   */
  updateOpportunityStatus(
    opportunityId: string,
    status: FundingStatus,
    notes?: string,
  ): void {
    const opp = this.opportunities.get(opportunityId);
    if (!opp) return;

    opp.status = status;
    if (status === "applied") {
      opp.appliedAt = new Date().toISOString();
    }
    if (notes) {
      opp.notes = notes;
    }
  }

  /**
   * Generate outreach message
   */
  generateOutreach(
    opportunityId: string,
    templateId: string,
    variables: Record<string, string>,
  ): { subject: string; body: string } | null {
    const opp = this.opportunities.get(opportunityId);
    const template = this.templates.find((t) => t.id === templateId);
    if (!opp || !template) return null;

    let subject = template.subject;
    let body = template.body;

    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      subject = subject.replace(`{{${key}}}`, value);
      body = body.replace(`{{${key}}}`, value);
    }

    return { subject, body };
  }

  /**
   * Get hunt by ID
   */
  getHunt(huntId: string): FundingHunt | undefined {
    return this.hunts.get(huntId);
  }

  /**
   * Get all hunts (filtered by userId if provided for paid feature)
   */
  getHunts(userId?: string): FundingHunt[] {
    const allHunts = Array.from(this.hunts.values());
    if (userId) {
      return allHunts.filter((h) => h.userId === userId);
    }
    return allHunts;
  }

  /**
   * Get all opportunities
   */
  getOpportunities(): FundingOpportunity[] {
    return Array.from(this.opportunities.values());
  }

  /**
   * Get opportunities by source
   */
  getOpportunitiesBySource(source: FundingSource): FundingOpportunity[] {
    return Array.from(this.opportunities.values()).filter(
      (opp) => opp.source === source,
    );
  }

  /**
   * Get hunt statistics
   */
  getHuntStats(huntId: string): {
    totalOpportunities: number;
    byStatus: Record<FundingStatus, number>;
    totalPotential: number;
  } | null {
    const hunt = this.hunts.get(huntId);
    if (!hunt) return null;

    const byStatus: Record<FundingStatus, number> = {
      discovered: 0,
      researching: 0,
      applied: 0,
      interview: 0,
      approved: 0,
      rejected: 0,
      funded: 0,
    };

    let totalPotential = 0;

    for (const opp of hunt.opportunities) {
      byStatus[opp.status]++;
      if (opp.amount) {
        totalPotential += opp.amount.max;
      }
    }

    return {
      totalOpportunities: hunt.opportunities.length,
      byStatus,
      totalPotential,
    };
  }
}

// Export singleton
export const wolfPack = new WolfPackFundingHunter();

