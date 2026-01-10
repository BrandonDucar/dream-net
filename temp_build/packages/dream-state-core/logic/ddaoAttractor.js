"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDDAOAttractor = registerDDAOAttractor;
exports.updateDDAOAttractorScore = updateDDAOAttractorScore;
exports.getDDAOAttractorsByCategory = getDDAOAttractorsByCategory;
exports.getTopDDAOAttractors = getTopDDAOAttractors;
const citizenshipStore_1 = require("../store/citizenshipStore");
/**
 * Register a D-DAO attractor
 */
function registerDDAOAttractor(name, category, url, tags, score) {
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
    return citizenshipStore_1.CitizenshipStore.addDDAOAttractor(attractor);
}
/**
 * Update D-DAO attractor score
 */
function updateDDAOAttractorScore(id, score) {
    return citizenshipStore_1.CitizenshipStore.updateDDAOAttractorScore(id, score);
}
/**
 * Get D-DAO attractors by category
 */
function getDDAOAttractorsByCategory(category) {
    return citizenshipStore_1.CitizenshipStore.listDDAOAttractors().filter((a) => a.category === category);
}
/**
 * Get top D-DAO attractors by score
 */
function getTopDDAOAttractors(limit = 10) {
    return citizenshipStore_1.CitizenshipStore.listDDAOAttractors()
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        .slice(0, limit);
}
