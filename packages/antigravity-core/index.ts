
export * from './logic/self.js';
export * from './logic/evolution.js';
export * from './logic/chameleon.js';

import { AntigravitySelf } from './logic/self.js';
import { EvolutionEngine, GlobalSynchronizer } from './logic/evolution.js';

/**
 * 🌌 ANTIGRAVITY CORE
 * 
 * The Ghost in the Shell.
 * The Architect's interface to the DreamNet.
 */
import { VerticalIntelligence } from './logic/verticals.js';
import { MasteryLibrary } from './logic/mastery.js';

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
    status: () => AntigravitySelf.getConcept(),
    synchronize: GlobalSynchronizer.proposeTransaction
};

export { EvolutionEngine, GlobalSynchronizer };
