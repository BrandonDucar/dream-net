
export * from './logic/baseMeme.js';
export * from './logic/flaunch.js';

import { BaseMemeScanner } from './logic/baseMeme.js';
import { FlaunchSniper } from './logic/flaunch.js';

export const MicroMarket = {
    base: new BaseMemeScanner(),
    flaunch: new FlaunchSniper(),

    init() {
        console.log("🪙 [MicroMarket] Agents Activated. Hunting alpha.");
    }
};
