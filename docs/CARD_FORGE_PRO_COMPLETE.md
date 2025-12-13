# Card Forge Pro - Complete Documentation

**Package**: `@dreamnet/card-forge-pro`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Card Forge Pro integrates **ChatGPT GPT "Card Forge Pro"** for automated card creation. It enables DreamNet to generate professional cards (business, trading, digital, NFT, custom) using OpenAI's GPT-4 with function calling capabilities.

### Key Features

- **Multiple Card Types**: Business, trading, digital, NFT, and custom cards
- **Design Customization**: Style, color scheme, and layout options
- **Content Management**: Name, subtitle, contact info, images, logos, QR codes
- **OpenAI Integration**: Uses GPT-4 with function calling for card generation
- **Metadata Support**: Tags and categories for organization

---

## Architecture

### How It Works

```
Card Request → CardForgePro → OpenAI GPT-4 → Card Creation Function → Card Result
```

1. **Request Processing**: Formats card creation request with specifications
2. **GPT-4 Call**: Sends request to OpenAI GPT-4 with function calling
3. **Function Execution**: GPT-4 calls `create_card` function with card details
4. **Result Parsing**: Extracts card URLs, images, and metadata from response
5. **Fallback Handling**: Parses text response if function calling not used

### Why This Design

- **AI-Powered**: Leverages GPT-4's design capabilities
- **Flexible**: Supports multiple card types and customization options
- **Function Calling**: Uses OpenAI's function calling for structured responses
- **Fallback**: Handles both function calls and text responses

---

## API Reference

### Types

```typescript
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
```

### Classes

#### `CardForgePro`

Main class for card creation operations.

**Constructor**:
```typescript
constructor(gptId?: string)
```

**Environment Variables**:
- `OPENAI_API_KEY`: OpenAI API key (required)
- `CARD_FORGE_PRO_GPT_ID`: GPT ID (default: `g-691e87a571708191aad55627a0b616ef`)

**Methods**:

- **`createCard(request: CardCreationRequest): Promise<CardCreationResult>`**
  - Create a card using Card Forge Pro GPT
  - Returns card details including URLs and metadata

- **`updateCard(cardId: string, updates: Partial<CardCreationRequest>): Promise<CardCreationResult>`**
  - Update an existing card (placeholder implementation)

- **`deleteCard(cardId: string): Promise<{ success: boolean; error?: string }>`**
  - Delete a card (placeholder implementation)

- **`listCards(): Promise<CardCreationResult[]>`**
  - List all cards (placeholder implementation)

### Singleton Export

```typescript
export const cardForgePro = new CardForgePro();
```

---

## Integration Points

### Consumes

- **OpenAI API**: GPT-4 model for card generation
- **Environment Variables**: `OPENAI_API_KEY`, `CARD_FORGE_PRO_GPT_ID`

### Produces

- **Card Images**: Generated card images with URLs
- **Card Metadata**: Card details and metadata

---

## Usage Examples

### Create Business Card

```typescript
import { cardForgePro } from "@dreamnet/card-forge-pro";

const result = await cardForgePro.createCard({
  cardType: "business",
  title: "John Doe",
  description: "Software Engineer at DreamNet",
  design: {
    style: "modern",
    colorScheme: "blue",
    layout: "horizontal"
  },
  content: {
    name: "John Doe",
    subtitle: "Software Engineer",
    contactInfo: {
      email: "john@dreamnet.ink",
      phone: "+1-555-0123",
      website: "https://dreamnet.ink",
      social: {
        twitter: "@johndoe",
        linkedin: "john-doe"
      }
    },
    logoUrl: "https://example.com/logo.png"
  },
  metadata: {
    tags: ["business", "professional"],
    category: "contact"
  }
});

if (result.success) {
  console.log("Card created:", result.cardId);
  console.log("Card URL:", result.cardUrl);
  console.log("Image URL:", result.imageUrl);
}
```

### Create NFT Card

```typescript
const result = await cardForgePro.createCard({
  cardType: "nft",
  description: "DreamNet Genesis NFT",
  content: {
    name: "DreamNet Genesis",
    imageUrl: "https://example.com/nft-image.png",
    qrCode: "https://opensea.io/collection/dreamnet"
  },
  metadata: {
    tags: ["nft", "genesis"],
    category: "collectible"
  }
});
```

### Create Trading Card

```typescript
const result = await cardForgePro.createCard({
  cardType: "trading",
  description: "DreamNet Token Trading Card",
  content: {
    name: "DREAM Token",
    subtitle: "DreamNet Ecosystem Token",
    imageUrl: "https://example.com/token-logo.png"
  }
});
```

---

## Best Practices

1. **API Key**: Set `OPENAI_API_KEY` environment variable
2. **Descriptions**: Provide detailed descriptions for better card generation
3. **Design Specs**: Specify style, color scheme, and layout preferences
4. **Content**: Include all relevant content (name, contact info, images)
5. **Error Handling**: Always check `result.success` and handle errors
6. **Metadata**: Use tags and categories for organization

---

## Security Considerations

- **API Keys**: Store OpenAI API keys securely in environment variables
- **Rate Limiting**: Be aware of OpenAI API rate limits
- **Cost Management**: Monitor token usage and costs
- **Input Validation**: Validate all inputs before card creation

---

## Related Systems

- **OpenAI**: GPT-4 model provider
- **Media Vault**: Store generated card images
- **Dream Vault**: Store card metadata

---

**Status**: ✅ Implemented  
**Next**: Implement update/delete/list operations with Card Forge Pro API

