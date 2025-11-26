/**
 * Cursor Integration
 *
 * Emit Dev Briefs to Cursor
 * Provide Context Packs from DreamMemory
 * Listen for PR labels (ready-for-deploy)
 */
export interface CursorTask {
    id: string;
    title: string;
    description: string;
    contextPack?: string;
    labels?: string[];
    status: "pending" | "in-progress" | "completed";
}
export declare class CursorIntegration {
    private tasks;
    /**
     * Send Dev Brief to Cursor
     */
    sendDevBrief(brief: {
        title: string;
        description: string;
        contextPack?: string;
    }): Promise<CursorTask>;
    /**
     * Get context pack for Cursor
     */
    getContextPack(packId: string): Promise<any>;
    /**
     * Check if PR is ready for deploy
     */
    checkPRReady(prNumber: number): Promise<boolean>;
    /**
     * Get task by ID
     */
    getTask(id: string): CursorTask | undefined;
}
export default CursorIntegration;
