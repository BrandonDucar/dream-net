import type { MicroAgentResult } from "../swarmPatrol";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export const envDriftChecker = {
  id: "swarm-env-003",
  name: "Environment Variable Drift Check",
  async check(): Promise<MicroAgentResult> {
    const envExamplePath = join(process.cwd(), ".env.example");
    const envPath = join(process.cwd(), ".env");

    if (!existsSync(envExamplePath)) {
      return {
        agentId: this.id,
        checkName: this.name,
        status: "amber",
        message: ".env.example not found - cannot check drift",
      };
    }

    try {
      const exampleContent = readFileSync(envExamplePath, "utf-8");
      const exampleVars = new Set(
        exampleContent
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line && !line.startsWith("#") && line.includes("="))
          .map((line) => line.split("=")[0].trim())
      );

      const missingInEnv: string[] = [];
      const extraInEnv: string[] = [];

      if (existsSync(envPath)) {
        const envContent = readFileSync(envPath, "utf-8");
        const envVars = new Set(
          envContent
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith("#") && line.includes("="))
            .map((line) => line.split("=")[0].trim())
        );

        for (const varName of exampleVars) {
          if (!envVars.has(varName)) {
            missingInEnv.push(varName);
          }
        }

        for (const varName of envVars) {
          if (!exampleVars.has(varName)) {
            extraInEnv.push(varName);
          }
        }
      } else {
        // .env doesn't exist - all example vars are missing
        missingInEnv.push(...Array.from(exampleVars));
      }

      if (missingInEnv.length === 0 && extraInEnv.length === 0) {
        return {
          agentId: this.id,
          checkName: this.name,
          status: "green",
          message: "No environment variable drift detected",
        };
      } else if (missingInEnv.length > 0) {
        return {
          agentId: this.id,
          checkName: this.name,
          status: "amber",
          message: `Missing env vars: ${missingInEnv.slice(0, 5).join(", ")}${missingInEnv.length > 5 ? "..." : ""}`,
          metadata: { missing: missingInEnv, extra: extraInEnv },
        };
      } else {
        return {
          agentId: this.id,
          checkName: this.name,
          status: "green",
          message: `Extra env vars (not in example): ${extraInEnv.length}`,
          metadata: { extra: extraInEnv },
        };
      }
    } catch (error: any) {
      return {
        agentId: this.id,
        checkName: this.name,
        status: "red",
        message: `Failed to check env drift: ${error.message}`,
      };
    }
  },
};

