import fs from "node:fs/promises";
import path from "node:path";
export class AgentValidator {
    async validate(graft) {
        const issues = [];
        if (!graft.metadata?.role || typeof graft.metadata.role !== "string") {
            issues.push("Agent grafts require metadata.role");
        }
        if (!graft.metadata?.capabilities || !Array.isArray(graft.metadata.capabilities)) {
            issues.push("Agent grafts require metadata.capabilities array");
        }
        const registryPath = path.resolve(process.cwd(), "packages/agents/graftedAgents.json");
        try {
            await fs.access(registryPath);
        }
        catch {
            // no file yet, that's fine
        }
        return {
            ok: issues.length === 0,
            issues,
        };
    }
}
