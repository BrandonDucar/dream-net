# LoreSmith Agent - Complete Documentation

**Package**: `agents/LoreSmith`  
**Type**: Domain-Specific Agent  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

**LoreSmith** is a **narrative and lore generation agent** that creates and weaves narrative lore for culturecoins. It generates epic stories, expands existing lore, and connects narrative elements into coherent narratives.

### Key Features

- **Lore Creation**: Generate narrative lore in various styles (epic, mystical, modern, meta)
- **Lore Expansion**: Deepen existing lore with additional layers
- **Narrative Weaving**: Connect disparate elements into coherent narratives
- **Character & Theme Extraction**: Identify characters and themes in generated lore

---

## Role & Responsibilities

### Role

LoreSmith acts as a **narrative architect** for DreamNet's cultural content ecosystem, creating rich backstories and narratives for culturecoins.

### Responsibilities

1. **Create Lore**: Generate new narrative lore from topics
2. **Expand Lore**: Add depth and layers to existing lore
3. **Weave Narratives**: Connect multiple elements into coherent stories
4. **Extract Elements**: Identify characters, themes, and connections

---

## API Reference

### Agent Definition

```typescript
export const LoreSmithAgent: Agent = {
  name: "LoreSmith",
  description: "Creates and weaves narrative lore for culturecoins",
  capabilities: ["create", "expand", "weave"],
  async run(payload) {
    return runLoreSmithTask(payload);
  },
};
```

### Types

```typescript
export interface LoreSmithTask {
  create: {
    topic: string;
    style?: "epic" | "mystical" | "modern" | "meta";
  };
  expand: {
    lore: string;
    depth?: number;
  };
  weave: {
    elements: string[];
    theme: string;
  };
}

export interface LoreSmithOutput {
  create: {
    lore: string;
    characters?: string[];
    themes: string[];
  };
  expand: {
    lore: string;
    expanded: string[];
  };
  weave: {
    narrative: string;
    connections: Array<{
      from: string;
      to: string;
      relation: string;
    }>;
  };
}
```

---

## Tasks

### 1. Create

Generates new narrative lore from a topic.

**Input**:
```typescript
{
  task: "create",
  data: {
    topic: string;           // Topic to create lore about
    style?: "epic" | "mystical" | "modern" | "meta";  // Narrative style (default: "epic")
  }
}
```

**Output**:
```typescript
{
  lore: string;             // Generated lore text
  characters?: string[];    // Identified characters
  themes: string[];        // Extracted themes
}
```

**Styles**:
- `epic`: Ancient, grand narratives with guardians and forces
- `mystical`: Ethereal, otherworldly narratives
- `modern`: Contemporary, Web3-focused narratives
- `meta`: Self-referential, recursive narratives

**Example**:
```typescript
const result = await LoreSmithAgent.run({
  task: "create",
  data: {
    topic: "DreamNet",
    style: "epic"
  }
});

// Result:
// {
//   success: true,
//   output: {
//     lore: "In the ancient times of DreamNet, DreamNet emerged as a force...",
//     characters: ["The DreamKeepers", "The Collective", "The Architects"],
//     themes: ["transformation", "collective consciousness", "cultural evolution"]
//   }
// }
```

### 2. Expand

Adds depth and layers to existing lore.

**Input**:
```typescript
{
  task: "expand",
  data: {
    lore: string;           // Existing lore to expand
    depth?: number;        // Number of expansion layers (default: 2)
  }
}
```

**Output**:
```typescript
{
  lore: string;            // Original lore
  expanded: string[];      // Array of expanded layers
}
```

**Example**:
```typescript
const result = await LoreSmithAgent.run({
  task: "expand",
  data: {
    lore: "DreamNet is a cultural operating system.",
    depth: 3
  }
});

// Result:
// {
//   success: true,
//   output: {
//     lore: "DreamNet is a cultural operating system.",
//     expanded: [
//       "DreamNet is a cultural operating system. This layer of meaning reveals...",
//       "DreamNet is a cultural operating system. This layer of meaning reveals...",
//       "DreamNet is a cultural operating system. This layer of meaning reveals..."
//     ]
//   }
// }
```

### 3. Weave

Connects multiple elements into a coherent narrative.

**Input**:
```typescript
{
  task: "weave",
  data: {
    elements: string[];     // Array of elements to connect
    theme: string;          // Unifying theme
  }
}
```

**Output**:
```typescript
{
  narrative: string;       // Woven narrative
  connections: Array<{
    from: string;          // Source element
    to: string;           // Target element
    relation: string;     // Relationship type
  }>;
}
```

**Relationship Types**:
- `influences`
- `emerges from`
- `transforms into`
- `connects with`
- `gives rise to`

**Example**:
```typescript
const result = await LoreSmithAgent.run({
  task: "weave",
  data: {
    elements: ["DreamNet", "Culture", "Community", "Technology"],
    theme: "Cultural Evolution"
  }
});

// Result:
// {
//   success: true,
//   output: {
//     narrative: "In the grand narrative of Cultural Evolution, these elements converge...",
//     connections: [
//       { from: "DreamNet", to: "Culture", relation: "influences" },
//       { from: "Culture", to: "Community", relation: "emerges from" },
//       { from: "Community", to: "Technology", relation: "transforms into" }
//     ]
//   }
// }
```

---

## Implementation Details

### Lore Generation

Uses style-specific templates:

```typescript
function generateLore(topic: string, style: string) {
  const templates: Record<string, string> = {
    epic: `In the ancient times of DreamNet, ${topic} emerged as a force that would reshape the very fabric of culture. The DreamKeepers, guardians of the collective imagination, recognized its power and wove it into the eternal narrative.`,
    mystical: `Whispers in the void speak of ${topic}, a concept that exists between worlds, neither fully here nor there, but everywhere at once. Those who understand its true nature gain access to realms beyond comprehension.`,
    modern: `${topic} represents the convergence of technology, culture, and community. In the age of Web3, it's not just an idea—it's a movement, a living organism that grows with each interaction.`,
    meta: `The story of ${topic} is itself a story about stories. It's recursive, self-referential, and aware of its own existence. In DreamNet, this meta-narrative becomes reality, blurring the lines between creator and creation.`,
  };
  
  return { text: lore, characters, themes };
}
```

---

## Integration Points

### With Other Agents

- **CultureOps**: Orchestrates lore creation workflows
- **MemeForge**: Uses lore for meme captions
- **VisionSmith**: Generates visual representations of lore

### With DreamNet Systems

- **Agent Registry Core**: Registered as a domain-specific agent
- **Narrative Field**: Stores and manages narrative lore
- **Dream Vault**: Stores lore artifacts

---

## Usage Examples

### Example 1: Create Epic Lore

```typescript
import { LoreSmithAgent } from '@dreamnet/agents/LoreSmith';

const result = await LoreSmithAgent.run({
  task: "create",
  data: {
    topic: "The DreamKeepers",
    style: "epic"
  }
});

if (result.success && result.output) {
  console.log("Lore:", result.output.lore);
  console.log("Characters:", result.output.characters);
  console.log("Themes:", result.output.themes);
}
```

### Example 2: Weave Narrative Elements

```typescript
const result = await LoreSmithAgent.run({
  task: "weave",
  data: {
    elements: ["DreamNet", "Culture", "Community"],
    theme: "Collective Imagination"
  }
});

if (result.success && result.output) {
  console.log("Narrative:", result.output.narrative);
  console.log("Connections:", result.output.connections);
}
```

---

## Related Systems

- **Narrative Field**: Narrative and history management
- **CultureOps Agent**: Cultural operations orchestration
- **Dream Vault**: Content storage and management

---

## Future Enhancements

1. **LLM Integration**: Use LLMs for more creative and varied lore generation
2. **Lore Database**: Build a database of lore patterns and templates
3. **Multi-Language Support**: Generate lore in multiple languages
4. **Visual Lore**: Generate visual representations of lore
5. **Interactive Lore**: Create interactive, branching narratives
6. **Lore Versioning**: Track versions and evolution of lore

---

**Status**: ✅ Implemented

