import type {
  InitFlowTemplate,
  InitStep,
  IdentityInitState,
  InitStage,
  InitRitualStatus,
} from "../types";

const templates: Map<string, InitFlowTemplate> = new Map();
const identityStates: Map<string, IdentityInitState> = new Map();

let lastRunAt: number | null = null;

export const InitStore = {
  upsertTemplate(template: InitFlowTemplate): InitFlowTemplate {
    templates.set(template.id, template);
    return template;
  },

  getTemplate(id: string): InitFlowTemplate | undefined {
    return templates.get(id);
  },

  listTemplates(): InitFlowTemplate[] {
    return Array.from(templates.values());
  },

  getOrCreateIdentityState(identityId: string, templateId: string): IdentityInitState {
    const existing = identityStates.get(identityId);
    const now = Date.now();

    if (existing) return existing;

    const state: IdentityInitState = {
      identityId,
      templateId,
      stage: "not-started",
      completedStepIds: [],
      createdAt: now,
      updatedAt: now,
    };

    identityStates.set(identityId, state);
    return state;
  },

  updateIdentityState(state: IdentityInitState): IdentityInitState {
    state.updatedAt = Date.now();
    identityStates.set(state.identityId, state);
    return state;
  },

  getIdentityState(identityId: string): IdentityInitState | undefined {
    return identityStates.get(identityId);
  },

  listIdentityStates(): IdentityInitState[] {
    return Array.from(identityStates.values());
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  status(): InitRitualStatus {
    const allStates = Array.from(identityStates.values());
    const completedCount = allStates.filter((s) => s.stage === "completed").length;

    return {
      lastRunAt,
      templateCount: templates.size,
      activeIdentityCount: allStates.length,
      completedCount,
      sampleStates: allStates.slice(0, 25),
    };
  },
};

