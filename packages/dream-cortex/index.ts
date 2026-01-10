import type {
  DreamNode,
  DreamStatus,
  DreamPriority,
  CortexContext,
  CortexStatus,
  CortexDirective,
} from './types.js';
import { DreamRegistry } from './store/dreamRegistry.js';
import { runCortexCycle, cortexStatus } from './scheduler/cortexScheduler.js';

export const DreamCortex = {
  upsertDream(dream: Partial<DreamNode> & { id: string; name: string }) {
    return DreamRegistry.upsert(dream);
  },

  setDreamStatus(id: string, status: DreamStatus) {
    return DreamRegistry.setStatus(id, status);
  },

  setDreamPriority(id: string, priority: DreamPriority) {
    return DreamRegistry.setPriority(id, priority);
  },

  listDreams(): DreamNode[] {
    return DreamRegistry.getAll();
  },

  run(context: CortexContext): CortexStatus {
    return runCortexCycle(context);
  },

  status(): CortexStatus {
    return cortexStatus();
  },
};

export * from './types.js';
export { DreamRegistry };
export default DreamCortex;

