import type {
  Squad,
  SquadRole,
  SquadMember,
  SquadAlchemyContext,
  SquadAlchemyDecision,
} from './types.js';
import { SquadRegistry } from './registry/squadRegistry.js';
import { runSquadAlchemyCycle } from './engine/squadAlchemy.js';

export const SquadAlchemy = {
  registerSquad(squad: Squad) {
    return SquadRegistry.upsert(squad);
  },

  getSquad(id: string) {
    return SquadRegistry.get(id);
  },

  listSquads() {
    return SquadRegistry.getAll();
  },

  run(context: SquadAlchemyContext): SquadAlchemyDecision[] {
    return runSquadAlchemyCycle(context);
  },

  status() {
    return SquadRegistry.status();
  },
};

export * from './types.js';
export { SquadRegistry };
export { syncSquadBuilderSquads } from './bridge/squadBuilderBridge.js';
export default SquadAlchemy;

