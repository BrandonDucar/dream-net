# MemeForge Agent - Complete Documentation

**Package**: `agents/MemeForge`  
**Type**: Domain-Specific Agent  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

**MemeForge** is a **meme creation and captioning agent** that creates memes, captions, and platform-optimized content for culturecoins. It specializes in 2-panel memes, caption generation, and platform-specific adaptations.

### Key Features

- **2-Panel Meme Creation**: Generate top/bottom panel meme text
- **Caption Generation**: Create captions in various tones and lengths
- **Platform Variants**: Adapt content for different platforms
- **Style Variations**: Generate multiple style variations

---

## Role & Responsibilities

### Role

MemeForge acts as a **meme creation specialist** for DreamNet's cultural content ecosystem, generating memes and captions optimized for various platforms.

### Responsibilities

1. **Create 2-Panel Memes**: Generate top/bottom panel meme text
2. **Generate Captions**: Create captions in different tones and lengths
3. **Platform Adaptation**: Adapt content for platform-specific constraints
4. **Style Variations**: Generate multiple style variations

---

## API Reference

### Agent Definition

```typescript
export const MemeForgeAgent: Agent = {
  name: "MemeForge",
  description: "Creates memes, captions, and platform-optimized content for culturecoins",
  capabilities: ["create_2panel", "caption", "platform_variants"],
  async run(payload) {
    return runMemeForgeTask(payload);
  },
};
```

### Types

```typescript
export interface MemeForgeTask {
  create_2panel: {
    topic: string;
    style?: "classic" | "edgy" | "wholesome" | "meta";
  };
  caption: {
    topic: string;
    tone?: "funny" | "serious" | "absurd" | "philosophical";
    length?: "short" | "medium" | "long";
  };
  platform_variants: {
    text: string;
    platforms: string[];
  };
}

export interface MemeForgeOutput {
  create_2panel: {
    top: string;
    bottom: string;
    variations: Array<{
      top: string;
      bottom: string;
      style: string;
    }>;
  };
  caption: {
    captions: string[];
    recommended: string;
  };
  platform_variants: {
    [platform: string]: string;
  };
}
```

---

## Tasks

### 1. Create 2-Panel

Generates 2-panel meme text (top and bottom panels).

**Input**:
```typescript
{
  task: "create_2panel",
  data: {
    topic: string;           // Topic for meme
    style?: "classic" | "edgy" | "wholesome" | "meta";  // Meme style (default: "classic")
  }
}
```

**Output**:
```typescript
{
  top: string;              // Top panel text
  bottom: string;          // Bottom panel text
  variations: Array<{      // Style variations
    top: string;
    bottom: string;
    style: string;
  }>;
}
```

**Example**:
```typescript
const result = await MemeForgeAgent.run({
  task: "create_2panel",
  data: {
    topic: "DreamNet",
    style: "classic"
  }
});

// Result:
// {
//   success: true,
//   output: {
//     top: "When you realize DreamNet",
//     bottom: "But it's actually true",
//     variations: [
//       { top: "When you realize DreamNet", bottom: "But it's actually true", style: "classic" },
//       { top: "Society when DreamNet", bottom: "But we keep buying", style: "edgy" },
//       { top: "Finding out that DreamNet", bottom: "And it makes you smile", style: "wholesome" }
//     ]
//   }
// }
```

### 2. Caption

Generates captions for memes or posts.

**Input**:
```typescript
{
  task: "caption",
  data: {
    topic: string;           // Topic for caption
    tone?: "funny" | "serious" | "absurd" | "philosophical";  // Caption tone (default: "funny")
    length?: "short" | "medium" | "long";  // Caption length (default: "medium")
  }
}
```

**Output**:
```typescript
{
  captions: string[];      // Array of generated captions
  recommended: string;     // Recommended caption
}
```

**Example**:
```typescript
const result = await MemeForgeAgent.run({
  task: "caption",
  data: {
    topic: "CultureCoins",
    tone: "funny",
    length: "short"
  }
});

// Result:
// {
//   success: true,
//   output: {
//     captions: [
//       "CultureCoins? More like CultureCoins but make it spicy 🌶️",
//       "CultureCoins? More like CultureCoins but make it spicy 🌶️",
//       "CultureCoins? More like CultureCoins but make it spicy 🌶️"
//     ],
//     recommended: "CultureCoins? More like CultureCoins but make it spicy 🌶️"
//   }
// }
```

### 3. Platform Variants

Adapts text content for different platforms.

**Input**:
```typescript
{
  task: "platform_variants",
  data: {
    text: string;           // Original text
    platforms: string[];    // Target platforms
  }
}
```

**Output**:
```typescript
{
  [platform: string]: string;  // Platform-specific adapted text
}
```

**Platform Constraints**:
- `twitter`: 280 characters
- `farcaster`: 320 characters
- `telegram`: 4096 characters
- `instagram`: 2200 characters
- `tiktok`: 150 characters

**Example**:
```typescript
const result = await MemeForgeAgent.run({
  task: "platform_variants",
  data: {
    text: "DreamNet is revolutionizing culture and community through innovative technology and creative expression.",
    platforms: ["twitter", "farcaster", "tiktok"]
  }
});

// Result:
// {
//   success: true,
//   output: {
//     twitter: "DreamNet is revolutionizing culture and community through innovative technology and creative expression.",
//     farcaster: "DreamNet is revolutionizing culture and community through innovative technology and creative expression.",
//     tiktok: "DreamNet is revolutionizing..."
//   }
// }
```

---

## Implementation Details

### 2-Panel Generation

Uses style-specific templates for top and bottom panels:

```typescript
function generateTopPanel(topic: string, style: string): string {
  const templates: Record<string, string[]> = {
    classic: ["When you realize", "Me explaining", "How I feel when", "When someone says"],
    edgy: ["Society when", "The system", "They expect us to", "Reality check:"],
    wholesome: ["Finding out that", "When you discover", "The moment you realize", "Learning that"],
    meta: ["The algorithm when", "Crypto Twitter after", "When you understand", "Me trying to explain"],
  };
  
  const options = templates[style] || templates.classic;
  const template = options[Math.floor(Math.random() * options.length)];
  return `${template} ${topic}`;
}
```

### Caption Generation

Generates captions based on tone and length:

```typescript
function generateCaptions(topic: string, tone: string, length: string): string[] {
  const captions: string[] = [];
  const count = length === "short" ? 3 : length === "long" ? 5 : 4;
  
  for (let i = 0; i < count; i++) {
    let caption = "";
    
    switch (tone) {
      case "funny":
        caption = `${topic}? More like ${topic} but make it spicy 🌶️`;
        break;
      case "serious":
        caption = `Let's talk about ${topic}. This matters.`;
        break;
      case "absurd":
        caption = `${topic} is just ${topic} wearing a hat. Change my mind.`;
        break;
      case "philosophical":
        caption = `What if ${topic} is actually the question, not the answer?`;
        break;
    }
    
    if (length === "long") {
      caption += ` Here's why: ${topic} represents a fundamental shift...`;
    }
    
    captions.push(caption);
  }
  
  return captions;
}
```

### Platform Adaptation

Adapts text to platform-specific length constraints:

```typescript
function adaptForPlatform(text: string, platform: string): string {
  const maxLengths: Record<string, number> = {
    twitter: 280,
    farcaster: 320,
    telegram: 4096,
    instagram: 2200,
    tiktok: 150,
  };

  const maxLength = maxLengths[platform.toLowerCase()] || 280;
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - 3) + "...";
}
```

---

## Integration Points

### With Other Agents

- **MemeEngineCore**: Uses MemeForge for meme creation
- **CultureScore**: Scores generated memes
- **PulseCaster**: Publishes memes to platforms

### With DreamNet Systems

- **Agent Registry Core**: Registered as a domain-specific agent
- **Social Hub Core**: Publishes memes to social platforms
- **Media Vault**: Stores meme assets

---

## Usage Examples

### Example 1: Create 2-Panel Meme

```typescript
import { MemeForgeAgent } from '@dreamnet/agents/MemeForge';

const result = await MemeForgeAgent.run({
  task: "create_2panel",
  data: {
    topic: "CultureCoins",
    style: "meta"
  }
});

if (result.success && result.output) {
  console.log(`Top: ${result.output.top}`);
  console.log(`Bottom: ${result.output.bottom}`);
  console.log(`Variations: ${result.output.variations.length}`);
}
```

### Example 2: Generate Platform Variants

```typescript
const result = await MemeForgeAgent.run({
  task: "platform_variants",
  data: {
    text: "DreamNet is the future of culture! Join us on this journey.",
    platforms: ["twitter", "farcaster", "tiktok"]
  }
});

if (result.success && result.output) {
  Object.entries(result.output).forEach(([platform, text]) => {
    console.log(`${platform}: ${text}`);
  });
}
```

---

## Related Systems

- **MemeEngineCore Agent**: Meme orchestration engine
- **CultureScore Agent**: Content scoring
- **PulseCaster Agent**: Content distribution
- **Social Hub Core**: Social content management

---

## Future Enhancements

1. **Visual Meme Support**: Generate visual memes with images
2. **Template Library**: Build a library of meme templates
3. **Trend Integration**: Incorporate trending formats and topics
4. **LLM Integration**: Use LLMs for more creative captions
5. **A/B Testing**: Test multiple variations and track performance
6. **Learning System**: Learn from successful memes
7. **Multi-Language Support**: Generate memes in multiple languages

---

**Status**: ✅ Implemented

