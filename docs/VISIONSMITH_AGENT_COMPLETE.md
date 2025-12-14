# VisionSmith Agent - Complete Documentation

**Package**: `agents/VisionSmith`  
**Type**: Domain-Specific Agent  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

**VisionSmith** is a **visual content generation agent** that creates visual content and image generation prompts. It enhances prompts for image generation and applies enhancements to existing images.

### Key Features

- **Prompt Enhancement**: Optimize prompts for image generation models
- **Style Application**: Apply various visual styles (vibrant, minimalist, epic, playful)
- **Image Enhancement**: Apply enhancements to existing images
- **Metadata Management**: Track prompt metadata and generation details

---

## Role & Responsibilities

### Role

VisionSmith acts as a **visual content specialist** for DreamNet's cultural content ecosystem, optimizing image generation and enhancement workflows.

### Responsibilities

1. **Generate Visual Content**: Create optimized prompts for image generation
2. **Enhance Images**: Apply enhancements to existing images
3. **Style Application**: Apply various visual styles
4. **Metadata Tracking**: Track generation metadata and details

---

## API Reference

### Agent Definition

```typescript
export const VisionSmithAgent: Agent = {
  name: "VisionSmith",
  description: "Creates visual content and image generation prompts",
  capabilities: ["generate", "enhance"],
  async run(payload) {
    return runVisionSmithTask(payload);
  },
};
```

### Types

```typescript
export interface VisionSmithTask {
  generate: {
    prompt: string;
    style?: string;
  };
  enhance: {
    image: string;
    enhancements: string[];
  };
}

export interface VisionSmithOutput {
  generate: {
    imageUrl: string;
    prompt: string;
    metadata: any;
  };
  enhance: {
    enhanced: string;
    applied: string[];
  };
}
```

---

## Tasks

### 1. Generate

Creates an enhanced prompt for image generation and returns a placeholder image URL.

**Input**:
```typescript
{
  task: "generate",
  data: {
    prompt: string;         // Base prompt for image generation
    style?: string;        // Visual style (default: "vibrant")
  }
}
```

**Output**:
```typescript
{
  imageUrl: string;        // Generated image URL (placeholder)
  prompt: string;         // Enhanced prompt
  metadata: {
    style: string;
    originalPrompt: string;
    timestamp: number;
  };
}
```

**Supported Styles**:
- `vibrant`: Vibrant, colorful, high contrast
- `minimalist`: Minimalist, clean, simple
- `epic`: Epic, dramatic, cinematic
- `playful`: Playful, fun, whimsical

**Example**:
```typescript
const result = await VisionSmithAgent.run({
  task: "generate",
  data: {
    prompt: "A futuristic cityscape",
    style: "vibrant"
  }
});

// Result:
// {
//   success: true,
//   output: {
//     imageUrl: "https://placeholder.dreamnet.ink/1234567890.png",
//     prompt: "vibrant, colorful, high contrast, A futuristic cityscape, high quality, detailed, culturecoin aesthetic",
//     metadata: {
//       style: "vibrant",
//       originalPrompt: "A futuristic cityscape",
//       timestamp: 1234567890
//     }
//   }
// }
```

### 2. Enhance

Applies enhancements to an existing image.

**Input**:
```typescript
{
  task: "enhance",
  data: {
    image: string;         // Image identifier or URL
    enhancements: string[]; // Array of enhancement types
  }
}
```

**Output**:
```typescript
{
  enhanced: string;        // Enhanced image identifier
  applied: string[];      // List of successfully applied enhancements
}
```

**Available Enhancements**:
- `upscale`: Increase image resolution
- `color_correct`: Adjust color balance and saturation
- `add_effects`: Add visual effects
- `optimize`: Optimize image for web/performance

**Example**:
```typescript
const result = await VisionSmithAgent.run({
  task: "enhance",
  data: {
    image: "dreamnet-logo.png",
    enhancements: ["upscale", "color_correct", "optimize"]
  }
});

// Result:
// {
//   success: true,
//   output: {
//     enhanced: "enhanced_dreamnet-logo.png",
//     applied: ["upscale", "color_correct", "optimize"]
//   }
// }
```

---

## Implementation Details

### Prompt Enhancement

Enhances prompts with style-specific prefixes:

```typescript
function enhancePrompt(prompt: string, style: string): string {
  const stylePrefixes: Record<string, string> = {
    vibrant: "vibrant, colorful, high contrast, ",
    minimalist: "minimalist, clean, simple, ",
    epic: "epic, dramatic, cinematic, ",
    playful: "playful, fun, whimsical, ",
  };

  const prefix = stylePrefixes[style] || "";
  return `${prefix}${prompt}, high quality, detailed, culturecoin aesthetic`;
}
```

### Enhancement Application

Validates and applies requested enhancements:

```typescript
function applyEnhancements(image: string, enhancements: string[]): string[] {
  const applied: string[] = [];
  
  const availableEnhancements = ["upscale", "color_correct", "add_effects", "optimize"];
  
  for (const enhancement of enhancements) {
    if (availableEnhancements.includes(enhancement)) {
      applied.push(enhancement);
    }
  }
  
  return applied;
}
```

---

## Integration Points

### With Other Agents

- **CultureOps**: Orchestrates visual content workflows
- **MemeForge**: Generates visual memes
- **PublishPack**: Creates cover images for publications
- **ZoraPack**: Generates NFT images

### With DreamNet Systems

- **Agent Registry Core**: Registered as a domain-specific agent
- **Media Vault**: Stores generated images and metadata
- **Cloudinary Core**: May integrate for image processing

---

## Usage Examples

### Example 1: Generate Image Prompt

```typescript
import { VisionSmithAgent } from '@dreamnet/agents/VisionSmith';

const result = await VisionSmithAgent.run({
  task: "generate",
  data: {
    prompt: "A dream tree growing in a digital forest",
    style: "epic"
  }
});

if (result.success && result.output) {
  console.log("Enhanced Prompt:", result.output.prompt);
  console.log("Image URL:", result.output.imageUrl);
  console.log("Metadata:", result.output.metadata);
}
```

### Example 2: Enhance Image

```typescript
const result = await VisionSmithAgent.run({
  task: "enhance",
  data: {
    image: "culturecoin-cover.png",
    enhancements: ["upscale", "color_correct"]
  }
});

if (result.success && result.output) {
  console.log("Enhanced Image:", result.output.enhanced);
  console.log("Applied Enhancements:", result.output.applied);
}
```

---

## Related Systems

- **Media Vault**: Media asset management
- **Cloudinary Core**: Image processing and optimization
- **CultureOps Agent**: Cultural operations orchestration

---

## Future Enhancements

1. **Real Image Generation**: Integrate with DALL-E, Midjourney, Stable Diffusion
2. **Batch Generation**: Generate multiple variations simultaneously
3. **Style Transfer**: Apply artistic styles to images
4. **Image Analysis**: Analyze images for content, quality, and style
5. **Animation Support**: Generate animated GIFs and videos
6. **Custom Models**: Train custom image generation models
7. **Image-to-Image**: Transform existing images based on prompts

---

**Status**: ✅ Implemented (Prompt Enhancement Only - Image Generation Integration Pending)

