import fs from "fs";
import path from "path";

const name = (process.argv[2] || "").toLowerCase();
if (!name) {
  // eslint-disable-next-line no-console
  console.error("Usage: pnpm gen:agent <agent-name>");
  process.exit(1);
}

const baseDir = path.join(process.cwd(), "server", "core", "agents");
const file = path.join(baseDir, `${name}.ts`);
if (fs.existsSync(file)) {
  // eslint-disable-next-line no-console
  console.error("Agent already exists:", file);
  process.exit(1);
}

const template = `import type { Agent, AgentContext, AgentResult } from "../types";

export const ${name}Agent: Agent = {
  name: "${name}",
  description: "Describe what ${name} does.",
  async run(ctx: AgentContext, input: unknown): Promise<AgentResult> {
    const s = typeof input === "string" ? input : JSON.stringify(input);
    ctx.log("[${name}] received input", { input: s });
    return { ok: true, agent: "${name}", result: { input: s } };
  }
};
`;

fs.writeFileSync(file, template, "utf8");

// update manifest (optional simple list file)
const manifestPath = path.join(baseDir, "manifest.json");
try {
  const m = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (!m.agents.find((a: any) => a.name === name)) {
    m.agents.push({ name, path: `./${name}` });
    fs.writeFileSync(manifestPath, JSON.stringify(m, null, 2));
  }
} catch {
  // ignore if manifest missing
}

// eslint-disable-next-line no-console
console.log("Created agent:", file);


