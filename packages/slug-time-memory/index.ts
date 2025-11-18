import type {
  SlugMetricKind,
  SlugMetricSample,
  SlugMetricSnapshot,
  SlugTimeConfig,
  SlugTimeContext,
  SlugTimeStatus,
} from "./types";
import { SlugMemoryStore } from "./store/slugMemoryStore";
import { runSlugTimeCycle, slugTimeStatus } from "./scheduler/slugScheduler";

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

export * from "./types";
export default SlugTimeMemory;

