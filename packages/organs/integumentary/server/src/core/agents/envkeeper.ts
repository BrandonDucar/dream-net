import type { Agent, AgentContext, AgentResult } from "../types";

export const EnvKeeperAgent: Agent = {
  name: "envkeeper",
  description: "Validates required env vars and reports missing/blank.",
  async run(ctx: AgentContext): Promise<AgentResult> {
    const required = ["DATABASE_URL"];
    const optional = ["VITE_API_URL", "BASE_MAINNET_RPC_URL"];
    const missing = required.filter((k) => !ctx.env[k]);
    const hints = optional.filter((k) => !ctx.env[k]);
    const ok = missing.length === 0;
    return {
      ok,
      agent: "envkeeper",
      result: { missing, hints },
      messages: ok ? ["All required env present"] : ["Missing required env vars"],
    };
  },
};


