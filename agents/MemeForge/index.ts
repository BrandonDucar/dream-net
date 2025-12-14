/**
 * MemeForge Agent
 * Creates memes, captions, and platform-optimized content
 */

import type { Agent } from "../../core/types.js";
import { runMemeForgeTask } from "./service.js";

export const MemeForgeAgent: Agent = {
  name: "MemeForge",
  description: "Creates memes, captions, and platform-optimized content for culturecoins",
  capabilities: [
    "create_2panel",
    "caption",
    "platform_variants",
  ],
  async run(payload) {
    return runMemeForgeTask(payload);
  },
};

