/**
 * DreamNet Agent Client
 * TypeScript/JavaScript client for ChatGPT Agent Mode and other integrations
 */

const DEFAULT_BASE_URL = "https://dreamnet.ink";

export interface DreamNetAgentOptions {
  apiKey: string;
  baseUrl?: string;
  maxRetries?: number;
  retryBaseDelayMs?: number;
  timeoutMs?: number;
}

export class DreamNetAgent {
  private apiKey: string;
  private baseUrl: string;
  private maxRetries: number;
  private retryBaseDelayMs: number;
  private timeoutMs: number;

  constructor(options: DreamNetAgentOptions | string) {
    if (typeof options === "string") {
      this.apiKey = options;
      this.baseUrl = DEFAULT_BASE_URL;
      this.maxRetries = 3;
      this.retryBaseDelayMs = 300;
      this.timeoutMs = 30_000;
    } else {
      this.apiKey = options.apiKey;
      this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
      this.maxRetries = options.maxRetries ?? 3;
      this.retryBaseDelayMs = options.retryBaseDelayMs ?? 300;
      this.timeoutMs = options.timeoutMs ?? 30_000;
    }
  }

  // ------------ Low-level helpers ------------

  private getHeaders(extra?: Record<string, string>): HeadersInit {
    return {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      ...(extra ?? {}),
    };
  }

  private async fetchWithTimeout(
    url: string,
    init: RequestInit
  ): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }

  private async request<T = unknown>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    let attempt = 0;

    while (true) {
      try {
        const res = await this.fetchWithTimeout(url, {
          method,
          headers: this.getHeaders(),
          body: body != null ? JSON.stringify(body) : undefined,
        });

        if (res.status === 429 || res.status >= 500) {
          // Retry with exponential backoff
          if (attempt < this.maxRetries) {
            const delayMs =
              this.retryBaseDelayMs * Math.pow(2, attempt) +
              Math.random() * 100;
            await new Promise((r) => setTimeout(r, delayMs));
            attempt++;
            continue;
          }
        }

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(
            `DreamNet request failed ${res.status} ${res.statusText}: ${text}`
          );
        }

        // Validate JSON response
        const text = await res.text();
        if (!text) return undefined as T;

        try {
          return JSON.parse(text) as T;
        } catch (e) {
          throw new Error(
            `DreamNet response was not valid JSON for ${method} ${path}: ${String(
              e
            )}`
          );
        }
      } catch (err: any) {
        // Only retry network/timeouts
        const isAbortError =
          err?.name === "AbortError" || /aborted/i.test(String(err?.message));

        if (attempt < this.maxRetries && (isAbortError || /network/i.test(String(err)))) {
          const delayMs =
            this.retryBaseDelayMs * Math.pow(2, attempt) +
            Math.random() * 100;
          await new Promise((r) => setTimeout(r, delayMs));
          attempt++;
          continue;
        }

        throw err;
      }
    }
  }

  private get<T = unknown>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  private post<T = unknown>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  // ------------ Natural language interface ------------

  /**
   * Get contextual metadata about DreamNet / this agent.
   * Endpoint: GET /api/chatgpt-agent/context
   */
  async getContext(): Promise<any> {
    return this.get("/api/chatgpt-agent/context");
  }

  /**
   * Natural language query interface.
   * Endpoint: POST /api/chatgpt-agent/chat
   * Note: DreamNet uses "message" not "prompt" in the request body
   */
  async autonomousQuery(
    message: string,
    options?: {
      sessionId?: string;
      vars?: Record<string, unknown>;
      systemPrompt?: string;
    }
  ): Promise<any> {
    const body: any = {
      message, // DreamNet uses "message" not "prompt"
    };

    if (options?.sessionId) {
      body.sessionId = options.sessionId;
    }
    if (options?.vars) {
      body.vars = options.vars;
    }
    if (options?.systemPrompt) {
      body.systemPrompt = options.systemPrompt;
    }

    return this.post("/api/chatgpt-agent/chat", body);
  }

  // ------------ Common operations (mapped to actual DreamNet endpoints) ------------

  /** Check DreamNet system status */
  async checkSystemStatus(): Promise<any> {
    return this.get("/api/heartbeat"); // Actual endpoint
  }

  /** List Vercel projects linked to DreamNet */
  async listVercelProjects(): Promise<any> {
    return this.get("/api/vercel/projects");
  }

  /** Get specific Vercel project */
  async getVercelProject(name: string): Promise<any> {
    return this.get(`/api/vercel/project/${encodeURIComponent(name)}`);
  }

  /** Analyze cleanup opportunities (e.g., stale projects, unused infra) */
  async analyzeCleanupOpportunities(params?: {
    targetDomain?: string;
    dryRun?: boolean;
  }): Promise<any> {
    // DreamNet uses GET with query params, not POST
    const query = new URLSearchParams();
    if (params?.targetDomain) {
      query.set("targetDomain", params.targetDomain);
    }
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return this.get(`/api/vercel/analyze${suffix}`);
  }

  /** Execute cleanup actions */
  async executeCleanup(actions: any[], dryRun: boolean = true): Promise<any> {
    return this.post("/api/vercel/cleanup", { actions, dryRun });
  }

  /** Auto-analyze and cleanup */
  async autoCleanup(targetDomain?: string, dryRun: boolean = true): Promise<any> {
    return this.post("/api/vercel/cleanup/auto", { targetDomain, dryRun });
  }

  /** Get Shield threats or security events */
  async getShieldThreats(params?: {
    limit?: number;
    since?: string;
  }): Promise<any> {
    const query = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    const suffix = query ? `?${query}` : "";
    return this.get(`/api/shield/threats${suffix}`);
  }

  /** Get Shield Core status */
  async getShieldStatus(): Promise<any> {
    return this.get("/api/shield/status");
  }

  /** Query "dreams" (DreamNet's core content model) */
  async queryDreams(query?: {
    filter?: Record<string, unknown>;
    text?: string;
    limit?: number;
  }): Promise<any> {
    // DreamNet uses GET /api/dreams with query params, or POST with body
    if (query && Object.keys(query).length > 0) {
      const queryParams = new URLSearchParams();
      if (query.text) queryParams.set("text", query.text);
      if (query.limit) queryParams.set("limit", String(query.limit));
      const suffix = queryParams.toString() ? `?${queryParams.toString()}` : "";
      return this.get(`/api/dreams${suffix}`);
    }
    return this.get("/api/dreams");
  }

  /** Get specific dream by ID */
  async getDream(id: string): Promise<any> {
    return this.get(`/api/dreams/${id}`);
  }

  /** Get Wolf Pack "opportunities" (e.g., lead/opportunity engine) */
  async getWolfPackOpportunities(params?: {
    limit?: number;
    status?: string;
  }): Promise<any> {
    const query = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    const suffix = query ? `?${query}` : "";
    return this.get(`/api/wolf-pack/opportunities${suffix}`);
  }

  /** Get Wolf Pack status */
  async getWolfPackStatus(): Promise<any> {
    return this.get("/api/wolf-pack/status");
  }

  /** Get Spider Web threads */
  async getSpiderWebThreads(params?: {
    limit?: number;
    kind?: string;
  }): Promise<any> {
    const query = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    const suffix = query ? `?${query}` : "";
    return this.get(`/api/spider-web/threads${suffix}`);
  }

  /** Get Dream State status */
  async getDreamStateStatus(): Promise<any> {
    return this.get("/api/dream-state/status");
  }

  /** Validate API key */
  async validateApiKey(): Promise<any> {
    return this.get("/api/keys/validate");
  }

  /** List API keys */
  async listApiKeys(): Promise<any> {
    return this.get("/api/keys");
  }

  /** Get system state */
  async getSystemState(): Promise<any> {
    return this.get("/api/system/state");
  }

  /** Get Spider Web status */
  async getSpiderWebStatus(): Promise<any> {
    return this.get("/api/system/spider");
  }

  /** Get Shield Core status (system endpoint) */
  async getShieldCoreStatus(): Promise<any> {
    return this.get("/api/system/shields");
  }

  /** Get Control Plane status */
  async getControlPlaneStatus(): Promise<any> {
    return this.get("/api/system/control");
  }
}

export default DreamNetAgent;






