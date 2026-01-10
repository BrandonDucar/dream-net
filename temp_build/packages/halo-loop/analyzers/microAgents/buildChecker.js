"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildChecker = void 0;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
exports.buildChecker = {
    id: "swarm-build-005",
    name: "Build Artifact Check",
    async check() {
        const buildPaths = [
            (0, node_path_1.join)(process.cwd(), "dist"),
            (0, node_path_1.join)(process.cwd(), "apps", "site", "dist"),
            (0, node_path_1.join)(process.cwd(), "server", "dist"),
        ];
        const missing = [];
        const stale = [];
        for (const buildPath of buildPaths) {
            if (!(0, node_fs_1.existsSync)(buildPath)) {
                missing.push(buildPath);
                continue;
            }
            try {
                // Check if build is stale (older than 24 hours)
                const stats = require("node:fs").statSync(buildPath);
                const age = Date.now() - stats.mtimeMs;
                const maxAge = 24 * 60 * 60 * 1000; // 24 hours
                if (age > maxAge) {
                    stale.push({ path: buildPath, age });
                }
            }
            catch (error) {
                // Ignore stat errors
            }
        }
        if (missing.length > 0) {
            return {
                agentId: this.id,
                checkName: this.name,
                status: "amber",
                message: `Missing build artifacts: ${missing.length} paths`,
                metadata: { missing, stale },
            };
        }
        else if (stale.length > 0) {
            return {
                agentId: this.id,
                checkName: this.name,
                status: "amber",
                message: `Stale build artifacts: ${stale.length} paths`,
                metadata: { stale },
            };
        }
        else {
            return {
                agentId: this.id,
                checkName: this.name,
                status: "green",
                message: "All build artifacts present and fresh",
            };
        }
    },
};
