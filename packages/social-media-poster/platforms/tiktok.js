/**
 * TikTok Content Posting API Integration
 *
 * Uses TikTok Content Posting API
 * Docs: https://developers.tiktok.com/doc/content-posting-api-get-started/
 *
 * Requirements:
 * - TikTok Developer Account
 * - TikTok App with Content Posting API access
 * - OAuth 2.0 authentication
 */
import axios from "axios";
export class TikTokPoster {
    config;
    baseUrl = "https://open.tiktokapis.com/v2";
    constructor(config) {
        this.config = config;
    }
    /**
     * Post a video to TikTok
     */
    async postVideo(videoUrl, caption, privacyLevel = "PUBLIC_TO_EVERYONE") {
        try {
            // Step 1: Initialize upload
            const initResponse = await axios.post(`${this.baseUrl}/post/publish/video/init/`, {
                post_info: {
                    title: caption,
                    privacy_level: privacyLevel,
                    disable_duet: false,
                    disable_comment: false,
                    disable_stitch: false,
                    video_cover_timestamp_ms: 1000,
                },
                source_info: {
                    source: "FILE_UPLOAD",
                    video_size: 0, // Will be set after upload
                    chunk_size: 10000000, // 10MB chunks
                    total_chunk_count: 1,
                },
            }, {
                headers: {
                    "Authorization": `Bearer ${this.config.accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            const uploadUrl = initResponse.data.data.upload_url;
            const publishId = initResponse.data.data.publish_id;
            // Step 2: Upload video file
            // Note: In production, you'd download the video from videoUrl and upload it
            // For now, this is a placeholder - actual implementation needs file handling
            console.log("[TikTok] Video upload URL:", uploadUrl);
            console.log("[TikTok] Publish ID:", publishId);
            // Step 3: Upload video chunks (simplified - needs actual file upload)
            // This would require downloading the video, chunking it, and uploading
            // Step 4: Finalize upload
            const finalizeResponse = await axios.post(`${this.baseUrl}/post/publish/status/fetch/`, {
                publish_id: publishId,
            }, {
                headers: {
                    "Authorization": `Bearer ${this.config.accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            return {
                success: true,
                publishId,
            };
        }
        catch (error) {
            console.error("[TikTok] Post failed:", error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.error?.message || error.message || "Failed to post to TikTok",
            };
        }
    }
    /**
     * Check upload status
     */
    async checkStatus(publishId) {
        try {
            const response = await axios.post(`${this.baseUrl}/post/publish/status/fetch/`, {
                publish_id: publishId,
            }, {
                headers: {
                    "Authorization": `Bearer ${this.config.accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            return {
                status: response.data.data.status,
            };
        }
        catch (error) {
            return {
                status: "FAILED",
                error: error.response?.data?.error?.message || error.message,
            };
        }
    }
}
