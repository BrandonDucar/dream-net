import type { MicroAgentResult } from "../swarmPatrol";
export declare const quotaChecker: {
    id: string;
    name: string;
    check(): Promise<MicroAgentResult>;
};
