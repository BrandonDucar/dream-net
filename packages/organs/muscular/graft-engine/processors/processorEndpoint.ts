import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { GraftModel, GraftProcessor, InstallResult } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const endpointsStore = path.resolve(__dirname, "../graftedEndpoints.json");

async function readStore(): Promise<any[]> {
  try {
    const data = await fs.readFile(endpointsStore, "utf8");
    return JSON.parse(data) as any[];
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await fs.writeFile(endpointsStore, "[]", "utf8");
      return [];
    }
    throw error;
  }
}

async function writeStore(data: any[]): Promise<void> {
  await fs.writeFile(endpointsStore, JSON.stringify(data, null, 2), "utf8");
}

export class EndpointProcessor implements GraftProcessor {
  async install(graft: GraftModel): Promise<InstallResult> {
    const endpoints = await readStore();
    const existing = endpoints.find((entry) => entry.path === graft.path);
    const payload = {
      id: graft.id,
      name: graft.name,
      path: graft.path,
      metadata: graft.metadata,
      response: graft.metadata?.response ?? {
        message: `Grafted endpoint ${graft.name} operational.`,
      },
    };

    if (existing) {
      Object.assign(existing, payload);
    } else {
      endpoints.push(payload);
    }
    await writeStore(endpoints);

    return {
      ok: true,
      message: `Endpoint ${graft.path} registered`,
      logs: [`Registered grafted endpoint at ${graft.path}`],
    };
  }
}


