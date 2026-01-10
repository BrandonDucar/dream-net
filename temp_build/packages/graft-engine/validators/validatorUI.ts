import path from "node:path";
import type { GraftModel, GraftValidator, ValidationResult } from "../types";

export class UIValidator implements GraftValidator {
  async validate(graft: GraftModel): Promise<ValidationResult> {
    const issues: string[] = [];

    if (!graft.metadata?.targetApp) {
      issues.push("UI grafts require metadata.targetApp (e.g. \"dreamscope\")");
    }
    if (!graft.path.endsWith(".tsx")) {
      issues.push("UI graft path should point to a .tsx file");
    }

    const appDir = path.resolve(process.cwd(), `apps/${graft.metadata?.targetApp || ""}`);
    if (!appDir.includes("apps/")) {
      issues.push("targetApp must resolve under apps/");
    }

    return {
      ok: issues.length === 0,
      issues,
    };
  }
}


