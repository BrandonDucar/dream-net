
export * from "./logic/emitter";

import { VibeEmitter } from "./logic/emitter";

export const Vibes = {
    sense: VibeEmitter.analyze
};
