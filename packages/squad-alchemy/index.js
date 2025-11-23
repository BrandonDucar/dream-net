import { SquadRegistry } from "./registry/squadRegistry";
import { runSquadAlchemyCycle } from "./engine/squadAlchemy";
export const SquadAlchemy = {
    registerSquad(squad) {
        return SquadRegistry.upsert(squad);
    },
    getSquad(id) {
        return SquadRegistry.get(id);
    },
    listSquads() {
        return SquadRegistry.getAll();
    },
    run(context) {
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
