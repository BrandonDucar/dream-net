interface FigmaAgentConfig {
    accessToken: string;
}
/**
 * Figma Agent Client
 *
 * Gives agents "Eyes" to see designs.
 * REST API wrapper for Figma.
 */
export declare class FigmaAgentClient {
    private accessToken;
    private baseUrl;
    constructor(config: FigmaAgentConfig);
    private get headers();
    /**
     * Agent reads a design file
     */
    getFile(fileKey: string): Promise<any>;
    /**
     * Agent reads comments on a design
     */
    getComments(fileKey: string): Promise<any>;
    /**
     * Agent posts feedback
     */
    postComment(fileKey: string, message: string): Promise<any>;
    private emitAction;
}
export declare const figmaAgent: FigmaAgentClient;
export {};
//# sourceMappingURL=FigmaAgentClient.d.ts.map