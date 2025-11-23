import { SlugMemoryStore } from "./store/slugMemoryStore";
import { runSlugTimeCycle, slugTimeStatus } from "./scheduler/slugScheduler";
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
export * from "./types";
export default SlugTimeMemory;
