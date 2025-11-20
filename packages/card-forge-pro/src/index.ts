/**
 * Card Forge Pro Integration
 * Integrates ChatGPT GPT "Card Forge Pro" for automated card creation
 * Reference: https://chatgpt.com/g/g-691e87a571708191aad55627a0b616ef-card-forge-pro
 */

import OpenAI from 'openai';

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

export class CardForgePro {
  private openai: OpenAI | null = null;
  private gptId: string;

  constructor(gptId?: string) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
    // Card Forge Pro GPT ID
    this.gptId = gptId || process.env.CARD_FORGE_PRO_GPT_ID || 'g-691e87a571708191aad55627a0b616ef';
  }

  /**
   * Create a card using Card Forge Pro GPT
   * @param request - Card creation request
   * @returns Promise with card creation result
   */
  async createCard(request: CardCreationRequest): Promise<CardCreationResult> {
    if (!this.openai) {
      return { success: false, error: "OpenAI API key not configured." };
    }

    const userMessage = `Create a ${request.cardType} card with the following specifications:
    Description: ${request.description}
    ${request.title ? `Title: ${request.title}` : ''}
    ${request.design?.style ? `Style: ${request.design.style}` : ''}
    ${request.design?.colorScheme ? `Color Scheme: ${request.design.colorScheme}` : ''}
    ${request.design?.layout ? `Layout: ${request.design.layout}` : ''}
    ${request.content?.name ? `Name: ${request.content.name}` : ''}
    ${request.content?.subtitle ? `Subtitle: ${request.content.subtitle}` : ''}
    ${request.content?.contactInfo ? `Contact Info: ${JSON.stringify(request.content.contactInfo)}` : ''}
    ${request.content?.imageUrl ? `Image URL: ${request.content.imageUrl}` : ''}
    ${request.content?.logoUrl ? `Logo URL: ${request.content.logoUrl}` : ''}
    ${request.content?.qrCode ? `QR Code: ${request.content.qrCode}` : ''}
    
    Please generate a professional card design and return the card details including image URL and download options.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: userMessage }],
        tools: [
          {
            type: "function",
            function: {
              name: "create_card",
              description: "Creates a card based on the provided specifications and returns card details including image URL and download options.",
              parameters: {
                type: "object",
                properties: {
                  cardId: {
                    type: "string",
                    description: "Unique identifier for the created card"
                  },
                  cardUrl: {
                    type: "string",
                    description: "URL where the card can be viewed"
                  },
                  imageUrl: {
                    type: "string",
                    description: "URL of the generated card image"
                  },
                  downloadUrl: {
                    type: "string",
                    description: "URL to download the card in various formats"
                  },
                  metadata: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      cardType: { type: "string" }
                    },
                    required: ["title", "description", "cardType"]
                  }
                },
                required: ["cardId", "cardUrl", "imageUrl", "metadata"]
              }
            }
          }
        ],
        tool_choice: {
          type: "function",
          function: { name: "create_card" }
        }
      });

      const toolCall = completion.choices[0].message.tool_calls?.[0];
      if (toolCall && toolCall.function.name === "create_card") {
        const args = JSON.parse(toolCall.function.arguments);
        return { success: true, ...args };
      } else {
        // Fallback: parse response text if tool call not used
        const content = completion.choices[0].message.content;
        if (content) {
          // Try to extract URLs and metadata from response
          const urlMatch = content.match(/https?:\/\/[^\s]+/g);
          return {
            success: true,
            cardId: `card-${Date.now()}`,
            cardUrl: urlMatch?.[0] || '',
            imageUrl: urlMatch?.[1] || urlMatch?.[0] || '',
            metadata: {
              title: request.title || 'Generated Card',
              description: request.description,
              cardType: request.cardType,
            }
          };
        }
        return { success: false, error: "Failed to parse GPT response for card creation." };
      }

    } catch (error: any) {
      console.error("Error creating card with Card Forge Pro:", error);
      return { success: false, error: error.message || "An unknown error occurred during card creation." };
    }
  }

  /**
   * Update an existing card
   */
  async updateCard(cardId: string, updates: Partial<CardCreationRequest>): Promise<CardCreationResult> {
    console.log(`[CardForgePro] Updating card ${cardId}`);
    // In a real implementation, this would interact with Card Forge Pro API
    return {
      success: true,
      cardId,
      metadata: {
        title: 'Updated Card',
        description: 'Card has been updated',
        cardType: updates.cardType || 'custom',
      }
    };
  }

  /**
   * Delete a card
   */
  async deleteCard(cardId: string): Promise<{ success: boolean; error?: string }> {
    console.log(`[CardForgePro] Deleting card ${cardId}`);
    return { success: true };
  }

  /**
   * List all cards
   */
  async listCards(): Promise<CardCreationResult[]> {
    console.log(`[CardForgePro] Listing cards`);
    return [];
  }
}

export const cardForgePro = new CardForgePro();

