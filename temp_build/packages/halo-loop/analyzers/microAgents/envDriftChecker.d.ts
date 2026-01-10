import type { MicroAgentResult } from "../swarmPatrol";
export declare const envDriftChecker: {
    id: string;
    name: string;
    check(): Promise<MicroAgentResult>;
};
