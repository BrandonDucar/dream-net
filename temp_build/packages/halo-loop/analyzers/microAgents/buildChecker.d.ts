import type { MicroAgentResult } from "../swarmPatrol";
export declare const buildChecker: {
    id: string;
    name: string;
    check(): Promise<MicroAgentResult>;
};
