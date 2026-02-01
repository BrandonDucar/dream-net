import type { OctopusTask, OctopusContext } from '../types.js';
export declare function enqueueTask(task: OctopusTask): void;
export declare function getQueuedTaskCount(): number;
export declare function runOctopusCycle(ctx: OctopusContext): Promise<void>;
//# sourceMappingURL=octopusEngine.d.ts.map