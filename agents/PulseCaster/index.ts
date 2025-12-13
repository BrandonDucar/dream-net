/**
 * PulseCaster Agent
 * Casts content across platforms and channels
 */

import type { Agent } from "../../core/types.js";
import { runPulseCasterTask } from "./service.js";

export const PulseCasterAgent: Agent = {
  name: "PulseCaster",
  description: "Casts content across platforms and channels",
  capabilities: [
    "cast",
    "analyze",
  ],
  async run(payload) {
    return runPulseCasterTask(payload);
  },
};


