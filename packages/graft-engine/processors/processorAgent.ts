import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { GraftModel, GraftProcessor, InstallResult } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const agentsStore = path.resolve(process.cwd(), "packages/agents/graftedAgents.json");

async function readAgents(): Promise<any[]> {
  try {
    const data = await fs.readFile(agentsStore, "utf8");
    return JSON.parse(data) as any[];
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await fs.writeFile(agentsStore, "[]", "utf8");
      return [];
    }
    throw error;
  }
}

async function writeAgents(data: any[]): Promise<void> {
  await fs.writeFile(agentsStore, JSON.stringify(data, null, 2), "utf8");
}

export class AgentProcessor implements GraftProcessor {
  async install(graft: GraftModel): Promise<InstallResult> {
    const agents = await readAgents();
    const payload = {
      id: graft.id,
      name: graft.name,
      role: graft.metadata?.role ?? "Custom",
      capabilities: graft.metadata?.capabilities ?? [],
      path: graft.path,
    };

    const existingIdx = agents.findIndex((agent) => agent.id === graft.id || agent.name === graft.name);
    if (existingIdx >= 0) {
      agents[existingIdx] = payload;
    } else {
      agents.push(payload);
    }
    await writeAgents(agents);

    return {
      ok: true,
      message: `Agent ${graft.name} registered`,
      logs: [`Added agent ${graft.name} to grafted registry`],
    };
  }
}


