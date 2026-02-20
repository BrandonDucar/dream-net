import Redis from 'ioredis';

/**
 * 🔄 DreamNet API Hopper — Shared LLM Gateway
 * 
 * Any agent in the swarm can call this to get an LLM response.
 * Cycles through free APIs with intelligent fallback:
 *   - Gemini 2.0 Flash (Google, free tier: 15 RPM)
 *   - Groq (Mixtral/Llama, free tier: 30 RPM)
 *   - xAI Grok (free tier if key set)
 *   - Hugging Face Inference (free, many models)
 *   - Ollama (local, unlimited)
 *   - Cerebras (free tier: 30 RPM)
 *   - Together AI (free tier if key set)
 *   - OpenRouter (free models available)
 * 
 * Features:
 *   - Round-robin with health tracking
 *   - Auto-recovery from rate limits (60s cooldown)
 *   - Per-API usage stats in Redis
 *   - Configurable timeout per provider
 *   - Caller can request specific provider or "any"
 */

interface LLMProvider {
  name: string;
  id: string;
  query: (systemPrompt: string, userMessage: string) => Promise<string>;
  healthy: boolean;
  lastUsed: number;
  successCount: number;
  failCount: number;
  avgLatencyMs: number;
  free: boolean;
}

interface HopperStats {
  totalRequests: number;
  totalSuccess: number;
  totalFail: number;
  providers: Array<{
    name: string;
    id: string;
    healthy: boolean;
    free: boolean;
    successCount: number;
    failCount: number;
    avgLatencyMs: number;
    lastUsed: string;
  }>;
}

export class APIHopperService {
  private providers: LLMProvider[] = [];
  private currentIndex = 0;
  private redis: Redis;
  private totalRequests = 0;
  private totalSuccess = 0;
  private totalFail = 0;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://nerve:6379';
    this.redis = new Redis(redisUrl);
    this.registerProviders();
    console.log(`🔄 [APIHopper] DreamNet LLM Gateway initialized with ${this.providers.length} providers`);
    this.providers.forEach(p => console.log(`   ${p.free ? '🆓' : '💰'} ${p.name} (${p.id})`));
  }

  private registerProviders() {
    // === 1. Gemini 2.0 Flash (always available if key set) ===
    if (process.env.GEMINI_API_KEY) {
      this.providers.push(this.makeProvider('Gemini 2.0 Flash', 'gemini', true, async (sys, msg) => {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }, { apiVersion: 'v1beta' });
        const result = await model.generateContent(`[System Instructions]:\n${sys}\n\nUser: ${msg}`);
        return result.response.text();
      }));
    }

    // === 2. Groq (Mixtral 8x7B, 30 RPM free) ===
    if (process.env.GROQ_API_KEY) {
      this.providers.push(this.makeProvider('Groq (Mixtral)', 'groq', true, async (sys, msg) => {
        return this.openAICompatible(
          'https://api.groq.com/openai/v1/chat/completions',
          process.env.GROQ_API_KEY!,
          'mixtral-8x7b-32768',
          sys, msg
        );
      }));

      // Groq also has Llama 3.3 70B free
      this.providers.push(this.makeProvider('Groq (Llama 3.3 70B)', 'groq-llama', true, async (sys, msg) => {
        return this.openAICompatible(
          'https://api.groq.com/openai/v1/chat/completions',
          process.env.GROQ_API_KEY!,
          'llama-3.3-70b-versatile',
          sys, msg
        );
      }));
    }

    // === 3. xAI Grok ===
    if (process.env.XAI_API_KEY) {
      this.providers.push(this.makeProvider('xAI (Grok)', 'xai', false, async (sys, msg) => {
        return this.openAICompatible(
          'https://api.x.ai/v1/chat/completions',
          process.env.XAI_API_KEY!,
          'grok-beta',
          sys, msg
        );
      }));
    }

    // === 4. Cerebras (free tier, very fast inference) ===
    if (process.env.CEREBRAS_API_KEY) {
      this.providers.push(this.makeProvider('Cerebras (Llama 3.1 8B)', 'cerebras', true, async (sys, msg) => {
        return this.openAICompatible(
          'https://api.cerebras.ai/v1/chat/completions',
          process.env.CEREBRAS_API_KEY!,
          'llama3.1-8b',
          sys, msg
        );
      }));
    }

    // === 5. Together AI (free tier models) ===
    if (process.env.TOGETHER_API_KEY) {
      this.providers.push(this.makeProvider('Together AI (Mistral)', 'together', true, async (sys, msg) => {
        return this.openAICompatible(
          'https://api.together.xyz/v1/chat/completions',
          process.env.TOGETHER_API_KEY!,
          'mistralai/Mistral-7B-Instruct-v0.3',
          sys, msg
        );
      }));
    }

    // === 6. OpenRouter (free models: meta-llama, mistral, etc.) ===
    if (process.env.OPENROUTER_API_KEY) {
      this.providers.push(this.makeProvider('OpenRouter (Free Llama)', 'openrouter', true, async (sys, msg) => {
        return this.openAICompatible(
          'https://openrouter.ai/api/v1/chat/completions',
          process.env.OPENROUTER_API_KEY!,
          'meta-llama/llama-3.1-8b-instruct:free',
          sys, msg,
          { 'HTTP-Referer': 'https://dreamnet.ink', 'X-Title': 'DreamNet' }
        );
      }));
    }

    // === 7. Hugging Face Inference ===
    if (process.env.HF_API_KEY) {
      this.providers.push(this.makeProvider('Hugging Face (Mistral)', 'hf', true, async (sys, msg) => {
        const response = await fetch(
          'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
          {
            headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
            method: 'POST',
            body: JSON.stringify({
              inputs: `${sys}\n\n${msg}`,
              parameters: { max_length: 2048 },
            }),
          }
        );
        if (!response.ok) throw new Error(`HF error: ${response.statusText}`);
        const data = await response.json();
        return data[0]?.generated_text || '';
      }));
    }

    // === 8. Ollama (local, unlimited, zero rate limits) ===
    if (process.env.OLLAMA_API_URL) {
      this.providers.push(this.makeProvider('Ollama (Local)', 'ollama', true, async (sys, msg) => {
        const response = await fetch(`${process.env.OLLAMA_API_URL}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: process.env.OLLAMA_MODEL || 'mistral',
            prompt: `${sys}\n\n${msg}`,
            stream: false,
          }),
        });
        if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`);
        const data = await response.json();
        return data.response;
      }));
    }

    // === 9. OpenAI (paid, but included if key exists) ===
    if (process.env.OPENAI_API_KEY) {
      this.providers.push(this.makeProvider('OpenAI (GPT-4o-mini)', 'openai', false, async (sys, msg) => {
        return this.openAICompatible(
          'https://api.openai.com/v1/chat/completions',
          process.env.OPENAI_API_KEY!,
          'gpt-4o-mini',
          sys, msg
        );
      }));
    }

    // === 10. Anthropic (paid, but included if key exists) ===
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.push(this.makeProvider('Anthropic (Haiku)', 'anthropic', false, async (sys, msg) => {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY!,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 2048,
            system: sys,
            messages: [{ role: 'user', content: msg }],
          }),
        });
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(`Anthropic error: ${(err as any).error?.message || response.statusText}`);
        }
        const data: any = await response.json();
        return data.content?.[0]?.text || '';
      }));
    }
  }

  /**
   * Helper: OpenAI-compatible chat completions (works for Groq, xAI, Cerebras, Together, OpenRouter, OpenAI)
   */
  private async openAICompatible(
    url: string,
    apiKey: string,
    model: string,
    systemPrompt: string,
    userMessage: string,
    extraHeaders?: Record<string, string>
  ): Promise<string> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...extraHeaders,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`${model} error: ${(err as any).error?.message || response.statusText}`);
    }

    const data: any = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  private makeProvider(
    name: string,
    id: string,
    free: boolean,
    query: (sys: string, msg: string) => Promise<string>
  ): LLMProvider {
    return { name, id, query, healthy: true, lastUsed: 0, successCount: 0, failCount: 0, avgLatencyMs: 0, free };
  }

  /**
   * Get next healthy provider (round-robin, prefers free)
   */
  private getNextProvider(preferFree: boolean = true, specificId?: string): LLMProvider | null {
    if (specificId) {
      const specific = this.providers.find(p => p.id === specificId && p.healthy);
      if (specific) return specific;
    }

    let candidates = this.providers.filter(p => p.healthy);
    if (preferFree && candidates.some(p => p.free)) {
      candidates = candidates.filter(p => p.free);
    }

    if (candidates.length === 0) return null;

    const next = candidates[this.currentIndex % candidates.length];
    this.currentIndex++;
    return next;
  }

  /**
   * Main query method — any agent calls this
   */
  async query(
    systemPrompt: string,
    userMessage: string,
    options?: { preferFree?: boolean; providerId?: string; maxRetries?: number; timeoutMs?: number }
  ): Promise<{ response: string; provider: string; latencyMs: number }> {
    const { preferFree = true, providerId, maxRetries = 5, timeoutMs = 15000 } = options || {};
    this.totalRequests++;

    let lastError: Error | null = null;
    let attempts = 0;

    while (attempts < maxRetries) {
      const provider = this.getNextProvider(preferFree, providerId);

      if (!provider) {
        // All providers down — reset and try once more
        console.warn('🔄 [APIHopper] All providers unhealthy, resetting...');
        this.providers.forEach(p => p.healthy = true);
        attempts++;
        continue;
      }

      const start = Date.now();
      try {
        console.log(`🔄 [APIHopper] → ${provider.name}`);
        const response = await Promise.race([
          provider.query(systemPrompt, userMessage),
          new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error('API timeout')), timeoutMs)
          )
        ]);

        const latencyMs = Date.now() - start;
        provider.lastUsed = Date.now();
        provider.successCount++;
        provider.avgLatencyMs = Math.round(
          (provider.avgLatencyMs * (provider.successCount - 1) + latencyMs) / provider.successCount
        );
        this.totalSuccess++;

        // Log to Redis
        await this.redis.xadd('dreamnet:api-hopper:log', '*',
          'provider', provider.id,
          'latencyMs', String(latencyMs),
          'status', 'success',
          'timestamp', String(Date.now())
        ).catch(() => {});

        return { response, provider: provider.name, latencyMs };
      } catch (error: any) {
        const latencyMs = Date.now() - start;
        lastError = error;
        provider.failCount++;
        this.totalFail++;

        console.warn(`🔄 [APIHopper] ✗ ${provider.name}: ${error.message} (${latencyMs}ms)`);

        // Rate limit detection
        if (error.message.includes('429') || error.message.includes('rate') || error.message.includes('quota')) {
          provider.healthy = false;
          console.log(`🔄 [APIHopper] ${provider.name} rate limited — cooling down 60s`);
          setTimeout(() => {
            provider.healthy = true;
            console.log(`🔄 [APIHopper] ${provider.name} recovered`);
          }, 60_000);
        }

        // Log failure to Redis
        await this.redis.xadd('dreamnet:api-hopper:log', '*',
          'provider', provider.id,
          'latencyMs', String(latencyMs),
          'status', 'fail',
          'error', error.message.slice(0, 200),
          'timestamp', String(Date.now())
        ).catch(() => {});

        attempts++;
      }
    }

    throw lastError || new Error('All LLM providers exhausted');
  }

  /**
   * Get hopper stats for monitoring
   */
  getStats(): HopperStats {
    return {
      totalRequests: this.totalRequests,
      totalSuccess: this.totalSuccess,
      totalFail: this.totalFail,
      providers: this.providers.map(p => ({
        name: p.name,
        id: p.id,
        healthy: p.healthy,
        free: p.free,
        successCount: p.successCount,
        failCount: p.failCount,
        avgLatencyMs: p.avgLatencyMs,
        lastUsed: p.lastUsed ? new Date(p.lastUsed).toISOString() : 'never',
      }))
    };
  }

  /**
   * List available provider IDs
   */
  getProviderIds(): string[] {
    return this.providers.map(p => p.id);
  }

  /**
   * Force-reset all providers to healthy
   */
  resetAll() {
    this.providers.forEach(p => p.healthy = true);
    console.log('🔄 [APIHopper] All providers reset to healthy');
  }
}

export const apiHopper = new APIHopperService();
