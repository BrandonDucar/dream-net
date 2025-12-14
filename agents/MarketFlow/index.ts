/**
 * MarketFlow Agent
 * Analyzes market trends and flow for culturecoins
 */

import type { Agent } from "../../core/types.js";
import { runMarketFlowTask } from "./service.js";

export const MarketFlowAgent: Agent = {
  name: "MarketFlow",
  description: "Analyzes market trends and flow for culturecoins",
  capabilities: [
    "analyze",
    "predict",
  ],
  async run(payload) {
    return runMarketFlowTask(payload);
  },
};


