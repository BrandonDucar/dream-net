/**
 * RemixEngine Agent
 * Remixes and transforms text content
 */

import type { Agent } from "../../core/types.js";
import { runRemixEngineTask } from "./service.js";

export const RemixEngineAgent: Agent = {
  name: "RemixEngine",
  description: "Remixes and transforms text content for different contexts and audiences",
  capabilities: [
    "remix",
    "shorten",
    "expand",
  ],
  async run(payload) {
    return runRemixEngineTask(payload);
  },
};

