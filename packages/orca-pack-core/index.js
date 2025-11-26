import { OrcaStore } from "./store/orcaStore";
import { runOrcaPackCycle } from "./scheduler/orcaScheduler";
export const OrcaPackCore = {
    run(context) {
        return runOrcaPackCycle(context);
    },
    status() {
        return OrcaStore.status();
    },
    upsertTheme(theme) {
        return OrcaStore.upsertTheme(theme);
    },
    listThemes() {
        return OrcaStore.listThemes();
    },
    upsertIdea(idea) {
        return OrcaStore.upsertIdea(idea);
    },
    listIdeas() {
        return OrcaStore.listIdeas();
    },
    upsertPlan(plan) {
        return OrcaStore.upsertPlan(plan);
    },
    listPlans() {
        return OrcaStore.listPlans();
    },
    listInsights() {
        return OrcaStore.listInsights();
    },
};
export * from "./types";
export * from "./logic/orcaOutreachCore";
export default OrcaPackCore;
