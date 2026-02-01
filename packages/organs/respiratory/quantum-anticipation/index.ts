import type { QALContext, QALPrediction } from './types.js';
import { runQALCycle, qalStatus } from './scheduler/qalScheduler.js';

export const QuantumAnticipation = {
  run(context: QALContext): QALPrediction[] {
    return runQALCycle(context);
  },

  status() {
    return qalStatus();
  },
};

export * from './types.js';
export default QuantumAnticipation;

