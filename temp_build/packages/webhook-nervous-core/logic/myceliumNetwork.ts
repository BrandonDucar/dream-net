/**
 * Mycelium Network Logic
 * Distributed webhook routing with self-healing paths
 */

import type { WebhookHypha, WebhookMycelium, WebhookNeuron } from "../types";
import { getNeurons } from "./nervousSystem";

let hyphae: Map<string, WebhookHypha> = new Map();
let mycelia: Map<string, WebhookMycelium> = new Map();

let hyphaCounter = 0;
let myceliumCounter = 0;

function nextHyphaId(): string {
  hyphaCounter += 1;
  return `hypha:${Date.now()}:${hyphaCounter}`;
}

function nextMyceliumId(): string {
  myceliumCounter += 1;
  return `mycelium:${Date.now()}:${myceliumCounter}`;
}

/**
 * Create a hypha (webhook path)
 */
export function createHypha(
  sourceId: string,
  targetId: string,
  options?: {
    strength?: number;
    capacity?: number;
  }
): WebhookHypha {
  const hypha: WebhookHypha = {
    id: nextHyphaId(),
    sourceId,
    targetId,
    strength: options?.strength || 0.5,
    latency: 0,
    capacity: options?.capacity || 100,
    currentLoad: 0,
    health: 100,
    alternativePaths: [],
    createdAt: Date.now(),
  };

  hyphae.set(hypha.id, hypha);
  return hypha;
}

/**
 * Create a mycelium network (webhook network)
 */
export function createMycelium(
  name: string,
  neuronIds: string[],
  hyphaIds: string[]
): WebhookMycelium {
  const mycelium: WebhookMycelium = {
    id: nextMyceliumId(),
    name,
    neurons: neuronIds,
    hyphae: hyphaIds,
    health: 100,
    throughput: 0,
    resilience: calculateResilience(hyphaIds),
    createdAt: Date.now(),
  };

  mycelia.set(mycelium.id, mycelium);
  return mycelium;
}

/**
 * Find optimal path through mycelium network
 */
export function findOptimalPath(
  sourceId: string,
  targetId: string,
  myceliumId?: string
): string[] | null {
  const relevantHyphae = myceliumId
    ? Array.from(hyphae.values()).filter((h) =>
        mycelia.get(myceliumId)?.hyphae.includes(h.id)
      )
    : Array.from(hyphae.values());

  // Use Dijkstra-like algorithm with strength as weight
  const paths = findPaths(sourceId, targetId, relevantHyphae);
  
  if (paths.length === 0) return null;

  // Sort by combined strength and latency
  paths.sort((a, b) => {
    const aScore = calculatePathScore(a, relevantHyphae);
    const bScore = calculatePathScore(b, relevantHyphae);
    return bScore - aScore; // Higher is better
  });

  return paths[0];
}

/**
 * Find all paths between source and target
 */
function findPaths(
  sourceId: string,
  targetId: string,
  hyphae: WebhookHypha[],
  visited: Set<string> = new Set(),
  currentPath: string[] = []
): string[][] {
  if (sourceId === targetId) {
    return [currentPath];
  }

  if (visited.has(sourceId)) {
    return [];
  }

  visited.add(sourceId);
  const paths: string[][] = [];

  const outgoingHyphae = hyphae.filter((h) => h.sourceId === sourceId && h.health > 50);

  for (const hypha of outgoingHyphae) {
    const newPath = [...currentPath, hypha.targetId];
    const subPaths = findPaths(hypha.targetId, targetId, hyphae, new Set(visited), newPath);
    paths.push(...subPaths);
  }

  return paths;
}

/**
 * Calculate path score (strength - latency penalty)
 */
function calculatePathScore(path: string[], hyphae: WebhookHypha[]): number {
  let score = 0;
  let latency = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const hypha = hyphae.find(
      (h) => h.sourceId === path[i] && h.targetId === path[i + 1]
    );
    if (hypha) {
      score += hypha.strength;
      latency += hypha.latency;
    }
  }

  // Penalize latency
  return score - latency * 0.001;
}

/**
 * Calculate network resilience (number of alternative paths)
 */
function calculateResilience(hyphaIds: string[]): number {
  const relevantHyphae = Array.from(hyphae.values()).filter((h) =>
    hyphaIds.includes(h.id)
  );

  // Count alternative paths
  let alternativeCount = 0;
  for (const hypha of relevantHyphae) {
    alternativeCount += hypha.alternativePaths.length;
  }

  return Math.min(100, (alternativeCount / relevantHyphae.length) * 100);
}

/**
 * Heal damaged hyphae (self-healing network)
 */
export function healHyphae() {
  for (const hypha of hyphae.values()) {
    if (hypha.health < 100) {
      // Gradually heal
      hypha.health = Math.min(100, hypha.health + 1);
      
      // Reduce load if healing
      if (hypha.currentLoad > 0) {
        hypha.currentLoad = Math.max(0, hypha.currentLoad - 1);
      }
    }
  }
}

/**
 * Find alternative paths if primary path fails
 */
export function findAlternativePath(
  failedHyphaId: string,
  sourceId: string,
  targetId: string
): string[] | null {
  const failedHypha = hyphae.get(failedHyphaId);
  if (!failedHypha) return null;

  // Use alternative paths if available
  if (failedHypha.alternativePaths.length > 0) {
    for (const altPathId of failedHypha.alternativePaths) {
      const altPath = hyphae.get(altPathId);
      if (altPath && altPath.health > 50) {
        return [sourceId, altPath.targetId, targetId];
      }
    }
  }

  // Find new path excluding failed hypha
  const allHyphae = Array.from(hyphae.values()).filter((h) => h.id !== failedHyphaId);
  return findOptimalPath(sourceId, targetId);
}

/**
 * Get all hyphae
 */
export function getHyphae(): WebhookHypha[] {
  return Array.from(hyphae.values());
}

/**
 * Get all mycelia
 */
export function getMycelia(): WebhookMycelium[] {
  return Array.from(mycelia.values());
}

/**
 * Update hypha load
 */
export function updateHyphaLoad(hyphaId: string, load: number) {
  const hypha = hyphae.get(hyphaId);
  if (hypha) {
    hypha.currentLoad = Math.max(0, Math.min(hypha.capacity, load));
    
    // Health decreases with overload
    if (hypha.currentLoad > hypha.capacity * 0.9) {
      hypha.health = Math.max(0, hypha.health - 1);
    }
  }
}

