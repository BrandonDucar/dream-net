/**
 * 📓 Notion Agent Client
 * Connects DreamNet agents to Notion.
 * Used for state management, task tracking, and "Five Agents" sync.
 */
export declare class NotionAgentClient {
    private apiKey;
    private version;
    constructor(apiKey?: string);
    private get headers();
    getDatabase(databaseId: string): Promise<any>;
    createPage(parentDatabaseId: string, properties: any): Promise<any>;
    getPage(pageId: string): Promise<any>;
    updatePage(pageId: string, properties: any): Promise<any>;
    appendBlock(blockId: string, children: any[]): Promise<any>;
}
export declare const notionClient: NotionAgentClient;
//# sourceMappingURL=NotionAgentClient.d.ts.map