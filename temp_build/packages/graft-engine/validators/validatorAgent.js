"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentValidator = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
class AgentValidator {
    async validate(graft) {
        const issues = [];
        if (!graft.metadata?.role || typeof graft.metadata.role !== "string") {
            issues.push("Agent grafts require metadata.role");
        }
        if (!graft.metadata?.capabilities || !Array.isArray(graft.metadata.capabilities)) {
            issues.push("Agent grafts require metadata.capabilities array");
        }
        const registryPath = node_path_1.default.resolve(process.cwd(), "packages/agents/graftedAgents.json");
        try {
            await promises_1.default.access(registryPath);
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
exports.AgentValidator = AgentValidator;
