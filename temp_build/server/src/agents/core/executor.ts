import { agentRegistry } from './registry';
import { AgentId, AgentInvocationContext, AgentResult } from './types';

export async function runAgent<TInput, TOutput>(
    agentId: AgentId,
    input: TInput,
    ctx?: Partial<AgentInvocationContext>
): Promise<AgentResult<TOutput>> {
    const startTime = Date.now();
    const logs: string[] = [];

    try {
        // Lookup agent via registry
        const agent = agentRegistry.getAgent(agentId);
        if (!agent) {
            return {
                success: false,
                error: `Agent not found: ${agentId}`,
                executionTimeMs: Date.now() - startTime
            };
        }

        // Build full context
        const fullContext: AgentInvocationContext = {
            requestId: ctx?.requestId || Date.now().toString(),
            timestamp: ctx?.timestamp || new Date().toISOString(),
            ...ctx
        };

        logs.push(`Executing agent: ${agentId}`);

        // Call agent.run(input, ctx)
        const result = await agent.run(input, fullContext);

        const executionTimeMs = Date.now() - startTime;
        logs.push(`Completed in ${executionTimeMs}ms`);

        return {
            success: true,
            data: result as TOutput,
            logs,
            executionTimeMs
        };
    } catch (error) {
        const executionTimeMs = Date.now() - startTime;

        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
            logs,
            executionTimeMs
        };
    }
}
