
export * from "./logic/shields";
export * from "./logic/goldenDome";
export * from "./logic/aegisFleet";

import { AegisFleet } from "./logic/aegisFleet";

export const GuardianFramework = {
    runCycle: AegisFleet.runDefenseCycle,
    init: () => {
        console.log("🛡️ [Guardian] Initializing Defense Grid...");
        AegisFleet.runDefenseCycle();
    },
    status: () => ({ activeShields: 3 })
};
