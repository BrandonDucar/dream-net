import { OrcaPackCore } from "../index";
import { OrcaPackStatus } from "../types";

export interface OrcaDashboardView {
  themeCount: number;
  ideaCount: number;
  planCount: number;
  postedCount: number;
  insightCount: number;
  themes: { id: string; name: string; tags?: string[] }[];
  ideas: { id: string; kind: string; title?: string; themeId: string }[];
  plans: { id: string; channel: string; status: string; ideaId: string }[];
  insights: { id: string; type: string; title: string; description: string }[];
}

export function getOrcaDashboardView(): OrcaDashboardView {
  const status: OrcaPackStatus = OrcaPackCore.status();

  return {
    themeCount: status.themeCount,
    ideaCount: status.ideaCount,
    planCount: status.planCount,
    postedCount: status.postedCount,
    insightCount: status.insightCount,
    themes: status.sampleThemes.map((t) => ({
      id: t.id,
      name: t.name,
      tags: t.tags,
    })),
    ideas: status.sampleIdeas.map((i) => ({
      id: i.id,
      kind: i.kind,
      title: i.title,
      themeId: i.themeId,
    })),
    plans: status.samplePlans.map((p) => ({
      id: p.id,
      channel: p.channel,
      status: p.status,
      ideaId: p.ideaId,
    })),
    insights: status.sampleInsights.map((ins) => ({
      id: ins.id,
      type: ins.type,
      title: ins.title,
      description: ins.description,
    })),
  };
}


