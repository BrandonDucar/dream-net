import type { QALContext, QALPrediction } from './types.js';
export declare const QuantumAnticipation: {
    run(context: QALContext): QALPrediction[];
    status(): {
        lastRunAt: number | null;
        lastPredictionsCount: number;
    };
};
export * from './types.js';
export default QuantumAnticipation;
