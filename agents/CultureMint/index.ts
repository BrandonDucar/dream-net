/**
 * CultureMint Agent
 * Mints culturecoins and manages token creation
 */

import type { Agent } from "../../core/types.js";
import { runCultureMintTask } from "./service.js";

export const CultureMintAgent: Agent = {
  name: "CultureMint",
  description: "Mints culturecoins and manages token creation",
  capabilities: [
    "mint",
    "deploy",
  ],
  async run(payload) {
    return runCultureMintTask(payload);
  },
};


