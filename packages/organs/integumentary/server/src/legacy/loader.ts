import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const currentDir = __dirname;
const serverRoot = path.resolve(currentDir, "..");
const requireFromServer = createRequire(path.join(serverRoot, "index.ts"));

export function legacyRequire<T = unknown>(modulePath: string): T | undefined {
  try {
    const resolved = path.resolve(serverRoot, modulePath);
    return requireFromServer(resolved) as T;
  } catch (error) {
    console.warn(`[legacy] failed to load module "${modulePath}": ${(error as Error).message}`);
    return undefined;
  }
}

export async function legacyImport<T = unknown>(modulePath: string): Promise<T | undefined> {
  return legacyRequire<T>(modulePath);
}

