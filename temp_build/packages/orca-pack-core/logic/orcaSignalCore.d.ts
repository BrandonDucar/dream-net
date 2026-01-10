import { OrcaPackContext, OrcaPostIdea, OrcaPostPlan, OrcaChannel } from "../types";
export declare function ensureSeedThemes(): void;
export declare function generateNewOrcaIdeas(ctx: OrcaPackContext, desiredCount?: number): OrcaPostIdea[];
export declare function generateOrcaPlansFromIdeas(ctx: OrcaPackContext, perIdeaChannels?: OrcaChannel[]): OrcaPostPlan[];
