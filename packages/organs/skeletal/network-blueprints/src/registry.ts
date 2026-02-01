/**
 * Network Blueprint Registry
 * Manages registered network blueprints
 */

import type { NetworkBlueprint } from './types.js';

const blueprints = new Map<string, NetworkBlueprint>();

export function registerBlueprint(blueprint: NetworkBlueprint): void {
  blueprints.set(blueprint.id, blueprint);
}

export function getBlueprint(id: string): NetworkBlueprint | undefined {
  return blueprints.get(id);
}

export function listBlueprints(): NetworkBlueprint[] {
  return Array.from(blueprints.values());
}

