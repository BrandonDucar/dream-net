import { miniAppRegistry } from './miniApps.js';
import { runAgent } from '../agents/core/executor.js';
import { AgentInvocationContext, AgentResult } from '../agents/core/types.js';
import { MiniApp } from './types.js';

export class DreamHub {
    static list(): MiniApp[] {
        return miniAppRegistry.listMiniApps();
    }

    static async run<TInput, TOutput>(
        miniAppId: string,
        input: TInput,
        ctx?: Partial<AgentInvocationContext>
    ): Promise<AgentResult<TOutput>> {
        const miniApp = miniAppRegistry.getMiniApp(miniAppId);

        if (!miniApp) {
            return {
                success: false,
                error: `Mini app not found: ${miniAppId}`
            };
        }

        if (!miniApp.agentId) {
            return {
                success: false,
                error: `Mini app ${miniAppId} has no associated agent`
            };
        }

        // Run the agent associated with this mini app
        return runAgent<TInput, TOutput>(miniApp.agentId, input, ctx);
    }
}
