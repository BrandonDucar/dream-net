import { agentBus } from './agent-bus.js';

export interface ResourceShell {
    id: string;
    capacity: number; // e.g., TFLOPs or RAM
    occupantId: string | null;
}

/**
 * ResourceManager
 * Implements "Hermit Crab Vacancy Chains".
 * When a high-capacity "Shell" (Resource) becomes available, 
 * agents move up the chain to fill the vacancy.
 */
export class ResourceManager {
    private shells: ResourceShell[] = [
        { id: 'shell:colossal', capacity: 100, occupantId: null },
        { id: 'shell:large', capacity: 50, occupantId: null },
        { id: 'shell:medium', capacity: 20, occupantId: null },
        { id: 'shell:small', capacity: 10, occupantId: null }
    ];

    /**
     * Trigger a Vacancy Chain move.
     */
    public async handleVacancy(vacatedShellId: string): Promise<void> {
        console.log(`🦀 [Pan-Crab] Vacancy Chain triggered by ${vacatedShellId}`);

        const index = this.shells.findIndex(s => s.id === vacatedShellId);
        if (index === -1) return;

        // Reset the vacated shell
        this.shells[index].occupantId = null;

        // Find agents in smaller shells to move up (Sequential Allocation)
        for (let i = index + 1; i < this.shells.length; i++) {
            const currentShell = this.shells[i];
            if (currentShell.occupantId) {
                const agentToMove = currentShell.occupantId;
                console.log(`🦀 [Pan-Crab] Agent ${agentToMove} moving from ${currentShell.id} to ${vacatedShellId}`);

                // Execute move
                this.shells[index].occupantId = agentToMove;
                currentShell.occupantId = null;

                // Recursive call for the new vacancy
                await this.handleVacancy(currentShell.id);
                break;
            }
        }

        agentBus.broadcast('VACANCY_CHAIN_UPDATE', `Shell ${vacatedShellId} re-occupied.`, { shells: this.shells });
    }

    public occupyShell(shellId: string, agentId: string) {
        const shell = this.shells.find(s => s.id === shellId);
        if (shell) shell.occupantId = agentId;
    }
}

export const resourceManager = new ResourceManager();
