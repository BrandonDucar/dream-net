import type { MemoryRecord } from "@dreamnet/memory-dna/types";
export interface ChemicalModifier {
    id: string;
    name: string;
    effects: Partial<Record<string, number>>;
    durationSeconds: number;
}
export declare function ingestChemical(agent: MemoryRecord, chemicalId: string): Promise<MemoryRecord>;
export declare function listAvailableChemicals(): ChemicalModifier[];
//# sourceMappingURL=chemistry.d.ts.map