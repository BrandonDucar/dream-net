"use strict";
/**
 * Network Blueprint Registry
 * Manages registered network blueprints
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBlueprint = registerBlueprint;
exports.getBlueprint = getBlueprint;
exports.listBlueprints = listBlueprints;
const blueprints = new Map();
function registerBlueprint(blueprint) {
    blueprints.set(blueprint.id, blueprint);
}
function getBlueprint(id) {
    return blueprints.get(id);
}
function listBlueprints() {
    return Array.from(blueprints.values());
}
