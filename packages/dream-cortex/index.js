import { DreamRegistry } from "./store/dreamRegistry";
import { runCortexCycle, cortexStatus } from "./scheduler/cortexScheduler";
export const DreamCortex = {
    upsertDream(dream) {
        return DreamRegistry.upsert(dream);
    },
    setDreamStatus(id, status) {
        return DreamRegistry.setStatus(id, status);
    },
    setDreamPriority(id, priority) {
        return DreamRegistry.setPriority(id, priority);
    },
    listDreams() {
        return DreamRegistry.getAll();
    },
    run(context) {
        return runCortexCycle(context);
    },
    status() {
        return cortexStatus();
    },
};
export * from "./types";
export { DreamRegistry };
export default DreamCortex;
