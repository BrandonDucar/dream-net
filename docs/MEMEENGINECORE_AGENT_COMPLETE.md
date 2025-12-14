# MemeEngineCore Agent - Complete Documentation

**Package**: `agents/MemeEngineCore`  
**Type**: Domain-Specific Agent  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

**MemeEngineCore** is a **core orchestration engine** for the meme generation pipeline. It coordinates meme generation across multiple platforms and executes pipeline workflows for content transformation.

### Key Features

- **Multi-Platform Generation**: Generate memes optimized for different platforms
- **Pipeline Orchestration**: Execute multi-step content transformation pipelines
- **Scoring & Recommendation**: Score generated memes and recommend best options
- **Platform Optimization**: Adapt content for platform-specific constraints

---

## Role & Responsibilities

### Role

MemeEngineCore acts as the **orchestration engine** for DreamNet's meme generation system, coordinating generation and transformation workflows.

### Responsibilities

1. **Generate Memes**: Create meme text for multiple platforms
2. **Orchestrate Pipelines**: Execute multi-step transformation workflows
3. **Score Content**: Evaluate and score generated memes
4. **Recommend Best**: Identify and recommend the best meme variations

---

## API Reference

### Agent Definition

```typescript
export const MemeEngineCoreAgent: Agent = {
  name: "MemeEngineCore",
  description: "Core orchestration engine for meme generation pipeline",
  capabilities: ["generate", "pipeline"],
  async run(payload) {
    return runMemeEngineCoreTask(payload);
  },
};
```

### Types

```typescript
export interface MemeEngineCoreTask {
  generate: {
    topic: string;
    style?: string;
    platforms?: string[];
  };
  pipeline: {
    steps: string[];
    input: any;
  };
}

export interface MemeEngineCoreOutput {
  generate: {
    memes: Array<{
      text: string;
      style: string;
      platform: string;
      score: number;
    }>;
    recommended: {
      text: string;
      platform: string;
      reason: string;
    };
  };
  pipeline: {
    results: Array<{
      step: string;
      output: any;
      success: boolean;
    }>;
  };
}
```

---

## Tasks

### 1. Generate

Generates meme text for multiple platforms and recommends the best option.

**Input**:
```typescript
{
  task: "generate",
  data: {
    topic: string;           // Topic for meme generation
    style?: string;          // Meme style (default: "classic")
    platforms?: string[];    // Target platforms (default: ["twitter"])
  }
}
```

**Output**:
```typescript
{
  memes: Array<{
    text: string;           // Generated meme text
    style: string;         // Applied style
    platform: string;     // Target platform
    score: number;        // Quality score (0.7-1.0)
  }>;
  recommended: {
    text: string;         // Best meme text
    platform: string;    // Best platform
    reason: string;      // Recommendation reason
  };
}
```

**Supported Styles**:
- `classic`: Traditional meme formats
- `edgy`: Edgy, provocative memes
- `wholesome`: Positive, wholesome memes

**Example**:
```typescript
const result = await MemeEngineCoreAgent.run({
  task: "generate",
  data: {
    topic: "DreamNet",
    style: "classic",
    platforms: ["twitter", "farcaster"]
  }
});

// Result:
// {
//   success: true,
//   output: {
//     memes: [
//       { text: "When you realize DreamNet", style: "classic", platform: "twitter", score: 0.85 },
//       { text: "DreamNet hits different", style: "classic", platform: "farcaster", score: 0.92 }
//     ],
//     recommended: {
//       text: "DreamNet hits different",
//       platform: "farcaster",
//       reason: "Highest score (92.0%) for farcaster"
//     }
//   }
// }
```

### 2. Pipeline

Executes a multi-step transformation pipeline.

**Input**:
```typescript
{
  task: "pipeline",
  data: {
    steps: string[];      // Array of pipeline step names
    input: any;           // Initial input data
  }
}
```

**Output**:
```typescript
{
  results: Array<{
    step: string;        // Step name
    output: any;        // Step output
    success: boolean;   // Whether step succeeded
  }>;
}
```

**Supported Steps**:
- `remix`: Remix content
- `score`: Score content quality
- `optimize`: Optimize for platform

**Example**:
```typescript
const result = await MemeEngineCoreAgent.run({
  task: "pipeline",
  data: {
    steps: ["remix", "score", "optimize"],
    input: { text: "DreamNet is amazing" }
  }
});

// Result:
// {
//   success: true,
//   output: {
//     results: [
//       { step: "remix", output: { text: "DreamNet is amazing", remixed: true }, success: true },
//       { step: "score", output: { text: "DreamNet is amazing", remixed: true, score: 0.75 }, success: true },
//       { step: "optimize", output: { text: "DreamNet is amazing", remixed: true, score: 0.75, optimized: true }, success: true }
//     ]
//   }
// }
```

---

## Implementation Details

### Meme Generation

Uses style-specific templates:

```typescript
function generateMemeText(topic: string, style: string, platform: string): string {
  const templates: Record<string, string[]> = {
    classic: [
      `When you realize ${topic}`,
      `${topic} hits different`,
      `Me explaining ${topic} to normies`,
      `${topic} but make it spicy`,
    ],
    edgy: [
      `Society when ${topic}`,
      `${topic} is just ${topic} with extra steps`,
      `The system wants you to think ${topic}`,
    ],
    wholesome: [
      `Finding out that ${topic}`,
      `When you discover ${topic}`,
      `${topic} makes everything better`,
    ],
  };

  const options = templates[style] || templates.classic;
  const template = options[Math.floor(Math.random() * options.length)];
  
  // Platform-specific adaptation
  if (platform === "twitter" && template.length > 280) {
    return template.substring(0, 277) + "...";
  }
  
  return template;
}
```

### Pipeline Execution

Executes steps sequentially:

```typescript
function executePipelineStep(step: string, input: any): any {
  switch (step) {
    case "remix":
      return { ...input, remixed: true };
    case "score":
      return { ...input, score: Math.random() };
    case "optimize":
      return { ...input, optimized: true };
    default:
      return input;
  }
}
```

---

## Integration Points

### With Other Agents

- **MemeForge**: Uses MemeEngineCore for orchestration
- **CultureScore**: Scores generated memes
- **RemixEngine**: Remixes meme content

### With DreamNet Systems

- **Agent Registry Core**: Registered as a domain-specific agent
- **Social Hub Core**: Publishes generated memes
- **Media Vault**: Stores meme assets

---

## Usage Examples

### Example 1: Generate Multi-Platform Memes

```typescript
import { MemeEngineCoreAgent } from '@dreamnet/agents/MemeEngineCore';

const result = await MemeEngineCoreAgent.run({
  task: "generate",
  data: {
    topic: "CultureCoins",
    style: "classic",
    platforms: ["twitter", "farcaster", "telegram"]
  }
});

if (result.success && result.output) {
  console.log(`Generated ${result.output.memes.length} memes`);
  console.log(`Recommended: ${result.output.recommended.text}`);
  console.log(`Platform: ${result.output.recommended.platform}`);
}
```

### Example 2: Execute Transformation Pipeline

```typescript
const result = await MemeEngineCoreAgent.run({
  task: "pipeline",
  data: {
    steps: ["remix", "score", "optimize"],
    input: { text: "DreamNet memes" }
  }
});

if (result.success && result.output) {
  result.output.results.forEach((step, i) => {
    console.log(`Step ${i + 1} (${step.step}): ${step.success ? "Success" : "Failed"}`);
  });
}
```

---

## Related Systems

- **MemeForge Agent**: Meme creation and captioning
- **CultureScore Agent**: Content scoring
- **RemixEngine Agent**: Content remixing
- **Social Hub Core**: Social content publishing

---

## Future Enhancements

1. **LLM Integration**: Use LLMs for more creative meme generation
2. **Visual Meme Support**: Generate visual memes with images
3. **Trend Integration**: Incorporate trending topics and formats
4. **A/B Testing**: Test multiple variations and track performance
5. **Learning System**: Learn from successful memes
6. **Template Library**: Build a library of meme templates
7. **Real-Time Generation**: Generate memes in real-time based on events

---

**Status**: ✅ Implemented

