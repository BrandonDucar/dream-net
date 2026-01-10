import type { AliveStatus, AliveSubsystemStatus } from './types.js';
export declare function checkSquadBuilder(): Promise<AliveSubsystemStatus>;
export declare function checkHalo(): Promise<AliveSubsystemStatus>;
export declare function checkApiForge(): Promise<AliveSubsystemStatus>;
export declare function checkGraftEngine(): Promise<AliveSubsystemStatus>;
export declare function checkSporeEngine(): Promise<AliveSubsystemStatus>;
export declare function checkEventWormholes(): Promise<AliveSubsystemStatus>;
export declare function checkMemoryDna(): Promise<AliveSubsystemStatus>;
export declare function checkDarkFabric(): Promise<AliveSubsystemStatus>;
export declare function checkDreamScope(): Promise<AliveSubsystemStatus>;
export declare function runBootSequence(): Promise<AliveStatus>;
export declare function getStatus(): Promise<AliveStatus>;
//# sourceMappingURL=aliveEngine.d.ts.map