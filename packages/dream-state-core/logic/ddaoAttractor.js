import { CitizenshipStore } from "../store/citizenshipStore";
/**
 * Register a D-DAO attractor
 */
export function registerDDAOAttractor(name, category, url, tags, score) {
    const now = Date.now();
    const id = `ddao:${name.toLowerCase().replace(/\s/g, "-")}:${now}`;
    const attractor = {
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
export function updateDDAOAttractorScore(id, score) {
    return CitizenshipStore.updateDDAOAttractorScore(id, score);
}
/**
 * Get D-DAO attractors by category
 */
export function getDDAOAttractorsByCategory(category) {
    return CitizenshipStore.listDDAOAttractors().filter((a) => a.category === category);
}
/**
 * Get top D-DAO attractors by score
 */
export function getTopDDAOAttractors(limit = 10) {
    return CitizenshipStore.listDDAOAttractors()
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        .slice(0, limit);
}
