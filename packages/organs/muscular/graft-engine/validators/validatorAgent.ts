import fs from "node:fs/promises";
import path from "node:path";
import type { GraftModel, GraftValidator, ValidationResult } from '../types.js';

export class AgentValidator implements GraftValidator {
  async validate(graft: GraftModel): Promise<ValidationResult> {
    const issues: string[] = [];

    const metadata = graft.metadata as any;
    if (!metadata?.role || typeof metadata.role !== "string") {
      issues.push("Agent grafts require metadata.role");
    }
    if (!metadata?.capabilities || !Array.isArray(metadata.capabilities)) {
      issues.push("Agent grafts require metadata.capabilities array");
    }

    const registryPath = path.resolve(process.cwd(), "packages/agents/graftedAgents.json");
    try {
      await fs.access(registryPath);
    } catch {
      // no file yet, that's fine
    }

    return {
      ok: issues.length === 0,
      issues,
    };
  }
}


