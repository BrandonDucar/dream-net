import { existsSync } from "node:fs";
import { join } from "node:path";
export const buildChecker = {
    id: "swarm-build-005",
    name: "Build Artifact Check",
    async check() {
        const buildPaths = [
            join(process.cwd(), "dist"),
            join(process.cwd(), "apps", "site", "dist"),
            join(process.cwd(), "server", "dist"),
        ];
        const missing = [];
        const stale = [];
        for (const buildPath of buildPaths) {
            if (!existsSync(buildPath)) {
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
//# sourceMappingURL=buildChecker.js.map