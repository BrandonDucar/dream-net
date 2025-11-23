import { ReputationStore } from "./store/reputationStore";
import { runReputationCycle, reputationStatus } from "./scheduler/reputationScheduler";
export const ReputationLattice = {
    configure(config) {
        ReputationStore.configure(config);
    },
    addSignal(signal) {
        ReputationStore.addSignal(signal);
    },
    getScore(entityType, entityId) {
        return ReputationStore.getScoreFor(entityType, entityId);
    },
    run(context) {
        return runReputationCycle(context);
    },
    status() {
        return reputationStatus();
    },
};
export * from "./types";
export default ReputationLattice;
