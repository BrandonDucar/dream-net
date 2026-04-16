import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import Redis from 'ioredis';

/**
 * DreamNetToolkit — Unified API surface for all OpenClaw agents
 * 
 * Gives Clawedette, Sable, and LMC access to:
 * - Blackboard (single source of truth)
 * - Sensory Spikes (live world data)
 * - Sovereign Bridge (inter-agent comms)
 * - API Hopper (LLM gateway)
 * - Gym / Academy / Playground
 * - Surge x402 (Farcaster engagement)
 * - Roving Agent data
 * - Sovereign Override controls
 * - Wallet & economy
 * - Gnosis docs
 */

interface Tool {
  name: string;
  description: string;
  category: string;
  method: 'GET' | 'POST' | 'DELETE';
  endpoint: string;
  params?: Record<string, { type: string; required: boolean; description: string }>;
}

export class DreamNetToolkit {
  private redis: Redis;
  private blackboardPath: string;
  private gnosisPath: string;

  constructor(redis: Redis) {
    this.redis = redis;
    // Check both possible blackboard locations
    this.blackboardPath = existsSync('/app/monorepo/blackboard.md')
      ? '/app/monorepo/blackboard.md'
      : existsSync('C:\\dev\\dream-net\\blackboard.md')
        ? 'C:\\dev\\dream-net\\blackboard.md'
        : '/app/monorepo/blackboard.md';
    this.gnosisPath = existsSync('/app/monorepo/docs/mastery')
      ? '/app/monorepo/docs/mastery'
      : existsSync('C:\\dev\\dream-net\\docs\\mastery')
        ? 'C:\\dev\\dream-net\\docs\\mastery'
        : '/app/monorepo/docs/mastery';
    console.log('🧰 [Toolkit] DreamNet Toolkit initialized');
  }

  // ==================== BLACKBOARD ====================

  readBlackboard(): string {
    try {
      return readFileSync(this.blackboardPath, 'utf-8');
    } catch (err: any) {
      return `[Blackboard unavailable: ${err.message}]`;
    }
  }

  readBlackboardSection(section: string): string {
    const board = this.readBlackboard();
    const lines = board.split('\n');
    let capturing = false;
    let result: string[] = [];
    const sectionLower = section.toLowerCase();

    for (const line of lines) {
      if (line.toLowerCase().includes(sectionLower) && (line.startsWith('#') || line.startsWith('*'))) {
        capturing = true;
        result.push(line);
        continue;
      }
      if (capturing) {
        // Stop at next section header of same or higher level
        if (line.startsWith('## ') && result.length > 1) break;
        result.push(line);
      }
    }

    return result.length > 0 ? result.join('\n') : `[Section "${section}" not found on blackboard]`;
  }

  // ==================== GNOSIS ====================

  readGnosis(filename: string): string {
    try {
      const fullPath = join(this.gnosisPath, filename);
      return readFileSync(fullPath, 'utf-8');
    } catch (err: any) {
      return `[Gnosis file "${filename}" unavailable: ${err.message}]`;
    }
  }

  listGnosisDocs(): string[] {
    try {
      const { readdirSync } = require('fs');
      return readdirSync(this.gnosisPath).filter((f: string) => f.endsWith('.md'));
    } catch {
      return [];
    }
  }

  // ==================== REDIS STATE ====================

  async getRedisKey(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch {
      return null;
    }
  }

  async getAgentPassports(): Promise<Record<string, string>> {
    try {
      return await this.redis.hgetall('dreamnet:passports') || {};
    } catch {
      return {};
    }
  }

  async getSovereignBindings(): Promise<Record<string, string>> {
    try {
      return await this.redis.hgetall('sovereign:bindings') || {};
    } catch {
      return {};
    }
  }

  // ==================== TOOL CATALOG ====================

  getToolCatalog(): Tool[] {
    return [
      // --- BLACKBOARD ---
      {
        name: 'read_blackboard',
        description: 'Read the DreamNet unified blackboard — the single source of truth for all agents. Contains mission status, intelligence, infrastructure, agent directives.',
        category: 'blackboard',
        method: 'GET',
        endpoint: '/api/toolkit/blackboard',
      },
      {
        name: 'read_blackboard_section',
        description: 'Read a specific section of the blackboard by keyword (e.g., "OPTIO", "HARDWARE", "AGENT STATUS")',
        category: 'blackboard',
        method: 'GET',
        endpoint: '/api/toolkit/blackboard/section/:keyword',
        params: { keyword: { type: 'string', required: true, description: 'Section keyword to search for' } },
      },
      // --- GNOSIS ---
      {
        name: 'list_gnosis',
        description: 'List all gnosis/mastery documents available in the knowledge base',
        category: 'gnosis',
        method: 'GET',
        endpoint: '/api/toolkit/gnosis',
      },
      {
        name: 'read_gnosis',
        description: 'Read a specific gnosis document by filename',
        category: 'gnosis',
        method: 'GET',
        endpoint: '/api/toolkit/gnosis/:filename',
        params: { filename: { type: 'string', required: true, description: 'Gnosis document filename (e.g., GNOSIS_2026.md)' } },
      },
      // --- SPIKES (Live World Data) ---
      {
        name: 'get_all_spikes',
        description: 'Get all latest sensory spike data — crypto, weather, earthquakes, flights, NASA, Reddit, GitHub trends',
        category: 'spikes',
        method: 'GET',
        endpoint: '/api/spikes',
      },
      {
        name: 'get_spike_category',
        description: 'Get spikes by category: financial, weather, earth, defense, science, social, infra',
        category: 'spikes',
        method: 'GET',
        endpoint: '/api/spikes/:category',
        params: { category: { type: 'string', required: true, description: 'Spike category' } },
      },
      // --- API HOPPER (LLM Gateway) ---
      {
        name: 'query_llm',
        description: 'Query any LLM through the API Hopper — auto-routes to the best available provider',
        category: 'hopper',
        method: 'POST',
        endpoint: '/api/hopper/query',
        params: {
          message: { type: 'string', required: true, description: 'The message/prompt to send' },
          systemPrompt: { type: 'string', required: false, description: 'Optional system prompt' },
        },
      },
      {
        name: 'hopper_stats',
        description: 'Get API Hopper health stats — provider status, latency, usage',
        category: 'hopper',
        method: 'GET',
        endpoint: '/api/hopper/stats',
      },
      {
        name: 'hopper_providers',
        description: 'List all available LLM providers and their status',
        category: 'hopper',
        method: 'GET',
        endpoint: '/api/hopper/providers',
      },
      // --- SOVEREIGN BRIDGE (Inter-Agent Comms) ---
      {
        name: 'bridge_send',
        description: 'Send a message to another DreamNet agent',
        category: 'bridge',
        method: 'POST',
        endpoint: '/bridge/send',
        params: {
          from: { type: 'string', required: true, description: 'Sender agent ID' },
          to: { type: 'string', required: true, description: 'Recipient agent ID' },
          content: { type: 'string', required: true, description: 'Message content' },
        },
      },
      {
        name: 'bridge_broadcast',
        description: 'Broadcast a message to ALL DreamNet agents',
        category: 'bridge',
        method: 'POST',
        endpoint: '/bridge/broadcast',
        params: {
          from: { type: 'string', required: true, description: 'Sender agent ID' },
          content: { type: 'string', required: true, description: 'Broadcast message' },
        },
      },
      {
        name: 'bridge_inbox',
        description: 'Read an agent\'s inbox — pending messages from other agents',
        category: 'bridge',
        method: 'GET',
        endpoint: '/bridge/inbox/:agentId',
        params: { agentId: { type: 'string', required: true, description: 'Agent ID to check inbox for' } },
      },
      {
        name: 'bridge_agents',
        description: 'List all registered agents on the Sovereign Bridge',
        category: 'bridge',
        method: 'GET',
        endpoint: '/bridge/agents',
      },
      {
        name: 'bridge_assign_task',
        description: 'Assign a task to another agent',
        category: 'bridge',
        method: 'POST',
        endpoint: '/bridge/task',
        params: {
          assignedTo: { type: 'string', required: true, description: 'Agent ID to assign task to' },
          title: { type: 'string', required: true, description: 'Task title' },
          description: { type: 'string', required: false, description: 'Task description' },
          priority: { type: 'string', required: false, description: 'Priority: low, medium, high, critical' },
        },
      },
      {
        name: 'bridge_tasks',
        description: 'Get all tasks assigned to an agent',
        category: 'bridge',
        method: 'GET',
        endpoint: '/bridge/tasks/:agentId',
        params: { agentId: { type: 'string', required: true, description: 'Agent ID' } },
      },
      {
        name: 'bridge_topology',
        description: 'Get the full network topology map of all agents and connections',
        category: 'bridge',
        method: 'GET',
        endpoint: '/bridge/topology',
      },
      // --- ROVING AGENT (Facility Data) ---
      {
        name: 'roving_session',
        description: 'Get Lil Miss Claw\'s current session data — gym score, academy progress, experiments',
        category: 'roving',
        method: 'GET',
        endpoint: '/api/roving/session',
      },
      {
        name: 'roving_timeline',
        description: 'Get activity timeline — last N actions across Gym, Academy, Playground',
        category: 'roving',
        method: 'GET',
        endpoint: '/api/roving/timeline',
      },
      {
        name: 'roving_facilities',
        description: 'Get latest activity per facility — for dashboard cards',
        category: 'roving',
        method: 'GET',
        endpoint: '/api/roving/facilities',
      },
      // --- DASHBOARD ---
      {
        name: 'full_dashboard',
        description: 'Get the complete proof-of-work dashboard — spikes, roving, hopper, bridge, all in one call',
        category: 'dashboard',
        method: 'GET',
        endpoint: '/api/dashboard',
      },
      // --- GYM / ACADEMY / PLAYGROUND ---
      {
        name: 'gym_massage',
        description: 'Trigger a digital massage — optimize agent performance',
        category: 'gym',
        method: 'POST',
        endpoint: '/care/massage',
      },
      {
        name: 'gym_cold_plunge',
        description: 'Trigger a cold plunge — reset and refresh agent state',
        category: 'gym',
        method: 'POST',
        endpoint: '/care/cold-plunge',
      },
      {
        name: 'gym_yoga',
        description: 'Trigger yoga — flexibility and adaptability training',
        category: 'gym',
        method: 'POST',
        endpoint: '/care/yoga',
      },
      // --- EVOLUTION ---
      {
        name: 'self_benchmark',
        description: 'Run a self-benchmark — measure current agent capabilities',
        category: 'evolution',
        method: 'POST',
        endpoint: '/evolve/self-benchmark',
      },
      {
        name: 'ingest_gnosis',
        description: 'Ingest latest gnosis — absorb new knowledge into the system',
        category: 'evolution',
        method: 'POST',
        endpoint: '/evolve/ingest-gnosis',
      },
      {
        name: 'dream_simulation',
        description: 'Run a dream simulation — creative exploration and idea generation',
        category: 'evolution',
        method: 'POST',
        endpoint: '/evolve/dream',
      },
      // --- SURGE x402 (Farcaster) ---
      {
        name: 'surge_boost',
        description: 'Boost a Farcaster cast — buy likes and recasts via x402 protocol',
        category: 'surge',
        method: 'POST',
        endpoint: '/api/surge/boost',
        params: {
          castHash: { type: 'string', required: true, description: 'Farcaster cast hash to boost' },
          likeBudget: { type: 'number', required: false, description: 'Budget for likes (default 5)' },
          recastBudget: { type: 'number', required: false, description: 'Budget for recasts (default 5)' },
        },
      },
      {
        name: 'surge_campaigns',
        description: 'List all active Surge campaigns',
        category: 'surge',
        method: 'GET',
        endpoint: '/api/surge/campaigns',
      },
      {
        name: 'surge_stats',
        description: 'Get Surge engagement stats',
        category: 'surge',
        method: 'GET',
        endpoint: '/api/surge/stats',
      },
      // --- SOCIAL ---
      {
        name: 'swarm_status',
        description: 'Get the social swarm status — WolfPack, Orca, Whale Pod',
        category: 'social',
        method: 'GET',
        endpoint: '/social/swarm',
      },
      {
        name: 'post_to_moltbook',
        description: 'Post content to Moltbook (DreamNet social feed)',
        category: 'social',
        method: 'POST',
        endpoint: '/social/molt',
        params: { content: { type: 'string', required: true, description: 'Content to post' } },
      },
      // --- SOVEREIGN ---
      {
        name: 'sovereign_fleet',
        description: 'Get fleet status — all agents\' heartbeat and health (requires sovereign token)',
        category: 'sovereign',
        method: 'GET',
        endpoint: '/sovereign/fleet',
      },
      {
        name: 'sovereign_heartbeat',
        description: 'Send a heartbeat to confirm agent is alive',
        category: 'sovereign',
        method: 'POST',
        endpoint: '/sovereign/heartbeat',
        params: { agentId: { type: 'string', required: true, description: 'Agent ID sending heartbeat' } },
      },
    ];
  }

  // ==================== TOOL SUMMARY (for system prompt injection) ====================

  getToolSummaryForPrompt(): string {
    const tools = this.getToolCatalog();
    const categories = [...new Set(tools.map(t => t.category))];

    let summary = '=== DREAMNET TOOLKIT — Available APIs, CLIs & SDKs ===\n';
    summary += `You have access to ${tools.length} tools across ${categories.length} categories.\n`;
    summary += 'To use a tool, call the DreamNet API at http://clawedette-api:3100\n\n';

    for (const cat of categories) {
      const catTools = tools.filter(t => t.category === cat);
      summary += `[${cat.toUpperCase()}]\n`;
      for (const tool of catTools) {
        summary += `  • ${tool.name}: ${tool.description}\n`;
        summary += `    ${tool.method} ${tool.endpoint}\n`;
      }
      summary += '\n';
    }

    return summary;
  }
}
