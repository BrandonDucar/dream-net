import type { MicroAgentResult } from "../swarmPatrol";
export declare const dnsChecker: {
    id: string;
    name: string;
    check(): Promise<MicroAgentResult>;
};
