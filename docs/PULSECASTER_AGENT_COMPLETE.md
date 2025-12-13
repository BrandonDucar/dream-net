# PulseCaster Agent - Complete Documentation

**Package**: `agents/PulseCaster`  
**Type**: Domain-Specific Agent  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

**PulseCaster** is a **content distribution agent** that casts content across platforms and channels. It optimizes content for platform-specific constraints and provides recommendations for better performance.

### Key Features

- **Multi-Platform Casting**: Distribute content to multiple platforms simultaneously
- **Platform Optimization**: Automatically optimize content for each platform
- **Content Analysis**: Analyze content and provide optimization recommendations
- **Scheduling Support**: Support for scheduled content distribution

---

## Role & Responsibilities

### Role

PulseCaster acts as a **content distribution specialist** for DreamNet's cultural content ecosystem, ensuring content reaches the right audiences on the right platforms.

### Responsibilities

1. **Cast Content**: Distribute content to multiple platforms
2. **Optimize Content**: Adapt content for platform-specific constraints
3. **Analyze Content**: Provide optimization recommendations
4. **Track Distribution**: Monitor content distribution results

---

## API Reference

### Agent Definition

```typescript
export const PulseCasterAgent: Agent = {
  name: "PulseCaster",
  description: "Casts content across platforms and channels",
  capabilities: ["cast", "analyze"],
  async run(payload) {
    return runPulseCasterTask(payload);
  },
};
```

### Types

```typescript
export interface PulseCasterTask {
  cast: {
    content: string;
    platforms: string[];
    schedule?: string;
  };
  analyze: {
    platform: string;
    content: string;
  };
}

export interface PulseCasterOutput {
  cast: {
    results: Array<{
      platform: string;
      success: boolean;
      postId?: string;
      error?: string;
    }>;
  };
  analyze: {
    platform: string;
    optimized: string;
    recommendations: string[];
  };
}
```

---

## Tasks

### 1. Cast

Distributes content to multiple platforms.

**Input**:
```typescript
{
  task: "cast",
  data: {
    content: string;         // Content to distribute
    platforms: string[];     // Target platforms
    schedule?: string;       // Optional schedule (ISO 8601)
  }
}
```

**Output**:
```typescript
{
  results: Array<{
    platform: string;       // Platform name
    success: boolean;       // Whether distribution succeeded
    postId?: string;       // Post ID (if successful)
    error?: string;        // Error message (if failed)
  }>;
}
```

**Supported Platforms**:
- `twitter`: Twitter/X (280 char limit)
- `farcaster`: Farcaster (320 char limit)
- `telegram`: Telegram (4096 char limit)
- `instagram`: Instagram (2200 char limit)
- `tiktok`: TikTok (150 char limit)

**Example**:
```typescript
const result = await PulseCasterAgent.run({
  task: "cast",
  data: {
    content: "DreamNet is revolutionizing culture! 🚀",
    platforms: ["twitter", "farcaster"]
  }
});

// Result:
// {
//   success: true,
//   output: {
//     results: [
//       { platform: "twitter", success: true, postId: "mock-twitter-1234567890" },
//       { platform: "farcaster", success: true, postId: "mock-farcaster-1234567890" }
//     ]
//   }
// }
```

### 2. Analyze

Analyzes content for a specific platform and provides optimization recommendations.

**Input**:
```typescript
{
  task: "analyze",
  data: {
    platform: string;      // Target platform
    content: string;       // Content to analyze
  }
}
```

**Output**:
```typescript
{
  platform: string;        // Analyzed platform
  optimized: string;      // Platform-optimized version
  recommendations: string[];  // Optimization recommendations
}
```

**Example**:
```typescript
const result = await PulseCasterAgent.run({
  task: "analyze",
  data: {
    platform: "twitter",
    content: "DreamNet is amazing and revolutionary!"
  }
});

// Result:
// {
//   success: true,
//   output: {
//     platform: "twitter",
//     optimized: "DreamNet is amazing and revolutionary!",
//     recommendations: ["Consider adding hashtags for better discoverability"]
//   }
// }
```

---

## Implementation Details

### Platform Optimization

Optimizes content for platform-specific constraints:

```typescript
function optimizeForPlatform(content: string, platform: string): string {
  const maxLengths: Record<string, number> = {
    twitter: 280,
    farcaster: 320,
    telegram: 4096,
    instagram: 2200,
    tiktok: 150,
  };

  const maxLength = maxLengths[platform.toLowerCase()] || 280;
  
  if (content.length <= maxLength) {
    return content;
  }
  
  return content.substring(0, maxLength - 3) + "...";
}
```

### Recommendation Generation

Provides platform-specific recommendations:

```typescript
function generateRecommendations(content: string, platform: string): string[] {
  const recommendations: string[] = [];
  const maxLengths: Record<string, number> = {
    twitter: 280,
    farcaster: 320,
    telegram: 4096,
    instagram: 2200,
    tiktok: 150,
  };
  
  const maxLength = maxLengths[platform.toLowerCase()] || 280;
  
  if (content.length > maxLength) {
    recommendations.push(`Content exceeds ${platform} limit (${maxLength} chars). Consider shortening.`);
  }
  
  if (!content.includes("#") && platform === "twitter") {
    recommendations.push("Consider adding hashtags for better discoverability");
  }
  
  if (!content.includes("@") && platform === "farcaster") {
    recommendations.push("Consider mentioning other users for engagement");
  }
  
  if (content.length < 50) {
    recommendations.push("Content is quite short. Consider adding more context.");
  }
  
  return recommendations.length > 0 ? recommendations : ["Content looks good for this platform!"];
}
```

---

## Integration Points

### With Other Agents

- **MemeForge**: Uses PulseCaster for meme distribution
- **CultureOps**: Orchestrates content distribution workflows
- **Social Hub Core**: Integrates with social content management

### With DreamNet Systems

- **Agent Registry Core**: Registered as a domain-specific agent
- **Social Hub Core**: Publishes content to social platforms
- **Scheduler Core**: Handles scheduled content distribution
- **Audit Core**: Logs all distribution actions

---

## Usage Examples

### Example 1: Cast to Multiple Platforms

```typescript
import { PulseCasterAgent } from '@dreamnet/agents/PulseCaster';

const result = await PulseCasterAgent.run({
  task: "cast",
  data: {
    content: "DreamNet is the future of culture! Join us 🚀",
    platforms: ["twitter", "farcaster", "telegram"]
  }
});

if (result.success && result.output) {
  result.output.results.forEach((platformResult) => {
    if (platformResult.success) {
      console.log(`✅ ${platformResult.platform}: ${platformResult.postId}`);
    } else {
      console.log(`❌ ${platformResult.platform}: ${platformResult.error}`);
    }
  });
}
```

### Example 2: Analyze Content

```typescript
const result = await PulseCasterAgent.run({
  task: "analyze",
  data: {
    platform: "twitter",
    content: "DreamNet is revolutionizing culture and community!"
  }
});

if (result.success && result.output) {
  console.log(`Optimized: ${result.output.optimized}`);
  console.log("Recommendations:");
  result.output.recommendations.forEach((rec) => {
    console.log(`  - ${rec}`);
  });
}
```

---

## Related Systems

- **Social Hub Core**: Social content management
- **Scheduler Core**: Scheduled content distribution
- **MemeForge Agent**: Meme creation and distribution
- **CultureOps Agent**: Cultural operations orchestration

---

## Future Enhancements

1. **Real Platform Integration**: Integrate with actual platform APIs
2. **Analytics Integration**: Track content performance across platforms
3. **A/B Testing**: Test multiple content variations
4. **Best Time Scheduling**: Optimize posting times for each platform
5. **Engagement Prediction**: Predict content performance before posting
6. **Cross-Platform Threading**: Create threaded content across platforms
7. **Automated Responses**: Handle comments and interactions

---

**Status**: ✅ Implemented (Mock Implementation - Real Platform Integration Pending)

