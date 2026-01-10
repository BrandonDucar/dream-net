import type { OctopusTask, OctopusContext, OctopusRuntimeStatus } from './types.js';
export declare const OctopusExecutor: {
    init(): Promise<void>;
    enqueue(task: OctopusTask): void;
    run(context: OctopusContext): Promise<void>;
    status(): OctopusRuntimeStatus;
};
export * from './types.js';
export default OctopusExecutor;
//# sourceMappingURL=index.d.ts.map