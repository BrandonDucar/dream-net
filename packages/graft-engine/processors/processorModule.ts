import fs from "node:fs/promises";
import path from "node:path";
import type { GraftModel, GraftProcessor, InstallResult } from "../types";

export class ModuleProcessor implements GraftProcessor {
  async install(graft: GraftModel): Promise<InstallResult> {
    const target = (graft.metadata?.target as string) ?? "apps";
    const destination = path.resolve(process.cwd(), target, graft.name);

    await fs.mkdir(destination, { recursive: true });

    if (target === "apps") {
      const pkg = {
        name: `@dreamnet/${graft.name}`,
        version: "0.1.0",
        private: true,
      };
      await fs.writeFile(path.join(destination, "package.json"), JSON.stringify(pkg, null, 2), "utf8");
    }

    return {
      ok: true,
      message: `Module scaffold created at ${destination}`,
      logs: [`Scaffolded ${target} module for ${graft.name}`],
    };
  }
}


