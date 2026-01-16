import type { WolfContext, WolfSignal, WolfPackStatus } from './types.js';
export declare const WolfPack: {
    run(context: WolfContext): {
        signals: WolfSignal[];
        strikes: any[];
    };
    status(): WolfPackStatus;
    listTargets(): string[];
    clearTarget(targetId: string): void;
    clearAllTargets(): void;
    createAgent(meta: any): Promise<{
        id: string;
        ok: boolean;
    }>;
    listAgents(): any[];
    assignTask(agentId: string, task: any): Promise<{
        ok: boolean;
    }>;
};
export * from './types.js';
export default WolfPack;
