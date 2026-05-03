/**
 * 🎨 Figma Agent Client
 * Provides specialized access to Figma files, components, and design systems.
 */
export declare class FigmaAgentClient {
    private personalAccessToken;
    private baseUrl;
    constructor(token?: string);
    private get headers();
    /**
     * Fetch metadata for a Figma file
     */
    getFile(fileId: string): Promise<any>;
    /**
     * Get image URL for a specific node in a file
     */
    getImage(fileId: string, nodeId: string, format?: 'png' | 'jpg' | 'svg' | 'pdf'): Promise<any>;
    /**
     * Post a comment to a Figma file
     */
    postComment(fileId: string, message: string, client_meta?: any): Promise<any>;
    /**
     * Fetch comments from a file
     */
    getComments(fileId: string): Promise<any>;
}
export declare const figmaClient: FigmaAgentClient;
//# sourceMappingURL=FigmaAgentClient.d.ts.map