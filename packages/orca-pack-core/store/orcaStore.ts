import {
  OrcaNarrativeTheme,
  OrcaPostIdea,
  OrcaPostPlan,
  OrcaEngagement,
  OrcaInsight,
  OrcaPackStatus,
} from '../types.js';

const themes: Map<string, OrcaNarrativeTheme> = new Map();
const ideas: Map<string, OrcaPostIdea> = new Map();
const plans: Map<string, OrcaPostPlan> = new Map();
const engagements: OrcaEngagement[] = [];
const insights: OrcaInsight[] = [];

const storeInstanceId = Math.random().toString(36).substring(7);
console.log(`[OrcaStore] 🐳 Module Initialized. Instance ID: ${storeInstanceId}`);

let lastRunAt: number | null = null;

export const OrcaStore = {
  upsertTheme(theme: OrcaNarrativeTheme): OrcaNarrativeTheme {
    themes.set(theme.id, theme);
    return theme;
  },

  listThemes(): OrcaNarrativeTheme[] {
    return Array.from(themes.values());
  },

  upsertIdea(idea: OrcaPostIdea): OrcaPostIdea {
    ideas.set(idea.id, idea);
    return idea;
  },

  listIdeas(): OrcaPostIdea[] {
    return Array.from(ideas.values());
  },

  upsertPlan(plan: OrcaPostPlan): OrcaPostPlan {
    plans.set(plan.id, plan);
    return plan;
  },

  listPlans(): OrcaPostPlan[] {
    return Array.from(plans.values());
  },

  addEngagement(e: OrcaEngagement) {
    engagements.push(e);
  },

  listEngagementsForPlan(planId: string): OrcaEngagement[] {
    return engagements.filter((x) => x.planId === planId);
  },

  addInsight(insight: OrcaInsight): OrcaInsight {
    insights.push(insight);
    return insight;
  },

  listInsights(): OrcaInsight[] {
    return insights;
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  status(): OrcaPackStatus {
    const sampleThemes = Array.from(themes.values()).slice(0, 10);
    const sampleIdeas = Array.from(ideas.values()).slice(0, 20);
    const allPlans = Array.from(plans.values());
    const samplePlans = allPlans.slice(0, 20);
    const postedCount = allPlans.filter((p) => p.status === "posted").length;
    const sampleInsights = insights.slice(0, 20);

    return {
      lastRunAt,
      themeCount: themes.size,
      ideaCount: ideas.size,
      planCount: allPlans.length,
      postedCount,
      insightCount: insights.length,
      sampleThemes,
      sampleIdeas,
      samplePlans,
      sampleInsights,
    };
  },
};


