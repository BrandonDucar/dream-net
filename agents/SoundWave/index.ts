/**
 * SoundWave Agent
 * Creates audio content and sound generation
 */

import type { Agent } from "../../core/types.js";
import { runSoundWaveTask } from "./service.js";

export const SoundWaveAgent: Agent = {
  name: "SoundWave",
  description: "Creates audio content and sound generation",
  capabilities: [
    "generate",
    "remix",
  ],
  async run(payload) {
    return runSoundWaveTask(payload);
  },
};


