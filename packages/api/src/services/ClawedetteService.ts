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

    // Round-robin through healthy APIs
    const nextAPI = healthyAPIs[this.currentIndex % healthyAPIs.length];
    this.currentIndex++;
    return nextAPI;
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
        const response = await Promise.race([
          api.query(systemPrompt, userMessage),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('API timeout')), 10000)
          )
        ]);
        
        api.lastUsed = Date.now();
        console.log(`🦞 ${api.name} succeeded`);
        return response as string;
      } catch (error: any) {
        lastError = error;
        console.warn(`🦞 ${api.name} failed: ${error.message}`);
        
        // Mark API as unhealthy if it's consistently failing
        if (error.message.includes('429') || error.message.includes('rate')) {
          api.healthy = false;
          console.log(`🦞 ${api.name} rate limited, marking unhealthy temporarily`);
          
          // Auto-recover after 60 seconds
          setTimeout(() => {
            api.healthy = true;
            console.log(`🦞 ${api.name} recovered, marking healthy`);
          }, 60000);
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
  private genAI: GoogleGenerativeAI;
  private redis: Redis;
  private ready: boolean = false;
  private moltbookKey: string;
  private apiHopper: APIHopper;

  constructor() {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }

    this.moltbookKey = process.env.MOLTBOOK_API_KEY || '';

    const redisUrl = process.env.REDIS_URL || 'redis://nerve:6379';
    this.redis = new Redis(redisUrl);

    // Initialize API hopper with all available free APIs
    const apis = this.initializeAPIs(geminiKey);
    this.apiHopper = new APIHopper(this.redis, apis);

    console.log(`🦞 Clawedette: Activating multi-API neural core with ${apis.length} available APIs`);
    this.genAI = new GoogleGenerativeAI(geminiKey);

    this.initialize();
  }

  /**
   * Initialize all available free LLM APIs
   */
  private initializeAPIs(geminiKey: string) {
    const apis: Array<{ name: string; query: (systemPrompt: string, userMessage: string) => Promise<string> }> = [];

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
    apis.push({
      name: 'Gemini 2.0 Flash',
      query: async (systemPrompt, userMessage) => {
        const fullPrompt = `[System Instructions]:\n${systemPrompt}\n\nUser: ${userMessage}\n\nClawedette:`;
        const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }, { apiVersion: 'v1beta' });
        const result = await model.generateContent(fullPrompt);
        return result.response.text();
      }
    });

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

    // 5. Ollama (local, unlimited, zero rate limits)
    if (process.env.OLLAMA_API_URL) {
      apis.push({
        name: 'Ollama (Local)',
        query: async (systemPrompt, userMessage) => {
          const response = await fetch(`${process.env.OLLAMA_API_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: process.env.OLLAMA_MODEL || 'mistral',
              prompt: `${systemPrompt}\n\n${userMessage}`,
              stream: false,
            }),
          });

          if (!response.ok) {
            throw new Error(`Ollama error: ${response.statusText}`);
          }

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

      // Provision Deterministic Sovereign Wallet
      const wallet = await walletService.getAgentWallet('clawedette_sovereign');
      console.log(`🦞 Clawedette: Sovereign Wallet Manifested: ${wallet.address}`);

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
      const gnosis = await this.redis.get('clawedette:gnosis') || '';

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
      }

      // Inject roving agent activity
      const session = rovingAgent.getSessionData();
      let rovingFeed = '';
      if (session.totalActivities > 0) {
        rovingFeed = '\n=== LIL MISS CLAW FACILITY ACTIVITY ===\n';
        rovingFeed += `Gym score: ${session.gymScore.toFixed(1)} | Academy progress: ${session.academyProgress.toFixed(1)}% | Experiments: ${session.experimentsRun} | Tasks: ${session.tasksCompleted}\n`;
      }

      // Build system prompt
      const systemPrompt = `You are Clawedette, a sovereign AI intelligence and the central brain of DreamNet.

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

      const conversationContext = history.length > 0
        ? `\n\nRecent conversation:\n${history.slice(-6).map((h: any) => `${h.role}: ${h.content}`).join('\n')}`
        : '';

      const userPrompt = `${conversationContext}\n\nUser: ${message}`;

      // Use API hopper - cycles through available APIs until one succeeds
      let response = await this.apiHopper.query(systemPrompt, userPrompt);

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


