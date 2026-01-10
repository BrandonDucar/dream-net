import type { Squad } from '../types.js';

const squadMap: Map<string, Squad> = new Map();

export const SquadRegistry = {
  upsert(squad: Squad) {
    const now = Date.now();
    const existing = squadMap.get(squad.id);

    const merged: Squad = {
      ...squad,
      createdAt: existing?.createdAt ?? squad.createdAt ?? now,
      updatedAt: now,
    };

    squadMap.set(merged.id, merged);
    return merged;
  },

  get(id: string): Squad | undefined {
    return squadMap.get(id);
  },

  getAll(): Squad[] {
    return Array.from(squadMap.values());
  },

  remove(id: string) {
    squadMap.delete(id);
  },

  clear() {
    squadMap.clear();
  },

  status() {
    return {
      count: squadMap.size,
      squads: Array.from(squadMap.values()).slice(0, 20), // avoid massive dumps
    };
  },
};

