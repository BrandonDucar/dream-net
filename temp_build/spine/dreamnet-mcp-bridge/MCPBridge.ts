import { MCPProviderDescriptor } from './MCPProviderDescriptor';
import { MCPSessionContext } from './MCPSessionContext';
import { MCPTools } from './MCPTools';

export class MCPBridge {
    private providers: Map<string, MCPProviderDescriptor> = new Map();
    private sessions: Map<string, MCPSessionContext> = new Map();
    private toolRegistry: MCPTools = new MCPTools();

    public registerProvider(provider: MCPProviderDescriptor): void {
        this.providers.set(provider.name, provider);

        // Register all tools from this provider
        for (const tool of provider.tools) {
            this.toolRegistry.registerTool(provider.name, tool);
        }
    }

    public createSession(providerName: string): MCPSessionContext {
        const session: MCPSessionContext = {
            sessionId: crypto.randomUUID(),
            providerName,
            createdAt: Date.now(),
        };
        this.sessions.set(session.sessionId, session);
        return session;
    }

    public getSession(sessionId: string): MCPSessionContext | undefined {
        return this.sessions.get(sessionId);
    }

    public getToolRegistry(): MCPTools {
        return this.toolRegistry;
    }
}
