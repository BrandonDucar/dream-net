import type { MicroAgentResult } from "../swarmPatrol";
export declare const healthChecker: {
    id: string;
    name: string;
    check(): Promise<MicroAgentResult>;
};
