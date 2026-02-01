/**
 * 🩸 ParagraphConnector: The Endocrine Interface
 *
 * Role: Communicates with Paragraph.xyz for Sovereign Publishing.
 */
export interface ParagraphPost {
    title: string;
    markdown: string;
    slug?: string;
    published?: boolean;
}
export declare class ParagraphConnector {
    private apiKey;
    constructor();
    /**
     * Secrete a new post into the Paragraph Gland.
     */
    createPost(post: ParagraphPost): Promise<any>;
    /**
     * Get the current vigor (Writer Coin stats) of the publication.
     */
    getVigor(): Promise<any>;
}
export declare const paragraphConnector: ParagraphConnector;
//# sourceMappingURL=ParagraphConnector.d.ts.map