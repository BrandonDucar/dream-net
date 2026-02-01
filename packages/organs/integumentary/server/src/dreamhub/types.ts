export interface MiniApp {
    id: string;
    name: string;
    description: string;
    category: MiniAppCategory;
    inputSchema?: any; // JSON schema for input validation
    agentId?: string; // Optional: which agent this mini app uses
}

export type MiniAppCategory = 'analysis' | 'monitoring' | 'management' | 'utility' | 'defi' | 'social';
