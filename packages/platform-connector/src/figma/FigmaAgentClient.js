import axios from 'axios';
/**
 * 🎨 Figma Agent Client
 * Provides specialized access to Figma files, components, and design systems.
 */
export class FigmaAgentClient {
    personalAccessToken;
    baseUrl = 'https://api.figma.com/v1';
    constructor(token) {
        this.personalAccessToken = token || process.env.FIGMA_ACCESS_TOKEN || '';
        if (!this.personalAccessToken) {
            console.warn('⚠️ [FigmaAgentClient] No access token provided. Figma tools will fail.');
        }
    }
    get headers() {
        return {
            'X-Figma-Token': this.personalAccessToken
        };
    }
    /**
     * Fetch metadata for a Figma file
     */
    async getFile(fileId) {
        try {
            const response = await axios.get(`${this.baseUrl}/files/${fileId}`, { headers: this.headers });
            return response.data;
        }
        catch (error) {
            console.error(`❌ [FigmaAgentClient] Failed to fetch file ${fileId}:`, error);
            throw error;
        }
    }
    /**
     * Get image URL for a specific node in a file
     */
    async getImage(fileId, nodeId, format = 'png') {
        try {
            const response = await axios.get(`${this.baseUrl}/images/${fileId}?ids=${nodeId}&format=${format}`, {
                headers: this.headers
            });
            return response.data.images[nodeId];
        }
        catch (error) {
            console.error(`❌ [FigmaAgentClient] Failed to get image for node ${nodeId}:`, error);
            throw error;
        }
    }
    /**
     * Post a comment to a Figma file
     */
    async postComment(fileId, message, client_meta) {
        try {
            const response = await axios.post(`${this.baseUrl}/files/${fileId}/comments`, {
                message,
                client_meta
            }, { headers: this.headers });
            return response.data;
        }
        catch (error) {
            console.error(`❌ [FigmaAgentClient] Failed to post comment to ${fileId}:`, error);
            throw error;
        }
    }
    /**
     * Fetch comments from a file
     */
    async getComments(fileId) {
        try {
            const response = await axios.get(`${this.baseUrl}/files/${fileId}/comments`, { headers: this.headers });
            return response.data.comments;
        }
        catch (error) {
            console.error(`❌ [FigmaAgentClient] Failed to fetch comments for ${fileId}:`, error);
            throw error;
        }
    }
}
export const figmaClient = new FigmaAgentClient();
//# sourceMappingURL=FigmaAgentClient.js.map