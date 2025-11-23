import { runQALCycle, qalStatus } from "./scheduler/qalScheduler";
export const QuantumAnticipation = {
    run(context) {
        return runQALCycle(context);
    },
    status() {
        return qalStatus();
    },
};
export * from "./types";
export default QuantumAnticipation;
