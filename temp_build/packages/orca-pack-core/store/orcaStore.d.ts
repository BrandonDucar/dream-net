import { OrcaNarrativeTheme, OrcaPostIdea, OrcaPostPlan, OrcaEngagement, OrcaInsight, OrcaPackStatus } from "../types";
export declare const OrcaStore: {
    upsertTheme(theme: OrcaNarrativeTheme): OrcaNarrativeTheme;
    listThemes(): OrcaNarrativeTheme[];
    upsertIdea(idea: OrcaPostIdea): OrcaPostIdea;
    listIdeas(): OrcaPostIdea[];
    upsertPlan(plan: OrcaPostPlan): OrcaPostPlan;
    listPlans(): OrcaPostPlan[];
    addEngagement(e: OrcaEngagement): void;
    listEngagementsForPlan(planId: string): OrcaEngagement[];
    addInsight(insight: OrcaInsight): OrcaInsight;
    listInsights(): OrcaInsight[];
    setLastRunAt(ts: number | null): void;
    status(): OrcaPackStatus;
};
