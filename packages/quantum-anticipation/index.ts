import type { QALContext, QALPrediction } from "./types";
import { runQALCycle, qalStatus } from "./scheduler/qalScheduler";

export const QuantumAnticipation = {
  run(context: QALContext): QALPrediction[] {
    return runQALCycle(context);
  },

  status() {
    return qalStatus();
  },
};

export * from "./types";
export default QuantumAnticipation;

