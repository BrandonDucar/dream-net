export type SquadRole = "repair" | "deploy" | "monitor" | "routing" | "governance" | "experimental" | "generic";
export interface SquadMember {
    id: string;
    capabilities: string[];
    loadFactor?: number;
}
export interface Squad {
    id: string;
    role: SquadRole;
    members: SquadMember[];
    tags?: string[];
    createdAt: number;
    updatedAt: number;
    lineage?: {
        parentIds?: string[];
        generation?: number;
    };
}
export interface SquadAlchemyContext {
    pheromoneStore?: any;
    haloLoop?: any;
    quantumAnticipation?: any;
    neuralMesh?: any;
}
export interface SquadAlchemyDecision {
    action: "merge" | "split" | "clone" | "noop";
    reason: string;
    targetSquadIds?: string[];
    newSquads?: Squad[];
}
