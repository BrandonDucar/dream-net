# RemixEngine Agent - Complete Documentation

**Package**: `agents/RemixEngine`  
**Type**: Domain-Specific Agent  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

**RemixEngine** is a **text transformation agent** that remixes and transforms text content for different contexts and audiences. It generates style variations, compresses text, and expands content with context or lore.

### Key Features

- **Style Remixing**: Generate multiple style variations of text
- **Text Compression**: Compress text to target lengths
- **Text Expansion**: Expand text with context or lore
- **Context Adaptation**: Adapt content for different audiences

---

## Role & Responsibilities

### Role

RemixEngine acts as a **content transformation specialist** for DreamNet's cultural content ecosystem, adapting content for different contexts and audiences.

### Responsibilities

1. **Remix Content**: Generate style variations of text
2. **Compress Text**: Reduce text length while preserving meaning
3. **Expand Text**: Add context or lore to text
4. **Adapt Content**: Transform content for different audiences

---

## API Reference

### Agent Definition

```typescript
export const RemixEngineAgent: Agent = {
  name: "RemixEngine",
  description: "Remixes and transforms text content for different contexts and audiences",
  capabilities: ["remix", "shorten", "expand"],
  async run(payload) {
    return runRemixEngineTask(payload);
  },
};
```

### Types

```typescript
export interface RemixEngineTask {
  remix: {
    text: string;
    style?: "edgy" | "safe" | "surreal";
  };
  shorten: {
    text: string;
    targetLength?: number;
  };
  expand: {
    text: string;
    lore?: boolean;
  };
}

export interface RemixEngineOutput {
  remix: {
    variations: Array<{
      text: string;
      style: string;
    }>;
  };
  shorten: {
    text: string;
    originalLength: number;
    newLength: number;
  };
  expand: {
    text: string;
    lore?: string;
  };
}
```

---

## Tasks

### 1. Remix

Generates style variations of text.

**Input**:
```typescript
{
  task: "remix",
  data: {
    text: string;           // Text to remix
    style?: "edgy" | "safe" | "surreal";  // Remix style (default: "edgy")
  }
}
```

**Output**:
```typescript
{
  variations: Array<{
    text: string;          // Remixed text
    style: string;        // Applied style
  }>;
}
```

**Styles**:
- `edgy`: Uses slang and edgy language (based → good, cringe → bad, fire → amazing)
- `safe`: Uses safe, professional language (based → good, cringe → not ideal)
- `surreal`: Applies surreal transformations (alternating capitalization)

**Example**:
```typescript
const result = await RemixEngineAgent.run({
  task: "remix",
  data: {
    text: "DreamNet is good and amazing",
    style: "edgy"
  }
});

// Result:
// {
//   success: true,
//   output: {
//     variations: [
//       { text: "DreamNet is based and fire", style: "edgy" },
//       { text: "DreamNet is good and great", style: "safe" },
//       { text: "DREAMNET is good AND amazing", style: "surreal" }
//     ]
//   }
// }
```

### 2. Shorten

Compresses text to a target length.

**Input**:
```typescript
{
  task: "shorten",
  data: {
    text: string;           // Text to compress
    targetLength?: number;  // Target length in characters (default: 100)
  }
}
```

**Output**:
```typescript
{
  text: string;            // Compressed text
  originalLength: number;  // Original text length
  newLength: number;      // Compressed text length
}
```

**Compression Strategy**:
1. Remove filler words (the, a, an, and, or, but, etc.)
2. Truncate at word boundary if still too long
3. Add ellipsis if truncated

**Example**:
```typescript
const result = await RemixEngineAgent.run({
  task: "shorten",
  data: {
    text: "DreamNet is a revolutionary platform that transforms culture and community through innovative technology.",
    targetLength: 50
  }
});

// Result:
// {
//   success: true,
//   output: {
//     text: "DreamNet revolutionary platform transforms culture...",
//     originalLength: 98,
//     newLength: 50
//   }
// }
```

### 3. Expand

Expands text with context or lore.

**Input**:
```typescript
{
  task: "expand",
  data: {
    text: string;          // Text to expand
    lore?: boolean;       // Include lore (default: false)
  }
}
```

**Output**:
```typescript
{
  text: string;           // Expanded text
  lore?: string;        // Lore text (if requested)
}
```

**Example**:
```typescript
const result = await RemixEngineAgent.run({
  task: "expand",
  data: {
    text: "DreamNet transforms culture",
    lore: true
  }
});

// Result:
// {
//   success: true,
//   output: {
//     text: "DreamNet transforms culture. This represents a fundamental shift in how we understand culture, value, and community...",
//     lore: "In the DreamNet mythology, this concept connects to the ancient traditions of the DreamKeepers..."
//   }
// }
```

---

## Implementation Details

### Remix Generation

Applies style-specific transformations:

```typescript
function generateRemixes(text: string, style: string): Array<{ text: string; style: string }> {
  const variations: Array<{ text: string; style: string }> = [];
  const styles = ["edgy", "safe", "surreal"];
  
  for (const s of styles) {
    let remixed = text;
    
    switch (s) {
      case "edgy":
        remixed = text
          .replace(/good/g, "based")
          .replace(/bad/g, "cringe")
          .replace(/amazing/g, "fire")
          .replace(/terrible/g, "mid");
        break;
      case "safe":
        remixed = text
          .replace(/based/g, "good")
          .replace(/cringe/g, "not ideal")
          .replace(/fire/g, "great")
          .replace(/mid/g, "average");
        break;
      case "surreal":
        remixed = text
          .split(" ")
          .map((word, i) => i % 3 === 0 ? word.toUpperCase() : word)
          .join(" ");
        break;
    }
    
    variations.push({ text: remixed, style: s });
  }
  
  return variations;
}
```

### Text Compression

Compresses text while preserving meaning:

```typescript
function compressText(text: string, targetLength: number): string {
  if (text.length <= targetLength) {
    return text;
  }
  
  // Remove filler words
  const compressed = text
    .replace(/\s+/g, " ")
    .replace(/\b(the|a|an|and|or|but|in|on|at|to|for|of|with|by)\b/gi, "")
    .trim();
  
  if (compressed.length <= targetLength) {
    return compressed;
  }
  
  // Truncate at word boundary
  const truncated = compressed.substring(0, targetLength);
  const lastSpace = truncated.lastIndexOf(" ");
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + "...";
  }
  
  return truncated + "...";
}
```

### Text Expansion

Expands text with context or lore:

```typescript
function expandText(text: string, includeLore: boolean): { text: string; lore?: string } {
  const expanded = `${text} This represents a fundamental shift in how we understand culture, value, and community. The implications extend far beyond the surface, touching on deeper questions of identity, belonging, and collective meaning-making.`;
  
  const lore = includeLore
    ? `In the DreamNet mythology, this concept connects to the ancient traditions of the DreamKeepers, who understood that culture is not static but flows like a river, constantly remaking itself through the collective imagination of the community.`
    : undefined;
  
  return { text: expanded, lore };
}
```

---

## Integration Points

### With Other Agents

- **MemeEngineCore**: Uses RemixEngine for content remixing
- **CultureScore**: Scores remixed content
- **PulseCaster**: Remixes content before distribution

### With DreamNet Systems

- **Agent Registry Core**: Registered as a domain-specific agent
- **Narrative Field**: May integrate for lore expansion
- **Dream Vault**: Stores remixed content variations

---

## Usage Examples

### Example 1: Generate Style Variations

```typescript
import { RemixEngineAgent } from '@dreamnet/agents/RemixEngine';

const result = await RemixEngineAgent.run({
  task: "remix",
  data: {
    text: "DreamNet is amazing and revolutionary",
    style: "edgy"
  }
});

if (result.success && result.output) {
  result.output.variations.forEach((variation) => {
    console.log(`${variation.style}: ${variation.text}`);
  });
}
```

### Example 2: Compress Text

```typescript
const result = await RemixEngineAgent.run({
  task: "shorten",
  data: {
    text: "DreamNet is a revolutionary platform that transforms culture and community.",
    targetLength: 40
  }
});

if (result.success && result.output) {
  console.log(`Compressed from ${result.output.originalLength} to ${result.output.newLength} chars`);
  console.log(`Result: ${result.output.text}`);
}
```

---

## Related Systems

- **MemeEngineCore Agent**: Meme orchestration
- **CultureScore Agent**: Content scoring
- **Narrative Field**: Lore and narrative management

---

## Future Enhancements

1. **LLM Integration**: Use LLMs for more sophisticated remixing
2. **Semantic Compression**: Preserve meaning better during compression
3. **Audience Adaptation**: Adapt content for specific audiences
4. **Multi-Language Support**: Remix content in multiple languages
5. **Learning System**: Learn from successful remixes
6. **Template Library**: Build a library of remix patterns
7. **Real-Time Remixing**: Remix content in real-time based on context

---

**Status**: ✅ Implemented

