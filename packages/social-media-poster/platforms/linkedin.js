/**
 * LinkedIn API Integration
 *
 * Uses LinkedIn API v2 for posting
 * Docs: https://docs.microsoft.com/en-us/linkedin/
 *
 * Requirements:
 * - LinkedIn Developer App
 * - OAuth 2.0 authentication
 * - Content creation permissions
 */
import axios from "axios";
export class LinkedInPoster {
    config;
    baseUrl = "https://api.linkedin.com/v2";
    constructor(config) {
        this.config = config;
    }
    /**
     * Post to LinkedIn (text only)
     */
    async post(content) {
        try {
            // Get person URN if not provided
            let personUrn = this.config.personUrn;
            if (!personUrn) {
                const profileResponse = await axios.get(`${this.baseUrl}/me`, {
                    headers: {
                        "Authorization": `Bearer ${this.config.accessToken}`,
                    },
                });
                personUrn = `urn:li:person:${profileResponse.data.id}`;
            }
            // Create post
            const response = await axios.post(`${this.baseUrl}/ugcPosts`, {
                author: personUrn,
                lifecycleState: "PUBLISHED",
                specificContent: {
                    "com.linkedin.ugc.ShareContent": {
                        shareCommentary: {
                            text: content,
                        },
                        shareMediaCategory: "NONE",
                    },
                },
                visibility: {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
                },
            }, {
                headers: {
                    "Authorization": `Bearer ${this.config.accessToken}`,
                    "Content-Type": "application/json",
                    "X-Restli-Protocol-Version": "2.0.0",
                },
            });
            return {
                success: true,
                postId: response.data.id,
                permalink: `https://www.linkedin.com/feed/update/${response.data.id}`,
            };
        }
        catch (error) {
            console.error("[LinkedIn] Post failed:", error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message || "Failed to post to LinkedIn",
            };
        }
    }
    /**
     * Post with image
     */
    async postWithImage(content, imageUrl) {
        try {
            // Step 1: Upload image
            // LinkedIn requires registering the image first
            // This is simplified - full implementation needs image upload flow
            // For now, post text with image URL (LinkedIn may not support this directly)
            return await this.post(`${content}\n\n${imageUrl}`);
        }
        catch (error) {
            console.error("[LinkedIn] Image post failed:", error);
            return {
                success: false,
                error: error.message || "Failed to post image to LinkedIn",
            };
        }
    }
}
