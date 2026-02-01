/**
 * DreamNet Agent Client
 * TypeScript/JavaScript client for ChatGPT Agent Mode and other integrations
 */
export interface DreamNetAgentOptions {
    apiKey: string;
    baseUrl?: string;
    maxRetries?: number;
    retryBaseDelayMs?: number;
    timeoutMs?: number;
}
export declare class DreamNetAgent {
    private apiKey;
    private baseUrl;
    private maxRetries;
    private retryBaseDelayMs;
    private timeoutMs;
    constructor(options: DreamNetAgentOptions | string);
    private getHeaders;
    private fetchWithTimeout;
    private request;
    private get;
    private post;
    /**
     * Get contextual metadata about DreamNet / this agent.
     * Endpoint: GET /api/chatgpt-agent/context
     */
    getContext(): Promise<any>;
    /**
     * Natural language query interface.
     * Endpoint: POST /api/chatgpt-agent/chat
     * Note: DreamNet uses "message" not "prompt" in the request body
     */
    autonomousQuery(message: string, options?: {
        sessionId?: string;
        vars?: Record<string, unknown>;
        systemPrompt?: string;
    }): Promise<any>;
    /** Check DreamNet system status */
    checkSystemStatus(): Promise<any>;
    /** List Vercel projects linked to DreamNet */
    listVercelProjects(): Promise<any>;
    /** Get specific Vercel project */
    getVercelProject(name: string): Promise<any>;
    /** Analyze cleanup opportunities (e.g., stale projects, unused infra) */
    analyzeCleanupOpportunities(params?: {
        targetDomain?: string;
        dryRun?: boolean;
    }): Promise<any>;
    /** Execute cleanup actions */
    executeCleanup(actions: any[], dryRun?: boolean): Promise<any>;
    /** Auto-analyze and cleanup */
    autoCleanup(targetDomain?: string, dryRun?: boolean): Promise<any>;
    /** Get Shield threats or security events */
    getShieldThreats(params?: {
        limit?: number;
        since?: string;
    }): Promise<any>;
    /** Get Shield Core status */
    getShieldStatus(): Promise<any>;
    /** Query "dreams" (DreamNet's core content model) */
    queryDreams(query?: {
        filter?: Record<string, unknown>;
        text?: string;
        limit?: number;
    }): Promise<any>;
    /** Get specific dream by ID */
    getDream(id: string): Promise<any>;
    /** Get Wolf Pack "opportunities" (e.g., lead/opportunity engine) */
    getWolfPackOpportunities(params?: {
        limit?: number;
        status?: string;
    }): Promise<any>;
    /** Get Wolf Pack status */
    getWolfPackStatus(): Promise<any>;
    /** Get Spider Web threads */
    getSpiderWebThreads(params?: {
        limit?: number;
        kind?: string;
    }): Promise<any>;
    /** Get Dream State status */
    getDreamStateStatus(): Promise<any>;
    /** Validate API key */
    validateApiKey(): Promise<any>;
    /** List API keys */
    listApiKeys(): Promise<any>;
    /** Get system state */
    getSystemState(): Promise<any>;
    /** Get Spider Web status */
    getSpiderWebStatus(): Promise<any>;
    /** Get Shield Core status (system endpoint) */
    getShieldCoreStatus(): Promise<any>;
    /** Get Control Plane status */
    getControlPlaneStatus(): Promise<any>;
}
export default DreamNetAgent;
//# sourceMappingURL=dreamnet-agent.d.ts.map