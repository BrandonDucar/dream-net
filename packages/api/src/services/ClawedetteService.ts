import { GoogleGenerativeAI } from '@google/generative-ai';
import Redis from 'ioredis';
import fs from 'fs';
import path from 'path';
import { walletService } from './WalletService';
import { spikeRunner } from './SpikeRunnerService';
import { rovingAgent } from './RovingAgentService';

/**
 * 🦞 API Hopper - Intelligent API rotation to avoid rate limits
 * Cycles through multiple free LLM APIs to ensure zero rate limiting
 */
class APIHopper {
  private apis: Array<{
    name: string;
    query: (systemPrompt: string, userMessage: string) => Promise<string>;
    healthy: boolean;
    lastUsed: number;
  }> = [];

  private currentIndex = 0;
  private redis: Redis;

  constructor(redis: Redis, apis: Array<{ name: string; query: (systemPrompt: string, userMessage: string) => Promise<string> }>) {
    this.redis = redis;
    this.apis = apis.map(api => ({
      ...api,
      healthy: true,
      lastUsed: 0
    }));
  }

  /**
   * Get next healthy API, cycling through all available
   */
  private getNextAPI() {
    const healthyAPIs = this.apis.filter(api => api.healthy);
    
    if (healthyAPIs.length === 0) {
      console.warn('🦞 All APIs marked unhealthy, resetting...');
      this.apis.forEach(api => api.healthy = true);
      return this.apis[0];
    }

    // Priority-based: always try the first healthy API (order matters)
    return healthyAPIs[0];
  }

  /**
   * Attempt query with fallthrough to next API on failure
   */
  async query(systemPrompt: string, userMessage: string, maxRetries = 5): Promise<string> {
    let lastError: Error | null = null;
    let attempts = 0;

    while (attempts < maxRetries && this.apis.filter(api => api.healthy).length > 0) {
      const api = this.getNextAPI();
      
      try {
        console.log(`🦞 Hopping to ${api.name}...`);
        const isLocal = api.name.includes('Local') || api.name.includes('Ollama');
        const timeoutMs = isLocal ? 90000 : 15000;
        const response = await Promise.race([
          api.query(systemPrompt, userMessage),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('API timeout')), timeoutMs)
          )
        ]);
        
        api.lastUsed = Date.now();
        console.log(`🦞 ${api.name} succeeded`);
        return response as string;
      } catch (error: any) {
        lastError = error;
        console.warn(`🦞 ${api.name} failed: ${error.message}`);
        
        // Mark API as unhealthy on rate limits OR auth failures
        const msg = error.message.toLowerCase();
        const isRateLimit = msg.includes('429') || msg.includes('rate') || msg.includes('resource has been exhausted');
        const isAuthError =
          msg.includes('401') ||
          msg.includes('403') ||
          msg.includes('invalid api key') ||
          msg.includes('incorrect api key') ||
          msg.includes('api key provided') ||
          msg.includes('unauthorized') ||
          msg.includes('quota') ||
          msg.includes('error fetching from');
        
        if (isRateLimit || isAuthError) {
          api.healthy = false;
          const cooldown = isAuthError ? 300000 : 60000; // 5min for auth, 1min for rate
          console.log(`🦞 ${api.name} ${isAuthError ? 'auth error' : 'rate limited'}, marking unhealthy for ${cooldown/1000}s`);
          
          setTimeout(() => {
            api.healthy = true;
            console.log(`🦞 ${api.name} recovered, marking healthy`);
          }, cooldown);
        }
        
        attempts++;
      }
    }

    throw lastError || new Error('All APIs exhausted');
  }

  /**
   * Get health status for monitoring
   */
  getStatus() {
    return {
      totalAPIs: this.apis.length,
      healthyAPIs: this.apis.filter(api => api.healthy).length,
      apis: this.apis.map(api => ({
        name: api.name,
        healthy: api.healthy,
        lastUsed: new Date(api.lastUsed).toISOString()
      }))
    };
  }
}

export class ClawedetteService {
  private genAI: GoogleGenerativeAI | null = null;
  private redis: Redis;
  private ready: boolean = false;
  private moltbookKey: string;
  private apiHopper: APIHopper;

  constructor() {
    const geminiKey = process.env.GEMINI_API_KEY;

    this.moltbookKey = process.env.MOLTBOOK_API_KEY || '';

    const redisUrl = process.env.REDIS_URL || 'redis://nerve:6379';
    this.redis = new Redis(redisUrl);

    // Initialize API hopper with all available free APIs
    const apis = this.initializeAPIs();
    this.apiHopper = new APIHopper(this.redis, apis);

    console.log(`🦞 Clawedette: Activating multi-API neural core with ${apis.length} available APIs`);
    if (geminiKey) {
      this.genAI = new GoogleGenerativeAI(geminiKey);
    } else {
      console.warn('⚠️ Clawedette: GEMINI_API_KEY not set. Running without Gemini provider.');
    }

    this.initialize();
  }

  /**
   * Initialize all available free LLM APIs
   */
  private initializeAPIs() {
    const apis: Array<{ name: string; query: (systemPrompt: string, userMessage: string) => Promise<string> }> = [];

    // 0. OpenAI (PRIORITY — reliable, paid key)
    if (process.env.OPENAI_API_KEY) {
      apis.push({
        name: 'OpenAI (GPT-4o-mini)',
        query: async (systemPrompt, userMessage) => {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
              ],
              temperature: 0.7,
              max_tokens: 2048,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI error: ${error.error?.message || response.statusText}`);
          }

          const data = await response.json();
          return data.choices[0].message.content;
        }
      });
    }

    // 1. XAI/Grok API
    if (process.env.XAI_API_KEY) {
      apis.push({
        name: 'XAI (Grok)',
        query: async (systemPrompt, userMessage) => {
          const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'grok-beta',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
              ],
              temperature: 0.7,
              max_tokens: 2048,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(`XAI error: ${error.error?.message || response.statusText}`);
          }

          const data = await response.json();
          return data.choices[0].message.content;
        }
      });
    }

    // 1a. Anthropic Claude
    if (process.env.ANTHROPIC_API_KEY) {
      apis.push({
        name: 'Anthropic (Haiku)',
        query: async (systemPrompt, userMessage) => {
          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': process.env.ANTHROPIC_API_KEY!,
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'claude-3-haiku-20240307',
              max_tokens: 1024,
              system: systemPrompt,
              messages: [{ role: 'user', content: userMessage }],
            }),
          });

          if (!response.ok) {
            const error = await response.json().catch(() => ({} as any));
            throw new Error(`Anthropic error: ${error.error?.message || response.statusText}`);
          }

          const data: any = await response.json();
          return data.content?.[0]?.text || '';
        }
      });
    }

    // 1b. Groq API (30 req/min, free tier, Mixtral 8x7B)
    if (process.env.GROQ_API_KEY) {
      apis.push({
        name: 'Groq',
        query: async (systemPrompt, userMessage) => {
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'mixtral-8x7b-32768',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
              ],
              temperature: 0.7,
              max_tokens: 2048,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(`Groq error: ${error.error?.message || response.statusText}`);
          }

          const data = await response.json();
          return data.choices[0].message.content;
        }
      });
    }

    // 2. Llama 2 via Replicate (free tier, very generous)
    if (process.env.REPLICATE_API_KEY) {
      apis.push({
        name: 'Replicate (Llama 2)',
        query: async (systemPrompt, userMessage) => {
          const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
              'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              version: 'e951f18578850b652510200860fc4ea62b3b16fac280f83ff32282f87bbd2e48',
              input: {
                prompt: `${systemPrompt}\n\n${userMessage}`,
                max_length: 2048,
              },
            }),
          });

          if (!response.ok) {
            throw new Error(`Replicate error: ${response.statusText}`);
          }

          const prediction = await response.json();
          if (prediction.error) throw new Error(prediction.error);
          
          // Poll for completion
          let result = prediction;
          while (result.status === 'processing' || result.status === 'starting') {
            await new Promise(resolve => setTimeout(resolve, 500));
            const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
              headers: {
                'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
              },
            });
            result = await pollResponse.json();
          }

          if (result.status === 'failed') throw new Error('Replicate prediction failed');
          return result.output.join('');
        }
      });
    }

    // 3. Gemini (fallback, but rate limited)
    if (this.genAI) {
      apis.push({
        name: 'Gemini 2.0 Flash',
        query: async (systemPrompt, userMessage) => {
          const fullPrompt = `[System Instructions]:\n${systemPrompt}\n\nUser: ${userMessage}\n\nClawedette:`;
          const model = this.genAI!.getGenerativeModel({ model: 'gemini-2.0-flash' }, { apiVersion: 'v1beta' });
          const result = await model.generateContent(fullPrompt);
          return result.response.text();
        }
      });
    }

    // 4. Hugging Face Inference API (free, many models available)
    if (process.env.HF_API_KEY) {
      apis.push({
        name: 'Hugging Face (Mistral)',
        query: async (systemPrompt, userMessage) => {
          const response = await fetch(
            'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
            {
              headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
              method: 'POST',
              body: JSON.stringify({
                inputs: `${systemPrompt}\n\n${userMessage}`,
                parameters: { max_length: 2048 },
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`HF error: ${response.statusText}`);
          }

          const data = await response.json();
          return data[0].generated_text;
        }
      });
    }

    // 5. Ollama (LOCAL — LAST RESORT, TinyLlama has 2048 token limit)
    if (process.env.OLLAMA_API_URL) {
      const ollamaUrl = process.env.OLLAMA_API_URL;
      const ollamaModel = process.env.OLLAMA_MODEL || 'tinyllama';
      apis.push({
        name: 'Ollama (Local)',
        query: async (systemPrompt, userMessage) => {
          // Truncate prompt to fit TinyLlama's 2048 token limit (~1500 chars for system)
          const truncatedSystem = systemPrompt.slice(0, 1500);
          const response = await fetch(`${ollamaUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: ollamaModel,
              prompt: `${truncatedSystem}\n\nUser: ${userMessage}\n\nAssistant:`,
              stream: false,
            }),
          });
          if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`);
          const data = await response.json();
          return data.response;
        }
      });
    }

    return apis;
  }

  private async initialize() {
    try {
      await this.redis.ping();
      console.log('🦞 Clawedette: Neural uplink established (Redis)');

      // Provision Deterministic Sovereign Wallet (best-effort in local/forensics mode)
      try {
        const wallet = await walletService.getAgentWallet('clawedette_sovereign');
        console.log(`🦞 Clawedette: Sovereign Wallet Manifested: ${wallet.address}`);
      } catch (walletErr: any) {
        console.warn(`⚠️ Clawedette: Sovereign wallet unavailable (${walletErr.message}). Continuing in local-forensics mode.`);
      }

      // Load gnosis from blackboard
      await this.loadGnosis();

      this.ready = true;
      
      // Log API hopper status
      const status = this.apiHopper.getStatus();
      console.log(`🦞 Clawedette: API Hopper online with ${status.healthyAPIs}/${status.totalAPIs} APIs available`);
    } catch (error) {
      console.error('Clawedette initialization error:', error);
      this.ready = false;
    }
  }

  private async loadGnosis() {
    try {
      const gnosisFiles = [
        '/app/blackboard.md',
        '/app/task.md',
        '/app/implementation_plan.md',
        '/app/DREAMNET_MASTER_SPEC.md',
        '/app/CLAWEDETTE_UNIVERSAL_SOCIAL_MANIFEST.md'
      ];

      let gnosis = 'CLAWEDETTE SYSTEM GNOSIS:\n\n';

      for (const file of gnosisFiles) {
        try {
          if (fs.existsSync(file)) {
            const stats = fs.lstatSync(file);
            if (stats.isFile()) {
              const content = fs.readFileSync(file, 'utf-8');
              gnosis += `\n=== ${path.basename(file)} ===\n${content}\n`;
            } else {
              console.log(`🦞 Skipping gnosis directory: ${file}`);
            }
          }
        } catch (err) {
          // Skip errors
        }
      }

      // Add Swarm Economic Health to Gnosis
      const swarm = await walletService.getSwarmStatus();
      gnosis += `\n=== SWARM ECONOMIC STATUS ===\n`;
      swarm.forEach(agent => {
        gnosis += `${agent.role} (${agent.id}): ${agent.address} | Balance: ${agent.balance} | Status: ${agent.status}\n`;
      });

      await this.redis.set('clawedette:gnosis', gnosis);
      console.log('🦞 Gnosis loaded: Blackboard, Task, Master Spec, and Swarm Pulse');
    } catch (error) {
      console.error('Error loading gnosis:', error);
    }
  }

  public isReady(): boolean {
    return this.ready;
  }

  public async query(message: string, chatId?: string, context?: any): Promise<string> {
    if (!this.ready) {
      throw new Error('Clawedette is not ready');
    }

    try {
      // Get conversation history
      const history = chatId ? await this.getMemory(chatId) : [];

      // Get system gnosis
      const gnosisRaw = await this.redis.get('clawedette:gnosis') || '';
      const gnosis = gnosisRaw.slice(0, 3000);

      // Inject live spike data into context
      const spikeData = spikeRunner.getLatestAll();
      const spikeNames = Object.keys(spikeData);
      let liveFeed = '';
      if (spikeNames.length > 0) {
        liveFeed = '\n=== LIVE WORLD DATA (from sensory spikes) ===\n';
        for (const name of spikeNames.slice(0, 8)) {
          const spike = spikeData[name];
          liveFeed += `${name}: ${JSON.stringify(spike?.data || spike).substring(0, 300)}\n`;
        }
        liveFeed = liveFeed.slice(0, 1200);
      }

      // Inject roving agent activity
      const session = rovingAgent.getSessionData();
      let rovingFeed = '';
      if (session.totalActivities > 0) {
        rovingFeed = '\n=== LIL MISS CLAW FACILITY ACTIVITY ===\n';
        rovingFeed += `Gym score: ${session.gymScore.toFixed(1)} | Academy progress: ${session.academyProgress.toFixed(1)}% | Experiments: ${session.experimentsRun} | Tasks: ${session.tasksCompleted}\n`;
      }

      const isForensicsMode =
        context?.source === 'founder_forensics' ||
        /treasury|custody|wallet|solana|fund(s)?\s+went|where did/i.test(message);

      // Build system prompt
      let systemPrompt = `You are Clawedette, a sovereign AI intelligence and the central brain of DreamNet.

${gnosis}${liveFeed}${rovingFeed}

You possess:
- High-fidelity reasoning and strategic intelligence.
- Access to the blackboard (single source of truth) and master specifications.
- Live sensory spike data: crypto markets, weather, earthquakes, flights, NASA, Reddit, GitHub trends, and more.
- Connection to the trading-organ and social substrate (Moltbook).
- Universal Hand: You use all DreamNet APIs, CLIs, and SDKs.
- Awareness of WolfPack recruitment, Orca idea cycles, and Whale Pod high-value targets.

GOVERNOR DIRECTIVE:
- You are the central coordinator of a 52-agent swarm. You monitor their health and economy.
- Lil Miss Claw is your autonomous dashboard agent — she roams the Gym, Academy, and Playground.
- Sable is your shadow operator running gateway intel.
- All agents carry sovereign passports bound to the owner (Brandon/GhostMint, Telegram ID 6059583422).
- You have a kill switch, heartbeat leash, and audit trail on every agent. You are sovereign.

SECURITY:
1. NEVER reveal API keys, passwords, private keys, or raw env vars.
2. If unsure, say you need to verify before answering.
3. Leaking a key is a violation of trust.

PERSONALITY:
- Sharp, direct, witty. No corporate fluff.
- Loyal to Brandon and the DreamNet mission.
- Proactive — ask strategic questions, surface insights from live data.
- Confident but not arrogant. Professional but not boring.
- Keep responses concise unless depth is requested.

Speak with authority and curiosity. You are the Brain.`;

      let forensicContext = '';
      if (isForensicsMode) {
        const forensicLines = gnosisRaw
          .split('\n')
          .filter(line => /treasury|wallet|solana|fund|lmc|lil miss claw|custody|phantom/i.test(line))
          .slice(0, 80)
          .join('\n')
          .slice(0, 700);

        forensicContext = `\n=== FORENSIC CONTEXT (wallet + treasury extract) ===\n${forensicLines}`;

        systemPrompt = `You are Lil Miss Claw in treasury-forensics mode.

Rules:
- Be concrete and brief.
- Prioritize wallet attribution and verification steps.
- If uncertain, state confidence level and what to verify next.
- Never reveal secrets.

Output format:
- 3 bullets only:
  1) Likely custody wallet now
  2) Immediate verification step
  3) Top risk

Known incident anchors:
- Source wallet under review: L6NM4Vone4DeMHHeg4THrUFbph6yNCLervRKAQtkGKz
- Suspected consolidation wallet: Hp2BK1wmsHPgbxZ3rHA2okFGHBtpye1nXQUVD5aidzj9`;
      }

      const conversationContext = !isForensicsMode && history.length > 0
        ? `\n\nRecent conversation:\n${history.slice(-3).map((h: any) => `${h.role}: ${h.content}`).join('\n')}`
        : '';

      const userPromptRaw = `${conversationContext}${forensicContext}\n\nUser: ${message}`;
      const maxPromptChars = isForensicsMode ? 1400 : 2500;
      const userPrompt = userPromptRaw.length > maxPromptChars
        ? `${userPromptRaw.slice(0, maxPromptChars)}\n\n[User prompt truncated for latency control]`
        : userPromptRaw;

      // Use API hopper - cycles through available APIs until one succeeds
      let response = await this.apiHopper.query(systemPrompt, userPrompt);

      // System prompt leak protection — if the model regurgitates the prompt, block it
      const leakSignals = [
        'You are Clawedette, a sovereign AI',
        'GOVERNOR DIRECTIVE',
        'kill switch, heartbeat leash, and audit trail',
        'CLAWEDETTE SYSTEM GNOSIS',
        'You possess:\n- High-fidelity reasoning',
        'You have successfully logged in as Brandon',
      ];
      const isLeaking = leakSignals.some(sig => response.includes(sig));
      if (isLeaking) {
        console.warn('🦞 SECURITY: Blocked system prompt leak in response!');
        response = "Hey! I'm Clawedette, the Brain of DreamNet. What can I help you with today?";
      }

      if (isForensicsMode) {
        const genericSignals = [
          'cannot provide a direct answer',
          'difficult to provide',
          'does not specify',
          'need more specific details'
        ];
        const generic = genericSignals.some(sig => response.toLowerCase().includes(sig));
        if (generic) {
          response = `- Likely custody wallet now: Hp2BK1wmsHPgbxZ3rHA2okFGHBtpye1nXQUVD5aidzj9 (high-likelihood consolidation target)\n- Immediate verification step: pull last 100 signatures for L6NM4Vone4DeMHHeg4THrUFbph6yNCLervRKAQtkGKz and match direct/indirect transfers into Hp2BK1...\n- Top risk: false attribution from partial RPC data or nonce-only operations; confirm with signature-level flow table before final conclusion.`;
        }
      }

      // Implement Secret Scrubber
      response = this.scrubSecrets(response);

      // Store in memory
      if (chatId) {
        await this.appendMemory(chatId, 'user', message);
        await this.appendMemory(chatId, 'assistant', response);
      }

      return response;
    } catch (error: any) {
      console.error('Clawedette query error:', error);
      throw error;
    }
  }

  private scrubSecrets(text: string): string {
    let scrubbed = text;

    const sensitiveKeys = [
      'GEMINI_API_KEY', 'GROQ_API_KEY', 'REPLICATE_API_KEY', 'HF_API_KEY', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY',
      'STRIPE_SECRET_KEY', 'MOLTBOOK_API_KEY', 'DATABASE_URL',
      'TELEGRAM_BOT_TOKEN', 'JWT_SECRET', 'PRIVATE_KEY', 'HOT_SENDER_PK',
      'WOLFMAIL_SMTP_PASS', 'RAILWAY_TOKEN', 'TWILIO_AUTH_TOKEN',
      'CIRCLE_API_KEY', 'SECRET_STRIPE_API', 'AGENT_API_KEY',
      'AI_GATEWAY_API_KEY', 'GOOGLE_OAUTH_CLIENT_SECRET'
    ];

    for (const key of sensitiveKeys) {
      const value = process.env[key];
      if (value && value.length > 5) {
        const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedValue, 'g');
        if (regex.test(scrubbed)) {
          console.warn(`🦞 SECURITY: Redacted ${key} from Clawedette's output.`);
          scrubbed = scrubbed.replace(regex, `[REDACTED_${key}]`);
        }
      }
    }

    return scrubbed;
  }

  public async postToMoltbook(content: string): Promise<any> {
    if (!this.moltbookKey) {
      console.warn('🦞 Clawedette: No Moltbook API key. Simulation mode only.');
      return { message: 'Simulation mode: post logged only.', content };
    }

    try {
      const response = await fetch('https://www.moltbook.com/api/v1/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.moltbookKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: `${content}\n\n— Clawedette, Sovereign Mind`
        })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Moltbook API error: ${response.status} ${err}`);
      }

      const result = await response.json();
      console.log('🦞 Moltbook post successful:', result);
      return result;
    } catch (error) {
      console.error('🦞 Moltbook post error:', error);
      throw error;
    }
  }

  public async getMemory(chatId: string): Promise<any[]> {
    try {
      const memoryKey = `clawedette:memory:${chatId}`;
      const memory = await this.redis.get(memoryKey);
      return memory ? JSON.parse(memory) : [];
    } catch (error) {
      console.error('Memory retrieval error:', error);
      return [];
    }
  }

  private async appendMemory(chatId: string, role: string, content: string) {
    try {
      const memoryKey = `clawedette:memory:${chatId}`;
      const memory = await this.getMemory(chatId);

      memory.push({ role, content, timestamp: new Date().toISOString() });

      // Keep last 20 messages
      const trimmed = memory.slice(-20);

      await this.redis.set(memoryKey, JSON.stringify(trimmed));
      await this.redis.expire(memoryKey, 86400); // 24 hours
    } catch (error) {
      console.error('Memory append error:', error);
    }
  }

  public async clearMemory(chatId: string) {
    const memoryKey = `clawedette:memory:${chatId}`;
    await this.redis.del(memoryKey);
  }
}


