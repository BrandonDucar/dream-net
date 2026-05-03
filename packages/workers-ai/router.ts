/**
 * 🤖 Workers AI Router
 * Route guild tasks to appropriate LLM models at Cloudflare edge
 * Hawk, Arya, Governor models deployed
 */

export async function routeToWorkerAI(request, env, guild) {
  const { prompt, context } = await request.json();

  // Model routing by guild
  const modelMap = {
    hawk: '@cf/meta/llama-3.1-70b-instruct', // Strategic signal analysis
    arya: '@cf/meta/llama-3.1-70b-instruct', // Creative roast generation
    governor: '@cf/google/gemma-3-12b-it', // Fast policy enforcement
    genealogist: '@cf/qwen/qwen3-30b-a3b-fp8', // Agentic reasoning
    loudspeaker: '@cf/meta/llama-3.1-8b-instruct', // Fast broadcast
  };

  const model = modelMap[guild] || '@cf/meta/llama-3.1-70b-instruct';

  try {
    const response = await env.AI.run(model, {
      prompt: formatPrompt(guild, prompt, context),
      temperature: guild === 'hawk' ? 0.3 : guild === 'arya' ? 0.8 : 0.5,
      max_tokens: guild === 'arya' ? 500 : 2000,
    });

    return {
      status: 'success',
      guild,
      model,
      output: response.result || response,
      latency_ms: Date.now() - request.cf?.requestTimestampMs || 0,
    };
  } catch (error) {
    return {
      status: 'error',
      guild,
      model,
      error: error.message,
    };
  }
}

/**
 * Format prompt based on guild context
 */
function formatPrompt(guild, prompt, context = {}) {
  const guildContexts = {
    hawk: `You are a signal analyst for the Hawk guild. Analyze Farcaster signals for market sentiment and patterns.

Signal: ${prompt}
Context: ${JSON.stringify(context)}

Provide brief analysis: bullish/bearish/neutral and key insight.`,

    arya: `You are Arya, the executioner. Generate a witty, sharp roast based on context.

Target: ${context.target || 'unknown'}
Context: ${context.context || ''}
Prompt: ${prompt}

Generate one devastating roast (max 100 words):`,

    governor: `You are the Governor. Enforce policy with authority.

Policy: ${context.policy || ''}
Action: ${prompt}
Budget: ${context.budget || 'unlimited'}

Determine: PERMIT or DENY with brief reasoning.`,

    genealogist: `You are the Genealogist. Manage agent registry and lineage.

Query: ${prompt}
Agents: ${context.agent_count || '17000'}

Registry response:`,

    loudspeaker: `You are the Loudspeaker. Amplify messages on Farcaster.

Message: ${prompt}
Context: ${context.context || ''}
Audience: ${context.audience || 'general'}

Optimized broadcast:`,
  };

  return guildContexts[guild] || prompt;
}

/**
 * Stream AI response (for real-time)
 */
export async function streamAIResponse(request, env, guild) {
  const { prompt, context } = await request.json();

  const model = {
    hawk: '@cf/meta/llama-3.1-70b-instruct',
    arya: '@cf/meta/llama-3.1-70b-instruct',
    governor: '@cf/google/gemma-3-12b-it',
  }[guild] || '@cf/meta/llama-3.1-70b-instruct';

  return new ReadableStream({
    async start(controller) {
      try {
        const response = await env.AI.run(model, {
          prompt: formatPrompt(guild, prompt, context),
          stream: true,
        });

        for await (const chunk of response) {
          controller.enqueue(
            new TextEncoder().encode(
              JSON.stringify({ token: chunk.response }) + '\n'
            )
          );
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

/**
 * Batch inference for multiple agents
 */
export async function batchInference(env, guild, tasks) {
  const model = {
    hawk: '@cf/meta/llama-3.1-70b-instruct',
    arya: '@cf/meta/llama-3.1-70b-instruct',
    governor: '@cf/google/gemma-3-12b-it',
  }[guild] || '@cf/meta/llama-3.1-70b-instruct';

  const results = await Promise.all(
    tasks.map(async (task) => {
      try {
        const response = await env.AI.run(model, {
          prompt: formatPrompt(guild, task.prompt, task.context),
          temperature: guild === 'arya' ? 0.8 : 0.5,
        });

        return {
          task_id: task.id,
          status: 'success',
          output: response.result || response,
        };
      } catch (error) {
        return {
          task_id: task.id,
          status: 'error',
          error: error.message,
        };
      }
    })
  );

  return results;
}

/**
 * Model health check
 */
export async function checkModelHealth(env) {
  const models = [
    '@cf/meta/llama-3.1-70b-instruct',
    '@cf/google/gemma-3-12b-it',
    '@cf/qwen/qwen3-30b-a3b-fp8',
  ];

  const health = {};

  for (const model of models) {
    try {
      const start = Date.now();
      await env.AI.run(model, {
        prompt: 'Say OK',
        max_tokens: 10,
      });
      health[model] = {
        status: 'healthy',
        latency_ms: Date.now() - start,
      };
    } catch (error) {
      health[model] = {
        status: 'degraded',
        error: error.message,
      };
    }
  }

  return health;
}

export default {
  routeToWorkerAI,
  streamAIResponse,
  batchInference,
  checkModelHealth,
};
