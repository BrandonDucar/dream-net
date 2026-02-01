import { SlugMemoryStore } from './store/slugMemoryStore.js';
import { runSlugTimeCycle, slugTimeStatus } from './scheduler/slugScheduler.js';
export const SlugTimeMemory = {
    configure(config) {
        SlugMemoryStore.configure(config);
    },
    addSample(sample) {
        SlugMemoryStore.addSample(sample);
    },
    run(context) {
        return runSlugTimeCycle(context);
    },
    status() {
        return slugTimeStatus();
    },
};
export * from './types.js';
export default SlugTimeMemory;
//# sourceMappingURL=index.js.map