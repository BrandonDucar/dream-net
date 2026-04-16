/**
 * @dreamnet/runtime-bridge-core — Runtime Bridge Core
 * 
 * Low-level runtime bridge that handles process lifecycle,
 * signal forwarding, and container-to-bridge connectivity.
 * 
 * Used by all organ packages to connect to the Sovereign Bridge.
 * This is the foundation layer — other bridges import from here.
 */

const BRIDGE_URL = process.env.BRIDGE_URL || process.env.CLAWEDETTE_API_URL || 'http://clawedette-api:3100';

export interface BridgeConfig {
  agentId: string;
  name: string;
  type: 'clawdbot' | 'replit' | 'docker' | 'external' | 'sidecar';
  version: string;
  capabilities: string[];
  endpoint?: string;
  metadata?: Record<string, any>;
}

export class RuntimeBridge {
  private config: BridgeConfig;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private pollTimer: NodeJS.Timeout | null = null;
  private registered = false;

  constructor(config: BridgeConfig) {
    this.config = config;
  }

  private async post(path: string, body: any): Promise<any> {
    const res = await fetch(`${BRIDGE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  private async get(path: string): Promise<any> {
    const res = await fetch(`${BRIDGE_URL}${path}`);
    return res.json();
  }

  async connect(): Promise<boolean> {
    try {
      const result = await this.post('/bridge/register', {
        agentId: this.config.agentId,
        name: this.config.name,
        type: this.config.type,
        version: this.config.version,
        capabilities: this.config.capabilities,
        endpoint: this.config.endpoint,
        metadata: this.config.metadata,
      });
      this.registered = true;
      console.log(`[RuntimeBridge] ${this.config.name} connected to Sovereign Bridge`);
      return true;
    } catch (err: any) {
      console.error(`[RuntimeBridge] Connection failed: ${err.message}`);
      return false;
    }
  }

  async connectWithRetry(maxRetries = 30, intervalMs = 10_000): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      if (await this.connect()) return true;
      console.log(`[RuntimeBridge] Retry ${i + 1}/${maxRetries}...`);
      await new Promise(r => setTimeout(r, intervalMs));
    }
    return false;
  }

  startHeartbeat(intervalMs = 30_000): void {
    this.heartbeatTimer = setInterval(async () => {
      try {
        await this.post('/bridge/heartbeat', {
          agentId: this.config.agentId,
          status: 'online',
          metadata: { uptime: process.uptime() },
        });
      } catch {}
    }, intervalMs);
  }

  stopHeartbeat(): void {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
  }

  startInboxPoll(intervalMs = 15_000, handler: (msg: any) => void): void {
    this.pollTimer = setInterval(async () => {
      try {
        const { messages, count } = await this.get(`/bridge/inbox/${this.config.agentId}?unread=true`);
        if (count > 0) {
          for (const msg of messages) handler(msg);
          await this.post(`/bridge/inbox/${this.config.agentId}/read`, {});
        }
      } catch {}
    }, intervalMs);
  }

  stopInboxPoll(): void {
    if (this.pollTimer) clearInterval(this.pollTimer);
  }

  async send(to: string, content: string, type = 'message', data?: any, priority = 'normal'): Promise<any> {
    return this.post('/bridge/send', {
      from: this.config.agentId, to, content, type, data, priority,
    });
  }

  async broadcast(content: string, data?: any, priority = 'normal'): Promise<any> {
    return this.post('/bridge/broadcast', {
      from: this.config.agentId, content, data, priority,
    });
  }

  async relay(to: string, content: string, data?: any): Promise<any> {
    return this.post('/bridge/relay', {
      from: this.config.agentId, to, content, data,
    });
  }

  async getAgents(): Promise<any[]> {
    const { agents } = await this.get('/bridge/agents');
    return agents;
  }

  async getInbox(limit = 20): Promise<any[]> {
    const { messages } = await this.get(`/bridge/inbox/${this.config.agentId}?limit=${limit}`);
    return messages;
  }

  async getTasks(status?: string): Promise<any[]> {
    const path = status
      ? `/bridge/tasks/${this.config.agentId}?status=${status}`
      : `/bridge/tasks/${this.config.agentId}`;
    const { tasks } = await this.get(path);
    return tasks;
  }

  async completeTask(taskId: string, result?: any): Promise<any> {
    return this.post(`/bridge/task/${taskId}/complete`, {
      agentId: this.config.agentId, result,
    });
  }

  async getHealth(): Promise<any> {
    return this.get('/bridge/health');
  }

  async getTopology(): Promise<any> {
    return this.get('/bridge/topology');
  }

  disconnect(): void {
    this.stopHeartbeat();
    this.stopInboxPoll();
    this.registered = false;
  }

  get isConnected(): boolean {
    return this.registered;
  }
}

export function createBridge(config: BridgeConfig): RuntimeBridge {
  return new RuntimeBridge(config);
}

export default { RuntimeBridge, createBridge };
