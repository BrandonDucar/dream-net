import path from "node:path";
export class ModuleValidator {
    async validate(graft) {
        const issues = [];
        if (!graft.path) {
            issues.push("Module graft requires target path");
        }
        const target = graft.metadata?.target ?? "apps";
        if (!["apps", "packages"].includes(target)) {
            issues.push("metadata.target must be \"apps\" or \"packages\"");
        }
        const absolute = path.resolve(process.cwd(), `${target}/${graft.name}`);
        if (!absolute.includes(`${target}/`)) {
            issues.push("Invalid module destination");
        }
        return {
            ok: issues.length === 0,
            issues,
        };
    }
}
