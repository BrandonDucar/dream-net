
export * from './logic/shields.js';
export * from './logic/goldenDome.js';
export * from './logic/aegisFleet.js';

import { AegisFleet } from './logic/aegisFleet.js';

export const GuardianFramework = {
    runCycle: AegisFleet.runDefenseCycle,
    init: () => {
        console.log("🛡️ [Guardian] Initializing Defense Grid...");
        AegisFleet.runDefenseCycle();
    },
    status: () => ({ activeShields: 3 })
};
