import { OrcaNarrativeTheme, OrcaPostIdea, OrcaPostPlan, OrcaInsight, OrcaPackContext, OrcaPackStatus } from './types.js';
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
export * from './types.js';
export * from './logic/orcaOutreachCore.js';
export default OrcaPackCore;
//# sourceMappingURL=index.d.ts.map