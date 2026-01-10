import type {
  NarrativeEntry,
  NarrativeFilter,
  NarrativeContext,
  NarrativeStatus,
  NarrativeSeverity,
  NarrativeDomain,
  NarrativeReference,
} from "./types";
import { NarrativeStore } from "./store/narrativeStore";
import { runNarrativeCycle, narrativeStatus } from "./scheduler/narrativeScheduler";

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

export * from "./types";
export default NarrativeField;

