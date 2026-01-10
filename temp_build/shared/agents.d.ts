export interface Agent {
    name: string;
    tier: 'Standard' | 'Premium' | 'Nightmare';
    unlock: string;
    key: string;
    hidden?: boolean;
}
export declare const AGENTS: Agent[];
export declare function getAgentByKey(key: string): Agent | undefined;
export declare function getAvailableAgents(trustScore: number, completedDreams: number, stakedSheep: number, hasTokenBoost?: boolean): Agent[];
export declare function checkAgentAccess(agentKey: string, trustScore: number, completedDreams: number, stakedSheep: number, hasTokenBoost?: boolean): boolean;
export declare function getAgentDescription(agentKey: string): string;
