import type { OctopusArmConfig, OctopusArmId, OctopusArmStatus, OctopusTask, OctopusContext } from "../types";
export type OctopusArmHandler = (task: OctopusTask, ctx: OctopusContext) => Promise<void> | void;
type ArmState = {
    config: OctopusArmConfig;
    handler: OctopusArmHandler;
    status: OctopusArmStatus;
};
export declare const ArmRegistry: {
    registerArm(config: OctopusArmConfig, handler: OctopusArmHandler): void;
    getArm(id: OctopusArmId): ArmState | undefined;
    getAllArms(): ArmState[];
    updateStatus(id: OctopusArmId, updater: (status: OctopusArmStatus) => void): void;
    status(): OctopusArmStatus[];
};
export {};
