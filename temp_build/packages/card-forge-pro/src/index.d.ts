/**
 * Card Forge Pro Integration
 * Integrates ChatGPT GPT "Card Forge Pro" for automated card creation
 * Reference: https://chatgpt.com/g/g-691e87a571708191aad55627a0b616ef-card-forge-pro
 */
export interface CardCreationRequest {
    cardType: 'business' | 'trading' | 'digital' | 'nft' | 'custom';
    title?: string;
    description: string;
    design?: {
        style?: string;
        colorScheme?: string;
        layout?: string;
    };
    content?: {
        name?: string;
        subtitle?: string;
        contactInfo?: {
            email?: string;
            phone?: string;
            website?: string;
            social?: Record<string, string>;
        };
        imageUrl?: string;
        logoUrl?: string;
        qrCode?: string;
    };
    metadata?: {
        tags?: string[];
        category?: string;
    };
}
export interface CardCreationResult {
    success: boolean;
    cardId?: string;
    cardUrl?: string;
    imageUrl?: string;
    downloadUrl?: string;
    metadata?: {
        title: string;
        description: string;
        cardType: string;
    };
    error?: string;
}
export declare class CardForgePro {
    private openai;
    private gptId;
    constructor(gptId?: string);
    /**
     * Create a card using Card Forge Pro GPT
     * @param request - Card creation request
     * @returns Promise with card creation result
     */
    createCard(request: CardCreationRequest): Promise<CardCreationResult>;
    /**
     * Update an existing card
     */
    updateCard(cardId: string, updates: Partial<CardCreationRequest>): Promise<CardCreationResult>;
    /**
     * Delete a card
     */
    deleteCard(cardId: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    /**
     * List all cards
     */
    listCards(): Promise<CardCreationResult[]>;
}
export declare const cardForgePro: CardForgePro;
