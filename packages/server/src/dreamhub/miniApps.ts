import { MiniApp } from './types.js';
import { runAgent } from '../agents/core/executor.js';
import { AgentInvocationContext, AgentResult } from '../agents/core/types.js';

class MiniAppRegistry {
    private miniApps: Map<string, MiniApp> = new Map();

    registerMiniApp(app: MiniApp): void {
        this.miniApps.set(app.id, app);
        console.log(`✅ Registered mini app: ${app.name} (${app.id})`);
    }

    getMiniApp(id: string): MiniApp | undefined {
        return this.miniApps.get(id);
    }

    listMiniApps(): MiniApp[] {
        return Array.from(this.miniApps.values());
    }
}

// Global registry instance
export const miniAppRegistry = new MiniAppRegistry();
