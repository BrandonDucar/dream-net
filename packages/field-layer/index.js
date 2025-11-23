import { FieldStore } from "./store/fieldStore";
import { runFieldCycle } from "./scheduler/fieldScheduler";
export const FieldLayer = {
    configure(config) {
        FieldStore.configure(config);
    },
    run(context) {
        return runFieldCycle(context);
    },
    status() {
        return FieldStore.status();
    },
    sample(field, point) {
        return FieldStore.getSample(field, point);
    },
    allSamples() {
        return FieldStore.getAllSamples();
    },
};
export * from "./types";
export default FieldLayer;
