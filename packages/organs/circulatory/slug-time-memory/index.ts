import type {
  SlugMetricKind,
  SlugMetricSample,
  SlugMetricSnapshot,
  SlugTimeConfig,
  SlugTimeContext,
  SlugTimeStatus,
} from './types.js';
import { SlugMemoryStore } from './store/slugMemoryStore.js';
import { runSlugTimeCycle, slugTimeStatus } from './scheduler/slugScheduler.js';

export const SlugTimeMemory = {
  configure(config: Partial<SlugTimeConfig>) {
    SlugMemoryStore.configure(config);
  },

  addSample(sample: SlugMetricSample) {
    SlugMemoryStore.addSample(sample);
  },

  run(context: SlugTimeContext): SlugTimeStatus {
    return runSlugTimeCycle(context);
  },

  status(): SlugTimeStatus {
    return slugTimeStatus();
  },
};

export * from './types.js';
export default SlugTimeMemory;

