import type { QALContext, QALPrediction } from '../types.js';
export declare function runQALCycle(ctx: QALContext): QALPrediction[];
export declare function qalStatus(): {
    lastRunAt: number | null;
    lastPredictionsCount: number;
};
