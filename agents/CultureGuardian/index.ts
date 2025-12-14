/**
 * CultureGuardian Agent
 * Protects and moderates culturecoin content and communities
 */

import type { Agent } from "../../core/types.js";
import { runCultureGuardianTask } from "./service.js";

export const CultureGuardianAgent: Agent = {
  name: "CultureGuardian",
  description: "Protects and moderates culturecoin content and communities",
  capabilities: [
    "moderate",
    "protect",
  ],
  async run(payload) {
    return runCultureGuardianTask(payload);
  },
};


