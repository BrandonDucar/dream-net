import type {
  RepEntityType,
  ReputationSignal,
  ReputationScore,
  ReputationConfig,
  ReputationContext,
  ReputationStatus,
} from './types.js';
import { ReputationStore } from './store/reputationStore.js';
import { runReputationCycle, reputationStatus } from './scheduler/reputationScheduler.js';

export const ReputationLattice = {
  configure(config: Partial<ReputationConfig>) {
    ReputationStore.configure(config);
  },

  addSignal(signal: ReputationSignal) {
    ReputationStore.addSignal(signal);
  },

  getScore(entityType: RepEntityType, entityId: string): ReputationScore | undefined {
    return ReputationStore.getScoreFor(entityType, entityId);
  },

  run(context: ReputationContext): ReputationStatus {
    return runReputationCycle(context);
  },

  status(): ReputationStatus {
    return reputationStatus();
  },
};

export * from './types.js';
export default ReputationLattice;

