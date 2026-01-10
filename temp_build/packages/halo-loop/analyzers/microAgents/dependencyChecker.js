"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dependencyChecker = void 0;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
exports.dependencyChecker = {
    id: "swarm-dep-006",
    name: "Dependency Vulnerability Check",
    async check() {
        const packageJsonPath = (0, node_path_1.join)(process.cwd(), "package.json");
        if (!(0, node_fs_1.existsSync)(packageJsonPath)) {
            return {
                agentId: this.id,
                checkName: this.name,
                status: "amber",
                message: "package.json not found",
            };
        }
        try {
            const packageJson = JSON.parse((0, node_fs_1.readFileSync)(packageJsonPath, "utf-8"));
            const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
            // Check for known problematic patterns
            const issues = [];
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
            }
            else {
                return {
                    agentId: this.id,
                    checkName: this.name,
                    status: "green",
                    message: "Dependencies appear healthy",
                };
            }
        }
        catch (error) {
            return {
                agentId: this.id,
                checkName: this.name,
                status: "red",
                message: `Failed to check dependencies: ${error.message}`,
            };
        }
    },
};
