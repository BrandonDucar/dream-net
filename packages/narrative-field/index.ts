import type {
  NarrativeEntry,
  NarrativeFilter,
  NarrativeContext,
  NarrativeStatus,
  NarrativeSeverity,
  NarrativeDomain,
  NarrativeReference,
} from './types.js';
import { NarrativeStore } from './store/narrativeStore.js';
import { runNarrativeCycle, narrativeStatus } from './scheduler/narrativeScheduler.js';

export const NarrativeField = {
  add(entry: NarrativeEntry) {
    NarrativeStore.add(entry);
  },

  list(filter?: NarrativeFilter): NarrativeEntry[] {
    return NarrativeStore.list(filter);
  },

  run(context: NarrativeContext): NarrativeStatus {
    return runNarrativeCycle(context);
  },

  status(): NarrativeStatus {
    return narrativeStatus();
  },
};

export * from './types.js';
export default NarrativeField;

