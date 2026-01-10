"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TankStore = void 0;
const dreams = new Map();
const milestones = new Map();
const evaluations = [];
let lastRunAt = null;
exports.TankStore = {
    upsertDream(partial) {
        const now = Date.now();
        const existing = dreams.get(partial.id);
        const merged = {
            id: partial.id,
            name: partial.name ?? existing?.name ?? "",
            description: partial.description ?? existing?.description,
            stage: partial.stage ?? existing?.stage ?? "seed",
            health: partial.health ?? existing?.health ?? "stable",
            cortexDreamId: partial.cortexDreamId ?? existing?.cortexDreamId,
            vaultBlueprintId: partial.vaultBlueprintId ?? existing?.vaultBlueprintId,
            ownerIdentityId: partial.ownerIdentityId ?? existing?.ownerIdentityId,
            tags: partial.tags ?? existing?.tags ?? [],
            priorityScore: partial.priorityScore ?? existing?.priorityScore ?? 0.5,
            trustScore: partial.trustScore ?? existing?.trustScore ?? 0.5,
            riskScore: partial.riskScore ?? existing?.riskScore ?? 0.5,
            createdAt: existing?.createdAt ?? now,
            updatedAt: now,
        };
        dreams.set(merged.id, merged);
        return merged;
    },
    getDream(id) {
        return dreams.get(id);
    },
    listDreams() {
        return Array.from(dreams.values());
    },
    upsertMilestone(partial) {
        const now = Date.now();
        const existing = milestones.get(partial.id);
        const merged = {
            id: partial.id,
            dreamId: partial.dreamId ?? existing?.dreamId ?? "",
            title: partial.title ?? existing?.title ?? "",
            description: partial.description ?? existing?.description,
            state: partial.state ?? existing?.state ?? "planned",
            order: partial.order ?? existing?.order,
            createdAt: existing?.createdAt ?? now,
            updatedAt: now,
        };
        milestones.set(merged.id, merged);
        return merged;
    },
    listMilestonesForDream(dreamId) {
        return Array.from(milestones.values()).filter((m) => m.dreamId === dreamId);
    },
    addEvaluation(ev) {
        evaluations.push(ev);
    },
    listEvaluations() {
        return evaluations;
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    status() {
        const sampleDreams = Array.from(dreams.values()).slice(0, 25);
        return {
            lastRunAt,
            dreamCount: dreams.size,
            milestoneCount: milestones.size,
            evaluationCount: evaluations.length,
            sampleDreams,
        };
    },
};
