/**
 * MemeEngineCore Agent
 * Core orchestration engine for meme generation pipeline
 */

import type { Agent } from "../../core/types.js";
import { runMemeEngineCoreTask } from "./service.js";

export const MemeEngineCoreAgent: Agent = {
  name: "MemeEngineCore",
  description: "Core orchestration engine for meme generation pipeline",
  capabilities: [
    "generate",
    "pipeline",
  ],
  async run(payload) {
    return runMemeEngineCoreTask(payload);
  },
};


