import { DreamRegistry } from './store/dreamRegistry.js';
import { runCortexCycle, cortexStatus } from './scheduler/cortexScheduler.js';
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
export * from './types.js';
export { DreamRegistry };
export default DreamCortex;
//# sourceMappingURL=index.js.map