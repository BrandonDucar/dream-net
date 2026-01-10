import { runQALCycle, qalStatus } from './scheduler/qalScheduler.js';
export const QuantumAnticipation = {
    run(context) {
        return runQALCycle(context);
    },
    status() {
        return qalStatus();
    },
};
export * from './types.js';
export default QuantumAnticipation;
//# sourceMappingURL=index.js.map