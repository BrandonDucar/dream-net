import { NarrativeStore } from './store/narrativeStore.js';
import { runNarrativeCycle, narrativeStatus } from './scheduler/narrativeScheduler.js';
export const NarrativeField = {
    add(entry) {
        NarrativeStore.add(entry);
    },
    list(filter) {
        return NarrativeStore.list(filter);
    },
    run(context) {
        return runNarrativeCycle(context);
    },
    status() {
        return narrativeStatus();
    },
};
export * from './types.js';
export default NarrativeField;
//# sourceMappingURL=index.js.map