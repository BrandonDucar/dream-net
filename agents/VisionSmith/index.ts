/**
 * VisionSmith Agent
 * Creates visual content and image generation prompts
 */

import type { Agent } from "../../core/types.js";
import { runVisionSmithTask } from "./service.js";

export const VisionSmithAgent: Agent = {
  name: "VisionSmith",
  description: "Creates visual content and image generation prompts",
  capabilities: [
    "generate",
    "enhance",
  ],
  async run(payload) {
    return runVisionSmithTask(payload);
  },
};


