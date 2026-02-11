/**
 * 🧠 OrganismNamingService: Identity Binding
 * Role: Fosters "Identity Binding" by requiring users to name agents/nodes.
 * Logic: Every component interaction must be preceded by a naming event.
 */
export class OrganismNamingService {
    private registry: Map<string, string> = new Map();

    /**
     * Registers a new name for an agent or node.
     */
    async registerName(id: string, name: string, creatorId: string) {
        // In a real implementation, this would store in Qdrant/Postgres
        this.registry.set(id, name);

        console.log(`[IDENTITY] Component ${id} has been named "${name}" by ${creatorId}.`);

        return {
            id,
            name,
            timestamp: new Date().toISOString(),
            status: 'BOUND'
        };
    }

    /**
     * Resolves an ID to its given name.
     */
    getName(id: string): string {
        return this.registry.get(id) || `UNNAMED_ORGAN_${id.slice(0, 4)}`;
    }

    /**
     * Generates a "Binding Prompt" for unnamed components.
     */
    generateBindingPrompt(id: string, type: 'AGENT' | 'NODE') {
        return {
            message: `A new ${type} has emerged from the Cathedral. It lacks an identity.`,
            prompt: `What name will you bestow upon this ${type}?`,
            componentId: id
        };
    }
}
