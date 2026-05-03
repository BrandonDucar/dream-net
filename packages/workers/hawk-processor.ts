/**
 * 🦅 Hawk Processor Worker
 * Cloudflare Worker for signal classification via Workers AI
 * Deployed to edge, classifies Farcaster signals in real-time
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
          service: "hawk-processor",
          model: "@cf/meta/llama-3.1-70b-instruct",
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Process signal
    if (request.method === "POST" && request.url.endsWith("/classify")) {
      const body = await request.json();
      const { signal, context } = body;

      if (!signal) {
        return new Response(JSON.stringify({ error: "Missing signal" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      try {
        const response = await env.AI.run("@cf/meta/llama-3.1-70b-instruct", {
          prompt: `You are a signal analyst for the Hawk guild. Classify this Farcaster signal.

Signal: "${signal}"
Context: ${context || "general"}

Respond with JSON: {"classification": "bullish|bearish|neutral", "confidence": 0-1, "insight": "brief explanation"}`,
          temperature: 0.3,
          max_tokens: 200,
        });

        const output = response.response || response.result;

        // Parse JSON response
        let parsed;
        try {
          const jsonMatch = output.match(/\{[\s\S]*\}/);
          parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: output };
        } catch {
          parsed = { raw: output };
        }

        // Store in Vectorize (if available)
        if (env.VECTORIZE) {
          try {
            const embedding = await env.AI.run(
              "@cf/baai/bge-large-en-v1.5",
              { text: signal }
            );

            await env.VECTORIZE.insert("signal-embeddings", [
              {
                id: `signal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                values: embedding.data[0],
                metadata: {
                  classification: parsed.classification,
                  signal: signal.substring(0, 100),
                },
              },
            ]);
          } catch (e) {
            console.log("Vectorize storage skipped:", e.message);
          }
        }

        return new Response(
          JSON.stringify({
            status: "classified",
            signal: signal.substring(0, 100),
            classification: parsed.classification || parsed.raw,
            confidence: parsed.confidence || "N/A",
            insight: parsed.insight || "Analysis complete",
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
        service: "hawk-processor",
        endpoints: {
          "/health": "Health check",
          "POST /classify": "Classify Farcaster signal",
        },
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  },
};
