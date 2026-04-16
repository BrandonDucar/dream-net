import type { Agent, AgentContext, AgentResult } from "../types";

export const RelayBotAgent: Agent = {
  name: "relaybot",
  description: "Simple message relay that echoes payload for now.",
  async run(ctx: AgentContext, input: unknown): Promise<AgentResult> {
    ctx.log("[RelayBot] relaying message");
    return { ok: true, agent: "relaybot", result: { echoed: input } };
  },
};


