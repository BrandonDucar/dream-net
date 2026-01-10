import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { GraftModel, GraftStatus } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storePath = path.resolve(__dirname, "graftStore.json");

async function readStore(): Promise<GraftModel[]> {
  try {
    const data = await fs.readFile(storePath, "utf8");
    return JSON.parse(data) as GraftModel[];
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await fs.writeFile(storePath, "[]", "utf8");
      return [];
    }
    throw error;
  }
}

async function writeStore(grafts: GraftModel[]): Promise<void> {
  await fs.writeFile(storePath, JSON.stringify(grafts, null, 2), "utf8");
}

export async function registerGraft(graft: GraftModel): Promise<GraftModel> {
  const grafts = await readStore();
  grafts.push(graft);
  await writeStore(grafts);
  return graft;
}

export async function getGrafts(): Promise<GraftModel[]> {
  return readStore();
}

export async function getGraftById(id: string): Promise<GraftModel | undefined> {
  const grafts = await readStore();
  return grafts.find((graft) => graft.id === id);
}

export async function updateGraftStatus(
  id: string,
  status: GraftStatus,
  update: Partial<GraftModel> = {},
): Promise<GraftModel | undefined> {
  const grafts = await readStore();
  const idx = grafts.findIndex((g) => g.id === id);
  if (idx === -1) return undefined;

  const updated: GraftModel = {
    ...grafts[idx],
    status,
    ...update,
  };
  grafts[idx] = updated;
  await writeStore(grafts);
  return updated;
}

export async function removeGraft(id: string): Promise<void> {
  const grafts = await readStore();
  const filtered = grafts.filter((g) => g.id !== id);
  await writeStore(filtered);
}


