import { promises as fs } from "node:fs";
import path from "node:path";

const STORE_PATH = path.resolve(process.cwd(), "server/operator/operatorStore.json");

type OperatorStore = {
  tasks: any[];
  spores: any[];
  wormholes: any[];
};

async function ensureStore(): Promise<OperatorStore> {
  try {
    const data = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(data) as Partial<OperatorStore>;
    return {
      tasks: parsed.tasks ?? [],
      spores: parsed.spores ?? [],
      wormholes: parsed.wormholes ?? [],
    };
  } catch (error: any) {
    if (error.code === "ENOENT") {
      const empty = { tasks: [], spores: [], wormholes: [] };
      await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
      await fs.writeFile(STORE_PATH, JSON.stringify(empty, null, 2), "utf8");
      return empty;
    }
    throw error;
  }
}

async function persist(store: OperatorStore): Promise<void> {
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function listTasks(): Promise<any[]> {
  const store = await ensureStore();
  return store.tasks;
}

export async function addTask(task: any): Promise<void> {
  const store = await ensureStore();
  store.tasks.unshift(task);
  store.tasks = store.tasks.slice(0, 100);
  await persist(store);
}

export async function listSpores(): Promise<any[]> {
  const store = await ensureStore();
  return store.spores;
}

export async function addSpore(spore: any): Promise<void> {
  const store = await ensureStore();
  store.spores.unshift(spore);
  store.spores = store.spores.slice(0, 100);
  await persist(store);
}

export async function listWormholes(): Promise<any[]> {
  const store = await ensureStore();
  return store.wormholes;
}

export async function addWormhole(wormhole: any): Promise<void> {
  const store = await ensureStore();
  store.wormholes.unshift(wormhole);
  store.wormholes = store.wormholes.slice(0, 100);
  await persist(store);
}

