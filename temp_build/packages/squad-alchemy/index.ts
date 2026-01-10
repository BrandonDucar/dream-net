import type {
  Squad,
  SquadRole,
  SquadMember,
  SquadAlchemyContext,
  SquadAlchemyDecision,
} from "./types";
import { SquadRegistry } from "./registry/squadRegistry";
import { runSquadAlchemyCycle } from "./engine/squadAlchemy";

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

export * from "./types";
export { SquadRegistry };
export { syncSquadBuilderSquads } from "./bridge/squadBuilderBridge";
export default SquadAlchemy;

