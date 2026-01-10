
export * from './logic/emitter.js';

import { VibeEmitter } from './logic/emitter.js';

export const Vibes = {
    sense: VibeEmitter.analyze
};
