import Redis from 'ioredis';
import { LRUCache } from 'lru-cache';

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
  costPerRequest: number; // USD
  totalCostMs: number; // Total cost in microcentimes
}

interface HopperStats {
  totalRequests: number;
  totalSuccess: number;
  totalFail: number;
  cacheHits: number;
  cacheMisses: number;
  totalEstimatedCost: number; // USD
  providers: Array<{
    name: string;
    id: string;
    healthy: boolean;
    free: boolean;
    successCount: number;
    failCount: number;
    avgLatencyMs: number;
    costPerRequest: number;
    totalCost: number; // USD
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
  private cacheHits = 0;
  private cacheMisses = 0;
  private cache: LRUCache<string, { response: string; provider: string; latencyMs: number }>;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://nerve:6379';
    this.redis = new Redis(redisUrl);
    
    // Initialize LRU cache: 500 items, 5 minute TTL
    this.cache = new LRUCache<string, any>({
      max: 500,
      ttl: 1000 * 60 * 5,
      updateAgeOnGet: true,
    });
    
    this.registerProviders();
    console.log(`🔄 [APIHopper] DreamNet LLM Gateway initialized with ${this.providers.length} providers`);
    this.providers.forEach(p => console.log(`   ${p.free ? '🆓' : '💰'} ${p.name} (${p.id}) - $${p.costPerRequest}/req`));
  }

  private registerProviders() {
    // Collect free tier providers first
    const freeProviders: LLMProvider[] = [];
    const paidProviders: LLMProvider[] = [];

    // === 1. Gemini 2.0 Flash (FREE: 15 RPM, $0/req) ===
    if (process.env.GEMINI_API_KEY) {
      freeProviders.push(this.makeProvider('Gemini 2.0 Flash', 'gemini', true, 0, async (sys, msg) => {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }, { apiVersion: 'v1beta' });
        const result = await model.generateContent(`[System Instructions]:\n${sys}\n\nUser: ${msg}`);
        return result.response.text();
      }));
    }

    // === 1b. Vertex AI (Google Cloud) ===
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.VERTEX_API_KEY) {
        freeProviders.push(this.makeProvider('Vertex AI (Gemini Pro)', 'vertex', true, 0, async (sys, msg) => {
            // Vertex implementation using discovery or simple fetch to rest endpoint
            const url = `https://${process.env.VERTEX_REGION || 'us-central1'}-aiplatform.googleapis.com/v1/projects/${process.env.VERTEX_PROJECT_ID}/locations/${process.env.VERTEX_REGION || 'us-central1'}/publishers/google/models/gemini-1.5-pro:streamGenerateContent`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${process.env.VERTEX_TOKEN}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: `${sys}\n\n${msg}` }] }]
                })
            });
            const data: any = await response.json();
            return data?.[0]?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }));
    }

    // === 2. Groq Mixtral (FREE: 30 RPM, $0/req) ===
    if (process.env.GROQ_API_KEY) {
      freeProviders.push(this.makeProvider('Groq (Mixtral)', 'groq', true, 0, async (sys, msg) => {
        return this.openAICompatible(
          'https://api.groq.com/openai/v1/chat/completions',
          process.env.GROQ_API_KEY!,
          'mixtral-8x7b-32768',
          sys, msg
        );
      }));

      // === 2b. Groq Llama 3.3 (FREE: 30 RPM, $0/req) ===
      freeProviders.push(this.makeProvider('Groq (Llama 3.3 70B)', 'groq-llama', true, 0, async (sys, msg) => {
        return this.openAICompatible(
          'https://api.groq.com/openai/v1/chat/completions',
          process.env.GROQ_API_KEY!,
          'llama-3.3-70b-versatile',
          sys, msg
        );
      }));
    }

    // === 3. Cerebras (FREE: 30 RPM, $0/req, VERY FAST) ===
    if (process.env.CEREBRAS_API_KEY) {
      freeProviders.push(this.makeProvider('Cerebras (Llama 3.1 8B)', 'cerebras', true, 0, async (sys, msg) => {
        return this.openAICompatible(
          'https://api.cerebras.ai/v1/chat/completions',
          process.env.CEREBRAS_API_KEY!,
          'llama3.1-8b',
          sys, msg
        );
      }));
    }

    // === 3b. DeepSeek API (FREE/LOW COST) ===
    if (process.env.DEEPSEEK_API_KEY) {
        freeProviders.push(this.makeProvider('DeepSeek (V3)', 'deepseek', true, 0, async (sys, msg) => {
            return this.openAICompatible(
                'https://api.deepseek.com/v1/chat/completions',
                process.env.DEEPSEEK_API_KEY!,
                'deepseek-chat',
                sys, msg
            );
        }));
    }

    // === 4. Together AI (FREE TIER, $0/req) ===
    if (process.env.TOGETHER_API_KEY) {
      freeProviders.push(this.makeProvider('Together AI (Mistral)', 'together', true, 0, async (sys, msg) => {
        return this.openAICompatible(
          'https://api.together.xyz/v1/chat/completions',
          process.env.TOGETHER_API_KEY!,
          'mistralai/Mistral-7B-Instruct-v0.3',
          sys, msg
        );
      }));
      
      // Add Qwen 2.5 via Together if possible
      freeProviders.push(this.makeProvider('Together AI (Qwen 2.5)', 'qwen', true, 0, async (sys, msg) => {
        return this.openAICompatible(
          'https://api.together.xyz/v1/chat/completions',
          process.env.TOGETHER_API_KEY!,
          'qwen/Qwen2.5-72B-Instruct',
          sys, msg
        );
      }));
    }

    // === 5. Hugging Face Inference (FREE, $0/req) ===
    if (process.env.HF_API_KEY) {
      freeProviders.push(this.makeProvider('Hugging Face (Mistral)', 'hf', true, 0, async (sys, msg) => {
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

    // === 6. OpenRouter (FREE MODELS, $0/req) ===
    if (process.env.OPENROUTER_API_KEY) {
      freeProviders.push(this.makeProvider('OpenRouter (Free Llama)', 'openrouter', true, 0, async (sys, msg) => {
        return this.openAICompatible(
          'https://openrouter.ai/api/v1/chat/completions',
          process.env.OPENROUTER_API_KEY!,
          'meta-llama/llama-3.1-8b-instruct:free',
          sys, msg,
          { 'HTTP-Referer': 'https://dreamnet.ink', 'X-Title': 'DreamNet' }
        );
      }));
    }

    // === 6b. Kimi (Moonshot AI) ===
    if (process.env.KIMI_API_KEY) {
        freeProviders.push(this.makeProvider('Kimi (Moonshot)', 'kimi', true, 0, async (sys, msg) => {
            return this.openAICompatible(
                'https://api.moonshot.cn/v1/chat/completions',
                process.env.KIMI_API_KEY!,
                'moonshot-v1-8k',
                sys, msg
            );
        }));
    }

    // === 7. xAI Grok (PAID if used, $0.015/req approx) ===
    if (process.env.XAI_API_KEY) {
      paidProviders.push(this.makeProvider('xAI (Grok)', 'xai', false, 0.015, async (sys, msg) => {
        return this.openAICompatible(
          'https://api.x.ai/v1/chat/completions',
          process.env.XAI_API_KEY!,
          'grok-beta',
          sys, msg
        );
      }));
    }

    // === 8. OpenAI GPT-4o-mini (PAID: ~$0.008/req) ===
    if (process.env.OPENAI_API_KEY) {
      paidProviders.push(this.makeProvider('OpenAI (GPT-4o-mini)', 'openai', false, 0.008, async (sys, msg) => {
        return this.openAICompatible(
          'https://api.openai.com/v1/chat/completions',
          process.env.OPENAI_API_KEY!,
          'gpt-4o-mini',
          sys, msg
        );
      }));
    }

    // === 9. Anthropic Claude 3 Haiku (PAID: ~$0.005/req) ===
    if (process.env.ANTHROPIC_API_KEY) {
      paidProviders.push(this.makeProvider('Anthropic (Haiku)', 'anthropic', false, 0.005, async (sys, msg) => {
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

    // === 10. Ollama Local (FREE TIER: unlimited, $0/req, OFFLINE CAPABLE) ===
    // This is the ABSOLUTE FALLBACK - always available locally, no rate limits
    if (process.env.OLLAMA_API_URL || true) { // Always try localhost:11434 as default
      const ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
      freeProviders.push(this.makeProvider('Ollama (Qwen 3 Fail-safe)', 'ollama', true, 0, async (sys, msg) => {
        const response = await fetch(`${ollamaUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: process.env.OLLAMA_MODEL || 'qwen2.5:72b', // Default to Qwen as requested
            prompt: `${sys}\n\n${msg}`,
            stream: false,
          }),
        });
        if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`);
        const data = await response.json();
        return data.response;
      }));

      // Extra backup for Gemma/Gamma
      freeProviders.push(this.makeProvider('Ollama (Gemma Fail-safe)', 'gemma', true, 0, async (sys, msg) => {
        const response = await fetch(`${ollamaUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gemma2:9b',
            prompt: `${sys}\n\n${msg}`,
            stream: false,
          }),
        });
        if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`);
        const data = await response.json();
        return data.response;
      }));
    }

    // FINAL PROVIDER ORDER:
    // 1. All FREE tier providers (Gemini -> Vertex -> Groq -> DeepSeek -> Together -> HF -> OpenRouter -> Ollama)
    // 2. All PAID tier providers (fallback only when necessary)
    
    this.providers = [...freeProviders, ...paidProviders];
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
    costPerRequest: number,
    query: (sys: string, msg: string) => Promise<string>
  ): LLMProvider {
    return { 
      name, 
      id, 
      query, 
      healthy: true, 
      lastUsed: 0, 
      successCount: 0, 
      failCount: 0, 
      avgLatencyMs: 0, 
      free,
      costPerRequest,
      totalCostMs: 0,
    };
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
   * Features: LRU caching, cost tracking, intelligent retry
   */
  async query(
    systemPrompt: string,
    userMessage: string,
    options?: { preferFree?: boolean; providerId?: string; maxRetries?: number; timeoutMs?: number; skipCache?: boolean }
  ): Promise<{ response: string; provider: string; latencyMs: number; cached: boolean }> {
    const { preferFree = true, providerId, maxRetries = 5, timeoutMs = 15000, skipCache = false } = options || {};
    this.totalRequests++;

    // Check cache first (unless skipped)
    if (!skipCache) {
      const cacheKey = `${systemPrompt}:${userMessage}`.slice(0, 200); // Limit key size
      const cached = this.cache.get(cacheKey);
      if (cached) {
        this.cacheHits++;
        console.log(`📦 [APIHopper] Cache HIT for "${userMessage.slice(0, 30)}..."`);
        return { ...cached, cached: true };
      }
      this.cacheMisses++;
    }

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
        provider.totalCostMs += Math.round(provider.costPerRequest * 100000); // Convert to microcentimes
        provider.avgLatencyMs = Math.round(
          (provider.avgLatencyMs * (provider.successCount - 1) + latencyMs) / provider.successCount
        );
        this.totalSuccess++;

        // Cache result
        const cacheKey = `${systemPrompt}:${userMessage}`.slice(0, 200);
        const result = { response, provider: provider.name, latencyMs, cached: false };
        this.cache.set(cacheKey, result);

        // Log to Redis
        await this.redis.xadd('dreamnet:api-hopper:log', '*',
          'provider', provider.id,
          'latencyMs', String(latencyMs),
          'status', 'success',
          'cost', String(provider.costPerRequest),
          'timestamp', String(Date.now())
        ).catch(() => {});

        return result;
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
   * Get hopper stats for monitoring & cost analysis
   */
  getStats(): HopperStats {
    const totalCost = this.providers.reduce((sum, p) => sum + p.totalCostMs, 0) / 100000; // Back to USD
    
    return {
      totalRequests: this.totalRequests,
      totalSuccess: this.totalSuccess,
      totalFail: this.totalFail,
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      totalEstimatedCost: totalCost,
      providers: this.providers.map(p => ({
        name: p.name,
        id: p.id,
        healthy: p.healthy,
        free: p.free,
        successCount: p.successCount,
        failCount: p.failCount,
        avgLatencyMs: p.avgLatencyMs,
        costPerRequest: p.costPerRequest,
        totalCost: p.totalCostMs / 100000, // Back to USD
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
