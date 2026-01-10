"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitStore = void 0;
const templates = new Map();
const identityStates = new Map();
let lastRunAt = null;
exports.InitStore = {
    upsertTemplate(template) {
        templates.set(template.id, template);
        return template;
    },
    getTemplate(id) {
        return templates.get(id);
    },
    listTemplates() {
        return Array.from(templates.values());
    },
    getOrCreateIdentityState(identityId, templateId) {
        const existing = identityStates.get(identityId);
        const now = Date.now();
        if (existing)
            return existing;
        const state = {
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
    updateIdentityState(state) {
        state.updatedAt = Date.now();
        identityStates.set(state.identityId, state);
        return state;
    },
    getIdentityState(identityId) {
        return identityStates.get(identityId);
    },
    listIdentityStates() {
        return Array.from(identityStates.values());
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    status() {
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
