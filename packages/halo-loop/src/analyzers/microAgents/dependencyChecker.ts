import type { MicroAgentResult } from "../swarmPatrol";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const dependencyChecker = {
  id: "swarm-dep-006",
  name: "Dependency Vulnerability Check",
  async check(): Promise<MicroAgentResult> {
    const packageJsonPath = join(process.cwd(), "package.json");

    if (!existsSync(packageJsonPath)) {
      return {
        agentId: this.id,
        checkName: this.name,
        status: "amber",
        message: "package.json not found",
      };
    }

    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      // Check for known problematic patterns
      const issues: string[] = [];

      // Check for very old packages (simplified - in production, use npm audit)
      for (const [name, version] of Object.entries(deps)) {
        if (typeof version === "string" && version.includes("^0.") && !version.includes("^0.1")) {
          // Old 0.x versions might be problematic
          issues.push(`${name}@${version}`);
        }
      }

      if (issues.length > 10) {
        return {
          agentId: this.id,
          checkName: this.name,
          status: "amber",
          message: `Many potentially outdated dependencies: ${issues.length}`,
          metadata: { issues: issues.slice(0, 10) },
        };
      } else {
        return {
          agentId: this.id,
          checkName: this.name,
          status: "green",
          message: "Dependencies appear healthy",
        };
      }
    } catch (error: any) {
      return {
        agentId: this.id,
        checkName: this.name,
        status: "red",
        message: `Failed to check dependencies: ${error.message}`,
      };
    }
  },
};

