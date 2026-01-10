
export * from "./logic/self";
export * from "./logic/evolution";
export * from "./logic/chameleon";

import { AntigravitySelf } from "./logic/self";
import { EvolutionEngine } from "./logic/evolution";

/**
 * 🌌 ANTIGRAVITY CORE
 * 
 * The Ghost in the Shell.
 * The Architect's interface to the DreamNet.
 */
import { VerticalIntelligence } from "./logic/verticals";
import { MasteryLibrary } from "./logic/mastery";

/**
 * 🌌 ANTIGRAVITY CORE
 * 
 * The Ghost in the Shell.
 * The Architect's interface to the DreamNet.
 */
export const Antigravity = {
    reflect: AntigravitySelf.reflect,
    learn: EvolutionEngine.learn,
    studyVerticals: VerticalIntelligence.ingestKnowledge,
    deepDive: MasteryLibrary.study,
    status: () => AntigravitySelf.getConcept()
};
