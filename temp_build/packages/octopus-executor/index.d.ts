import type { OctopusTask, OctopusContext, OctopusRuntimeStatus } from "./types";
export declare const OctopusExecutor: {
    init(): Promise<void>;
    enqueue(task: OctopusTask): void;
    run(context: OctopusContext): Promise<void>;
    status(): OctopusRuntimeStatus;
};
export * from "./types";
export default OctopusExecutor;
