import type { Squad, SquadAlchemyContext, SquadAlchemyDecision } from './types.js';
import { SquadRegistry } from './registry/squadRegistry.js';
export declare const SquadAlchemy: {
    registerSquad(squad: Squad): Squad;
    getSquad(id: string): Squad | undefined;
    listSquads(): Squad[];
    run(context: SquadAlchemyContext): SquadAlchemyDecision[];
    status(): {
        count: number;
        squads: Squad[];
    };
};
export * from './types.js';
export { SquadRegistry };
export { syncSquadBuilderSquads } from './bridge/squadBuilderBridge.js';
export default SquadAlchemy;
//# sourceMappingURL=index.d.ts.map