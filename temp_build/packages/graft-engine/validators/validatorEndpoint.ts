import fs from "node:fs/promises";
import path from "node:path";
import type { GraftModel, GraftValidator, ValidationResult } from "../types";

export class EndpointValidator implements GraftValidator {
  async validate(graft: GraftModel): Promise<ValidationResult> {
    const issues: string[] = [];

    if (!graft.path.startsWith("/api/")) {
      issues.push("Endpoint grafts must target paths under /api/");
    }

    const routeSlug = graft.path.replace("/api/", "");
    if (!routeSlug) {
      issues.push("Invalid endpoint path");
    }

    const existingPath = path.resolve(process.cwd(), "server/routes/grafted", `${routeSlug}.ts`);
    try {
      await fs.access(existingPath);
      issues.push(`Route for ${routeSlug} already exists`);
    } catch {
      // file does not exist, ok
    }

    return {
      ok: issues.length === 0,
      issues,
    };
  }
}


