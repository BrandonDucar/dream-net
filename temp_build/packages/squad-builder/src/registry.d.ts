import type { AgentModel, SquadModel } from "./types";
export declare function getAgents(): AgentModel[];
export declare function getAgentById(id: string): AgentModel | null;
export declare function registerAgent(agent: Omit<AgentModel, "lastSeen">): AgentModel;
export declare function getSquads(): SquadModel[];
export declare function getSquadById(id: string): SquadModel | null;
export declare function createSquad(data: Omit<SquadModel, "id" | "createdAt" | "updatedAt">): SquadModel;
export declare function updateSquad(id: string, patch: Partial<SquadModel>): SquadModel | null;
