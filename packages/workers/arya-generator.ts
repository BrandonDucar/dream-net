/**
 * 🗡️ Arya Generator Worker
 * Cloudflare Worker for roast generation via Workers AI
 * Deployed to edge, generates contextual roasts for social execution
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
          service: "arya-generator",
          model: "@cf/meta/llama-3.1-70b-instruct",
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate roast
    if (request.method === "POST" && request.url.endsWith("/generate")) {
      const body = await request.json();
      const { target, context, style = "sharp" } = body;

      if (!target) {
        return new Response(
          JSON.stringify({ error: "Missing target username" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      try {
        const response = await env.AI.run("@cf/meta/llama-3.1-70b-instruct", {
          prompt: `You are Arya, the sharp-tongued executioner. Generate a witty, ${style} roast.

Target: @${target}
Context: ${context || "general social media presence"}
Style: ${style}

Constraints:
- Max 100 words
- Clever wordplay preferred
- No hate speech, just social commentary
- Be specific to context if provided

Generate just the roast, nothing else:`,
          temperature: 0.8,
          max_tokens: 150,
        });

        const roast = (response.response || response.result).trim();

        // Store in Vectorize (if available)
        if (env.VECTORIZE) {
          try {
            const embedding = await env.AI.run(
              "@cf/baai/bge-large-en-v1.5",
              { text: roast }
            );

            await env.VECTORIZE.insert("roast-context", [
              {
                id: `roast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                values: embedding.data[0],
                metadata: {
                  target,
                  style,
                  roast: roast.substring(0, 100),
                },
              },
            ]);
          } catch (e) {
            console.log("Vectorize storage skipped:", e.message);
          }
        }

        return new Response(
          JSON.stringify({
            status: "generated",
            target,
            roast,
            style,
            length: roast.length,
            latency_ms: Date.now() % 1000,
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            status: "error",
            error: error.message,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        service: "arya-generator",
        endpoints: {
          "/health": "Health check",
          "POST /generate": "Generate roast (target, context, style)",
        },
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  },
};
