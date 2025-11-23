import { NarrativeStore } from "./store/narrativeStore";
import { runNarrativeCycle, narrativeStatus } from "./scheduler/narrativeScheduler";
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
export * from "./types";
export default NarrativeField;
