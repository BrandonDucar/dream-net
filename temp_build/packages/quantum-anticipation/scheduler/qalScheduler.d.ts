import type { QALContext, QALPrediction } from "../types";
export declare function runQALCycle(ctx: QALContext): QALPrediction[];
export declare function qalStatus(): {
    lastRunAt: number;
    lastPredictionsCount: number;
};
