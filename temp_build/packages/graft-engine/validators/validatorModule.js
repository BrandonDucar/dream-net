"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleValidator = void 0;
const node_path_1 = __importDefault(require("node:path"));
class ModuleValidator {
    async validate(graft) {
        const issues = [];
        if (!graft.path) {
            issues.push("Module graft requires target path");
        }
        const target = graft.metadata?.target ?? "apps";
        if (!["apps", "packages"].includes(target)) {
            issues.push("metadata.target must be \"apps\" or \"packages\"");
        }
        const absolute = node_path_1.default.resolve(process.cwd(), `${target}/${graft.name}`);
        if (!absolute.includes(`${target}/`)) {
            issues.push("Invalid module destination");
        }
        return {
            ok: issues.length === 0,
            issues,
        };
    }
}
exports.ModuleValidator = ModuleValidator;
