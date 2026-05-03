/**
 * 🛡️ Governor Enforcer Worker
 * Cloudflare Worker for policy enforcement via Workers AI
 * Deployed to edge, makes fast policy decisions (100ms latency critical)
 */

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Health check
    if (request.url.endsWith("/health")) {
      return new Response(
        JSON.stringify({
          status: "healthy",
          service: "governor-enforcer",
          model: "@cf/google/gemma-3-12b-it",
          sla: "100ms p50",
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Enforce policy (FAST - use smaller model)
    if (request.method === "POST" && request.url.endsWith("/enforce")) {
      const body = await request.json();
      const { policy, action, agent_id, budget = 1000000 } = body;

      if (!policy || !action) {
        return new Response(
          JSON.stringify({ error: "Missing policy or action" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      try {
        const start = Date.now();

        const response = await env.AI.run("@cf/google/gemma-3-12b-it", {
          prompt: `You are the Governor. Enforce policy.

Policy: ${policy}
Agent: ${agent_id || "unknown"}
Requested Action: ${action}
Budget: ${budget}

Decision: PERMIT or DENY
Reason: one sentence

Format: DECISION: PERMIT|DENY
Reason: [explanation]`,
          temperature: 0.2, // Low temp for consistent decisions
          max_tokens: 100,
        });

        const decision = (response.response || response.result).trim();

        // Parse decision
        const lines = decision.split("\n");
        const decision_line = lines.find((l) => l.includes("PERMIT") || l.includes("DENY"));
        const decision_result = decision_line?.includes("PERMIT") ? "PERMIT" : "DENY";

        const latency = Date.now() - start;

        return new Response(
          JSON.stringify({
            status: "enforced",
            policy,
            action,
            agent_id,
            decision: decision_result,
            full_response: decision,
            latency_ms: latency,
            compliant: latency < 500, // 100ms SLA compliance
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            status: "error",
            error: error.message,
            decision: "DENY", // Fail-safe: deny on error
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Rate limiting check
    if (request.method === "POST" && request.url.endsWith("/ratelimit")) {
      const body = await request.json();
      const { agent_id, rate_limit = 100 } = body;

      // Simple rate limit check (use Durable Objects for distributed state in production)
      const key = `ratelimit:${agent_id}`;
      const current = (await env.KV?.get(key)) || "0";
      const count = parseInt(current) + 1;

      if (count > rate_limit) {
        return new Response(
          JSON.stringify({
            status: "rate_limited",
            agent_id,
            current_count: count,
            limit: rate_limit,
          }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }

      await env.KV?.put(key, String(count), { expirationTtl: 60 });

      return new Response(
        JSON.stringify({
          status: "allowed",
          agent_id,
          current_count: count,
          limit: rate_limit,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        service: "governor-enforcer",
        endpoints: {
          "/health": "Health check",
          "POST /enforce": "Enforce policy (policy, action, agent_id, budget)",
          "POST /ratelimit": "Check rate limit (agent_id, rate_limit)",
        },
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  },
};
