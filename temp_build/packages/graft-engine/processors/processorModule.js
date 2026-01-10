"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleProcessor = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
class ModuleProcessor {
    async install(graft) {
        const target = graft.metadata?.target ?? "apps";
        const destination = node_path_1.default.resolve(process.cwd(), target, graft.name);
        await promises_1.default.mkdir(destination, { recursive: true });
        if (target === "apps") {
            const pkg = {
                name: `@dreamnet/${graft.name}`,
                version: "0.1.0",
                private: true,
            };
            await promises_1.default.writeFile(node_path_1.default.join(destination, "package.json"), JSON.stringify(pkg, null, 2), "utf8");
        }
        return {
            ok: true,
            message: `Module scaffold created at ${destination}`,
            logs: [`Scaffolded ${target} module for ${graft.name}`],
        };
    }
}
exports.ModuleProcessor = ModuleProcessor;
