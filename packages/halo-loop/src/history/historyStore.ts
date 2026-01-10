import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { HaloCycleResult } from "../types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const historyFile = path.resolve(__dirname, "haloHistory.json");

let writeQueue = Promise.resolve();

async function readHistoryFile(): Promise<HaloCycleResult[]> {
  try {
    const data = await fs.readFile(historyFile, "utf8");
    return JSON.parse(data) as HaloCycleResult[];
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await fs.writeFile(historyFile, "[]", "utf8");
      return [];
    }
    throw error;
  }
}

async function writeHistoryFile(entries: HaloCycleResult[]): Promise<void> {
  await fs.writeFile(historyFile, JSON.stringify(entries, null, 2), "utf8");
}

export async function appendHistory(entry: HaloCycleResult): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    const history = await readHistoryFile();
    history.unshift(entry);
    const trimmed = history.slice(0, 200); // keep latest 200 cycles
    await writeHistoryFile(trimmed);
  });
  return writeQueue;
}

export async function getHistory(limit = 20): Promise<HaloCycleResult[]> {
  const history = await readHistoryFile();
  return history.slice(0, limit);
}

export async function getLatestEntry(): Promise<HaloCycleResult | null> {
  const history = await readHistoryFile();
  return history.length ? history[0] : null;
}


