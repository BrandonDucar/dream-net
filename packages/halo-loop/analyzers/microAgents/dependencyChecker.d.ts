import type { MicroAgentResult } from "../swarmPatrol";
export declare const dependencyChecker: {
    id: string;
    name: string;
    check(): Promise<MicroAgentResult>;
};
