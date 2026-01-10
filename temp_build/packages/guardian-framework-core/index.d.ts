export * from "./logic/shields";
export * from "./logic/goldenDome";
export * from "./logic/aegisFleet";
import { AegisFleet } from "./logic/aegisFleet";
export declare const GuardianFramework: {
    runCycle: typeof AegisFleet.runDefenseCycle;
    init: () => void;
    status: () => {
        activeShields: number;
    };
};
