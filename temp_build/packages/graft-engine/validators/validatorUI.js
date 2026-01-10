"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIValidator = void 0;
const node_path_1 = __importDefault(require("node:path"));
class UIValidator {
    async validate(graft) {
        const issues = [];
        if (!graft.metadata?.targetApp) {
            issues.push("UI grafts require metadata.targetApp (e.g. \"dreamscope\")");
        }
        if (!graft.path.endsWith(".tsx")) {
            issues.push("UI graft path should point to a .tsx file");
        }
        const appDir = node_path_1.default.resolve(process.cwd(), `apps/${graft.metadata?.targetApp || ""}`);
        if (!appDir.includes("apps/")) {
            issues.push("targetApp must resolve under apps/");
        }
        return {
            ok: issues.length === 0,
            issues,
        };
    }
}
exports.UIValidator = UIValidator;
