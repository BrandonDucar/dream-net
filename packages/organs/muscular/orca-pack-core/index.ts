import {
  OrcaChannel,
  OrcaContentKind,
  OrcaPlanStatus,
  OrcaNarrativeTheme,
  OrcaPostIdea,
  OrcaPostPlan,
  OrcaEngagement,
  OrcaInsight,
  OrcaPackContext,
  OrcaPackStatus,
} from './types.js';
import { OrcaStore } from './store/orcaStore.js';
import { runOrcaPackCycle } from './scheduler/orcaScheduler.js';

export const OrcaPackCore = {
  run(context: OrcaPackContext): Promise<OrcaPackStatus> {
    return runOrcaPackCycle(context);
  },

  status(): OrcaPackStatus {
    return OrcaStore.status();
  },

  upsertTheme(theme: OrcaNarrativeTheme): OrcaNarrativeTheme {
    return OrcaStore.upsertTheme(theme);
  },

  listThemes(): OrcaNarrativeTheme[] {
    return OrcaStore.listThemes();
  },

  upsertIdea(idea: OrcaPostIdea): OrcaPostIdea {
    return OrcaStore.upsertIdea(idea);
  },

  listIdeas(): OrcaPostIdea[] {
    return OrcaStore.listIdeas();
  },

  upsertPlan(plan: OrcaPostPlan): OrcaPostPlan {
    return OrcaStore.upsertPlan(plan);
  },

  listPlans(): OrcaPostPlan[] {
    return OrcaStore.listPlans();
  },

  listInsights(): OrcaInsight[] {
    return OrcaStore.listInsights();
  },
};

export * from './types.js';
export * from './logic/orcaOutreachCore.js';
export default OrcaPackCore;


