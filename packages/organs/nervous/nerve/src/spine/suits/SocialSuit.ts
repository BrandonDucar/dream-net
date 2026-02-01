
/**
 * 🧥 SocialSuit: The Interface for Digital Biomech Skins
 * 
 * Each suit is a wearable interface that allows an Agent (Pilot)
 * to interact with a specific social protocol (X, TikTok, etc.)
 * utilizing "Real Data" pipes only.
 */

export interface SocialSuit {
    /**
     * The name of the biomech suit (e.g., "X-Power-Suit", "TikTok-Mech")
     */
    name: string;

    /**
     * Checks if the suit is powered and authorized (Validation of Keys)
     */
    isOnline(): boolean;

    /**
     * Attempt to log in or refresh credentials.
     * Throws error if keys are missing (No Mocks).
     */
    ignite(): Promise<void>;

    /**
     * Post content to the feed.
     * @param content Text, Buffer (video/image), or complex object
     */
    post(content: string | Buffer | any): Promise<{ success: boolean; url?: string; id?: string }>;

    /**
     * Engage with existing content (Like, Reply, Retweet)
     */
    engage(targetId: string, action: 'like' | 'reply' | 'repost' | 'comment', content?: string): Promise<boolean>;

    /**
     * Sensory Input: Scan the feed or search for keywords.
     */
    scan(query: string, limit?: number): Promise<any[]>;

    /**
     * ✍️ Motor Function: Edit an existing post.
     * @param id The ID of the post/message to edit.
     * @param content The new content.
     */
    edit(id: string, content: string | any): Promise<boolean>;

    /**
     * 🗑️ Motor Function: Delete a post.
     * @param id The ID of the post/message to delete.
     */
    delete(id: string): Promise<boolean>;

    /**
     * 👆 Motor Function: Interact with a button or UI element.
     * @param interactionId The ID of the interaction event or element.
     * @param action The action to perform (e.g., "click", "submit").
     */
    interact(interactionId: string, action: string): Promise<boolean>;
}
