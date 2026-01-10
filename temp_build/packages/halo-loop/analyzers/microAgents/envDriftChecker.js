"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envDriftChecker = void 0;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
exports.envDriftChecker = {
    id: "swarm-env-003",
    name: "Environment Variable Drift Check",
    async check() {
        const envExamplePath = (0, node_path_1.join)(process.cwd(), ".env.example");
        const envPath = (0, node_path_1.join)(process.cwd(), ".env");
        if (!(0, node_fs_1.existsSync)(envExamplePath)) {
            return {
                agentId: this.id,
                checkName: this.name,
                status: "amber",
                message: ".env.example not found - cannot check drift",
            };
        }
        try {
            const exampleContent = (0, node_fs_1.readFileSync)(envExamplePath, "utf-8");
            const exampleVars = new Set(exampleContent
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line && !line.startsWith("#") && line.includes("="))
                .map((line) => line.split("=")[0].trim()));
            const missingInEnv = [];
            const extraInEnv = [];
            if ((0, node_fs_1.existsSync)(envPath)) {
                const envContent = (0, node_fs_1.readFileSync)(envPath, "utf-8");
                const envVars = new Set(envContent
                    .split("\n")
                    .map((line) => line.trim())
                    .filter((line) => line && !line.startsWith("#") && line.includes("="))
                    .map((line) => line.split("=")[0].trim()));
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
            }
            else {
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
            }
            else if (missingInEnv.length > 0) {
                return {
                    agentId: this.id,
                    checkName: this.name,
                    status: "amber",
                    message: `Missing env vars: ${missingInEnv.slice(0, 5).join(", ")}${missingInEnv.length > 5 ? "..." : ""}`,
                    metadata: { missing: missingInEnv, extra: extraInEnv },
                };
            }
            else {
                return {
                    agentId: this.id,
                    checkName: this.name,
                    status: "green",
                    message: `Extra env vars (not in example): ${extraInEnv.length}`,
                    metadata: { extra: extraInEnv },
                };
            }
        }
        catch (error) {
            return {
                agentId: this.id,
                checkName: this.name,
                status: "red",
                message: `Failed to check env drift: ${error.message}`,
            };
        }
    },
};
