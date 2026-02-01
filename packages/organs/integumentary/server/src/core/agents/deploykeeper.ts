import type { Agent, AgentContext, AgentResult } from "../types";

export const DeployKeeperAgent: Agent = {
  name: "deploykeeper",
  description: "Checks deployment settings and common pitfalls.",
  async run(ctx: AgentContext): Promise<AgentResult> {
    const env = ctx.env;
    const problems: string[] = [];
    const tips: string[] = [];

    if (!env.VITE_API_URL) {
      problems.push("Vercel env var VITE_API_URL is missing for site build.");
      tips.push("Add VITE_API_URL=https://api.dreamnet.ink to Vercel project envs.");
    }

    if (!env.DATABASE_URL) {
      tips.push("DATABASE_URL missing; backend may fail to start without it.");
    }

    return {
      ok: true,
      agent: "deploykeeper",
      result: { problems, tips },
      messages: ["DeployKeeper scan complete"],
    };
  },
};


