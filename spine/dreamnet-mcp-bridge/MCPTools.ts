export class MCPTools {
    private tools: Map<string, Set<string>> = new Map();

    public registerTool(providerName: string, toolName: string): void {
        if (!this.tools.has(providerName)) {
            this.tools.set(providerName, new Set());
        }
        this.tools.get(providerName)!.add(toolName);
    }

    public listTools(providerName?: string): { providerName: string; toolName: string }[] {
        const result: { providerName: string; toolName: string }[] = [];

        if (providerName) {
            const tools = this.tools.get(providerName);
            if (tools) {
                for (const toolName of tools) {
                    result.push({ providerName, toolName });
                }
            }
        } else {
            for (const [pName, tools] of this.tools.entries()) {
                for (const toolName of tools) {
                    result.push({ providerName: pName, toolName });
                }
            }
        }

        return result;
    }
}
