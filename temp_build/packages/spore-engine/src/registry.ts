import type { SporeModel } from "./types";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SPORE_STORE_PATH = join(__dirname, "../store/sporeStore.json");

interface SporeStore {
  spores: SporeModel[];
}

function loadStore(): SporeStore {
  if (!existsSync(SPORE_STORE_PATH)) {
    return { spores: [] };
  }
  try {
    const content = readFileSync(SPORE_STORE_PATH, "utf-8");
    return JSON.parse(content);
  } catch {
    return { spores: [] };
  }
}

function saveStore(store: SporeStore): void {
  const dir = join(SPORE_STORE_PATH, "..");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(SPORE_STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export function listSpores(filters?: {
  type?: SporeModel["type"];
  status?: SporeModel["status"];
  tag?: string;
}): SporeModel[] {
  let spores = loadStore().spores;
  if (filters?.type) {
    spores = spores.filter((s) => s.type === filters.type);
  }
  if (filters?.status) {
    spores = spores.filter((s) => s.status === filters.status);
  }
  if (filters?.tag) {
    spores = spores.filter((s) => s.metadata?.tags?.includes(filters.tag!));
  }
  return spores;
}

export function getSporeById(id: string): SporeModel | null {
  return loadStore().spores.find((s) => s.id === id) ?? null;
}

export function createSpore(data: Omit<SporeModel, "id" | "createdAt" | "updatedAt" | "stats"> & Partial<Pick<SporeModel, "id" | "stats">>): SporeModel {
  const store = loadStore();
  const spore: SporeModel = {
    ...data,
    id: data.id ?? `spore-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    stats: data.stats ?? {
      usageCount: 0,
      successCount: 0,
      failureCount: 0,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  store.spores.push(spore);
  saveStore(store);
  return spore;
}

export function updateSpore(id: string, patch: Partial<SporeModel>): SporeModel | null {
  const store = loadStore();
  const index = store.spores.findIndex((s) => s.id === id);
  if (index < 0) return null;
  store.spores[index] = {
    ...store.spores[index],
    ...patch,
    updatedAt: new Date(),
    publishedAt: patch.status === "published" && store.spores[index].status !== "published" ? new Date() : store.spores[index].publishedAt,
  };
  saveStore(store);
  return store.spores[index];
}

export function deleteSpore(id: string): boolean {
  const store = loadStore();
  const filtered = store.spores.filter((s) => s.id !== id);
  if (filtered.length === store.spores.length) return false;
  saveStore({ spores: filtered });
  return true;
}

export function incrementUsage(sporeId: string, success: boolean): void {
  const store = loadStore();
  const index = store.spores.findIndex((s) => s.id === sporeId);
  if (index >= 0) {
    const spore = store.spores[index];
    spore.stats = {
      usageCount: (spore.stats?.usageCount ?? 0) + 1,
      successCount: (spore.stats?.successCount ?? 0) + (success ? 1 : 0),
      failureCount: (spore.stats?.failureCount ?? 0) + (success ? 0 : 1),
      lastUsed: new Date(),
    };
    saveStore(store);
  }
}

