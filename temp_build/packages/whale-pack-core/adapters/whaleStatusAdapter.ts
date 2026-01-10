import { WhalePackCore } from "../index";
import { WhalePackStatus } from "../types";

export interface WhaleDashboardView {
  productCount: number;
  audienceCount: number;
  planCount: number;
  postedCount: number;
  insightCount: number;
  products: {
    id: string;
    name: string;
    tags?: string[];
  }[];
  audiences: {
    id: string;
    name: string;
    geo?: string;
    tags?: string[];
  }[];
  plans: {
    id: string;
    status: string;
    productId: string;
    audienceId: string;
    hookStyle: string;
    hookLine: string;
  }[];
  insights: {
    id: string;
    type: string;
    title: string;
    description: string;
  }[];
}

export function getWhaleDashboardView(): WhaleDashboardView {
  const status: WhalePackStatus = WhalePackCore.status();

  return {
    productCount: status.productCount,
    audienceCount: status.audienceCount,
    planCount: status.planCount,
    postedCount: status.postedCount,
    insightCount: status.insightCount,
    products: status.sampleProducts.map((p) => ({
      id: p.id,
      name: p.name,
      tags: p.tags,
    })),
    audiences: status.sampleAudiences.map((a) => ({
      id: a.id,
      name: a.name,
      geo: a.geo,
      tags: a.tags,
    })),
    plans: status.samplePlans.map((pl) => ({
      id: pl.id,
      status: pl.status,
      productId: pl.productId,
      audienceId: pl.audienceId,
      hookStyle: pl.hookStyle,
      hookLine: pl.hookLine,
    })),
    insights: status.sampleInsights.map((i) => ({
      id: i.id,
      type: i.type,
      title: i.title,
      description: i.description,
    })),
  };
}


