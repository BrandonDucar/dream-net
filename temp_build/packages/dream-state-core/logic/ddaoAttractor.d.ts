import { DDAOAttractor, DDAOCategory } from "../types";
/**
 * Register a D-DAO attractor
 */
export declare function registerDDAOAttractor(name: string, category: DDAOCategory, url?: string, tags?: string[], score?: number): DDAOAttractor;
/**
 * Update D-DAO attractor score
 */
export declare function updateDDAOAttractorScore(id: string, score: number): boolean;
/**
 * Get D-DAO attractors by category
 */
export declare function getDDAOAttractorsByCategory(category: DDAOCategory): DDAOAttractor[];
/**
 * Get top D-DAO attractors by score
 */
export declare function getTopDDAOAttractors(limit?: number): DDAOAttractor[];
