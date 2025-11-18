import { DDAOAttractor, DDAOCategory } from "../types";
import { CitizenshipStore } from "../store/citizenshipStore";

/**
 * Register a D-DAO attractor
 */
export function registerDDAOAttractor(
  name: string,
  category: DDAOCategory,
  url?: string,
  tags?: string[],
  score?: number
): DDAOAttractor {
  const now = Date.now();
  const id = `ddao:${name.toLowerCase().replace(/\s/g, "-")}:${now}`;

  const attractor: DDAOAttractor = {
    id,
    name,
    category,
    url,
    tags,
    score: score ?? 0.5,
    createdAt: now,
    updatedAt: now,
  };

  return CitizenshipStore.addDDAOAttractor(attractor);
}

/**
 * Update D-DAO attractor score
 */
export function updateDDAOAttractorScore(id: string, score: number): boolean {
  return CitizenshipStore.updateDDAOAttractorScore(id, score);
}

/**
 * Get D-DAO attractors by category
 */
export function getDDAOAttractorsByCategory(category: DDAOCategory): DDAOAttractor[] {
  return CitizenshipStore.listDDAOAttractors().filter((a) => a.category === category);
}

/**
 * Get top D-DAO attractors by score
 */
export function getTopDDAOAttractors(limit: number = 10): DDAOAttractor[] {
  return CitizenshipStore.listDDAOAttractors()
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, limit);
}

