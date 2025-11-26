import { OrcaNarrativeTheme, OrcaPostIdea, OrcaPostPlan, OrcaInsight, OrcaPackContext, OrcaPackStatus } from "./types";
export declare const OrcaPackCore: {
    run(context: OrcaPackContext): Promise<OrcaPackStatus>;
    status(): OrcaPackStatus;
    upsertTheme(theme: OrcaNarrativeTheme): OrcaNarrativeTheme;
    listThemes(): OrcaNarrativeTheme[];
    upsertIdea(idea: OrcaPostIdea): OrcaPostIdea;
    listIdeas(): OrcaPostIdea[];
    upsertPlan(plan: OrcaPostPlan): OrcaPostPlan;
    listPlans(): OrcaPostPlan[];
    listInsights(): OrcaInsight[];
};
export * from "./types";
export * from "./logic/orcaOutreachCore";
export default OrcaPackCore;
