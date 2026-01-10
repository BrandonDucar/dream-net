/**
 * Website AI Designer Integration
 * Integrates ChatGPT GPT "Website AI Designer" for automated website generation
 * Uses Pixl or similar platform for direct website deployment (no Vercel needed)
 */
export interface WebsiteDesignRequest {
    description: string;
    pages?: string[];
    style?: string;
    features?: string[];
    targetAudience?: string;
}
export interface WebsiteDesignResult {
    success: boolean;
    websiteUrl?: string;
    pages?: Array<{
        name: string;
        url: string;
    }>;
    assets?: Array<{
        type: string;
        url: string;
    }>;
    metadata?: {
        title: string;
        description: string;
        keywords?: string[];
    };
    error?: string;
}
export declare class WebsiteAIDesigner {
    private openai;
    private gptId;
    constructor(gptId?: string);
    /**
     * Generate a website using Website AI Designer GPT
     */
    generateWebsite(request: WebsiteDesignRequest): Promise<WebsiteDesignResult>;
    /**
     * Build prompt for website generation
     */
    private buildWebsitePrompt;
    /**
     * Parse GPT response to extract website information
     */
    private parseWebsiteResponse;
    /**
     * Generate website code (HTML/CSS/JS)
     */
    generateWebsiteCode(request: WebsiteDesignRequest): Promise<{
        html: string;
        css: string;
        js: string;
        instructions: string;
    }>;
    private generateHTML;
    private generateCSS;
    private generateJS;
    private generateDeploymentInstructions;
}
export declare function getWebsiteDesigner(): WebsiteAIDesigner;
export default WebsiteAIDesigner;
