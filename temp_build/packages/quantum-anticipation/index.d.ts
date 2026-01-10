import type { QALContext, QALPrediction } from "./types";
export declare const QuantumAnticipation: {
    run(context: QALContext): QALPrediction[];
    status(): {
        lastRunAt: number;
        lastPredictionsCount: number;
    };
};
export * from "./types";
export default QuantumAnticipation;
