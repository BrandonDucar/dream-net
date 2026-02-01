import { SquadRegistry } from './registry/squadRegistry.js';
import { runSquadAlchemyCycle } from './engine/squadAlchemy.js';
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
export * from './types.js';
export { SquadRegistry };
export { syncSquadBuilderSquads } from './bridge/squadBuilderBridge.js';
export default SquadAlchemy;
//# sourceMappingURL=index.js.map