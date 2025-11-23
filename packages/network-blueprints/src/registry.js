/**
 * Network Blueprint Registry
 * Manages registered network blueprints
 */
const blueprints = new Map();
export function registerBlueprint(blueprint) {
    blueprints.set(blueprint.id, blueprint);
}
export function getBlueprint(id) {
    return blueprints.get(id);
}
export function listBlueprints() {
    return Array.from(blueprints.values());
}
