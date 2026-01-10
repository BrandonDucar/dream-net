export interface MCPSessionContext {
    sessionId: string;
    providerName: string;
    createdAt: number;
    metadata?: Record<string, unknown>;
}
