/**
 * LoreSmith Agent
 * Creates and weaves narrative lore for culturecoins
 */

import type { Agent } from "../../core/types.js";
import { runLoreSmithTask } from "./service.js";

export const LoreSmithAgent: Agent = {
  name: "LoreSmith",
  description: "Creates and weaves narrative lore for culturecoins",
  capabilities: [
    "create",
    "expand",
    "weave",
  ],
  async run(payload) {
    return runLoreSmithTask(payload);
  },
};


