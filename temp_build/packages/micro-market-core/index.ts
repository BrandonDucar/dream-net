
export * from "./logic/baseMeme";
export * from "./logic/flaunch";

import { BaseMemeScanner } from "./logic/baseMeme";
import { FlaunchSniper } from "./logic/flaunch";

export const MicroMarket = {
    base: new BaseMemeScanner(),
    flaunch: new FlaunchSniper(),

    init() {
        console.log("🪙 [MicroMarket] Agents Activated. Hunting alpha.");
    }
};
