import path from "node:path";
import type { GraftModel, GraftValidator, ValidationResult } from '../types.js';

export class ModuleValidator implements GraftValidator {
  async validate(graft: GraftModel): Promise<ValidationResult> {
    const issues: string[] = [];

    if (!graft.path) {
      issues.push("Module graft requires target path");
    }

    const target = (graft.metadata as any).target ?? "apps";
    if (!["apps", "packages"].includes(target)) {
      issues.push("metadata.target must be \"apps\" or \"packages\"");
    }

    const absolute = path.resolve(process.cwd(), `${target}/${graft.name}`);
    if (!absolute.includes(`${target}/`)) {
      issues.push("Invalid module destination");
    }

    return {
      ok: issues.length === 0,
      issues,
    };
  }
}


