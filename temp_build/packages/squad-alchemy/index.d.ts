import type { Squad, SquadAlchemyContext, SquadAlchemyDecision } from "./types";
import { SquadRegistry } from "./registry/squadRegistry";
export declare const SquadAlchemy: {
    registerSquad(squad: Squad): Squad;
    getSquad(id: string): Squad;
    listSquads(): Squad[];
    run(context: SquadAlchemyContext): SquadAlchemyDecision[];
    status(): {
        count: number;
        squads: Squad[];
    };
};
export * from "./types";
export { SquadRegistry };
export { syncSquadBuilderSquads } from "./bridge/squadBuilderBridge";
export default SquadAlchemy;
