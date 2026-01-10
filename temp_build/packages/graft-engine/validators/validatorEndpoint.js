"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointValidator = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
class EndpointValidator {
    async validate(graft) {
        const issues = [];
        if (!graft.path.startsWith("/api/")) {
            issues.push("Endpoint grafts must target paths under /api/");
        }
        const routeSlug = graft.path.replace("/api/", "");
        if (!routeSlug) {
            issues.push("Invalid endpoint path");
        }
        const existingPath = node_path_1.default.resolve(process.cwd(), "server/routes/grafted", `${routeSlug}.ts`);
        try {
            await promises_1.default.access(existingPath);
            issues.push(`Route for ${routeSlug} already exists`);
        }
        catch {
            // file does not exist, ok
        }
        return {
            ok: issues.length === 0,
            issues,
        };
    }
}
exports.EndpointValidator = EndpointValidator;
