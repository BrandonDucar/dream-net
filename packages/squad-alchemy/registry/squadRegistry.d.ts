import type { Squad } from '../types.js';
export declare const SquadRegistry: {
    upsert(squad: Squad): Squad;
    get(id: string): Squad | undefined;
    getAll(): Squad[];
    remove(id: string): void;
    clear(): void;
    status(): {
        count: number;
        squads: Squad[];
    };
};
//# sourceMappingURL=squadRegistry.d.ts.map