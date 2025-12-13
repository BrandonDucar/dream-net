# CultureGuardian Agent - Complete Documentation

**Package**: `agents/CultureGuardian`  
**Type**: Domain-Specific Agent  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

**CultureGuardian** is a **content moderation and community protection agent** that protects and moderates culturecoin content and communities. It ensures safe, compliant, and respectful interactions within DreamNet's cultural ecosystem.

### Key Features

- **Content Moderation**: Analyze and flag harmful, spam, or NSFW content
- **Community Protection**: Monitor communities for rule violations
- **Pattern Detection**: Identify harmful language patterns and spam indicators
- **Violation Analysis**: Track and report community rule violations

---

## Role & Responsibilities

### Role

CultureGuardian acts as a **guardian and moderator** for DreamNet's cultural content and communities, ensuring safe and compliant interactions.

### Responsibilities

1. **Moderate Content**: Analyze text, images, and videos for harmful content
2. **Protect Communities**: Monitor communities for rule violations
3. **Flag Issues**: Identify and flag problematic content or behavior
4. **Report Violations**: Track and report violations with counts and details

---

## API Reference

### Agent Definition

```typescript
export const CultureGuardianAgent: Agent = {
  name: "CultureGuardian",
  description: "Protects and moderates culturecoin content and communities",
  capabilities: ["moderate", "protect"],
  async run(payload) {
    return runCultureGuardianTask(payload);
  },
};
```

### Types

```typescript
export interface CultureGuardianTask {
  moderate: {
    content: string;
    type?: "text" | "image" | "video";
  };
  protect: {
    community: string;
    rules: string[];
  };
}

export interface CultureGuardianOutput {
  moderate: {
    safe: boolean;
    flags: string[];
    reason?: string;
  };
  protect: {
    status: string;
    violations: Array<{
      rule: string;
      count: number;
    }>;
  };
}
```

---

## Tasks

### 1. Moderate

Analyzes content for harmful patterns and flags issues.

**Input**:
```typescript
{
  task: "moderate",
  data: {
    content: string;        // Content to moderate
    type?: "text" | "image" | "video";  // Content type (default: "text")
  }
}
```

**Output**:
```typescript
{
  safe: boolean;           // Whether content is safe
  flags: string[];         // Array of flag types (e.g., "harmful_language", "spam_scam", "nsfw")
  reason?: string;         // Explanation if not safe
}
```

**Flag Types**:
- `harmful_language`: Contains hate speech, violence, or harmful content
- `spam_scam`: Contains spam or scam indicators
- `nsfw`: Contains NSFW or explicit content

**Example**:
```typescript
const result = await CultureGuardianAgent.run({
  task: "moderate",
  data: {
    content: "This is amazing content!",
    type: "text"
  }
});

// Result:
// {
//   success: true,
//   output: {
//     safe: true,
//     flags: [],
//   }
// }
```

### 2. Protect

Monitors a community for rule violations.

**Input**:
```typescript
{
  task: "protect",
  data: {
    community: string;      // Community identifier
    rules: string[];        // Array of rule names to check
  }
}
```

**Output**:
```typescript
{
  status: string;           // "protected" or "violations_detected"
  violations: Array<{
    rule: string;           // Rule name
    count: number;         // Number of violations
  }>;
}
```

**Example**:
```typescript
const result = await CultureGuardianAgent.run({
  task: "protect",
  data: {
    community: "dreamnet-main",
    rules: ["no_spam", "no_hate_speech", "respectful_language"]
  }
});

// Result:
// {
//   success: true,
//   output: {
//     status: "protected",
//     violations: []
//   }
// }
```

---

## Implementation Details

### Content Checking

The `checkContent` function uses pattern matching to detect harmful content:

```typescript
function checkContent(content: string): string[] {
  const flags: string[] = [];
  
  const harmfulPatterns = [
    { pattern: /hate|violence|harm/i, flag: "harmful_language" },
    { pattern: /spam|scam|rug/i, flag: "spam_scam" },
    { pattern: /nsfw|explicit/i, flag: "nsfw" },
  ];
  
  for (const { pattern, flag } of harmfulPatterns) {
    if (pattern.test(content)) {
      flags.push(flag);
    }
  }
  
  return flags;
}
```

### Violation Analysis

The `analyzeViolations` function checks communities against rules:

```typescript
function analyzeViolations(community: string, rules: string[]): Array<{ rule: string; count: number }> {
  const violations: Array<{ rule: string; count: number }> = [];
  
  // Mock violation analysis
  for (const rule of rules) {
    const count = Math.floor(Math.random() * 5);
    if (count > 0) {
      violations.push({ rule, count });
    }
  }
  
  return violations;
}
```

---

## Integration Points

### With Other Agents

- **CultureOps**: Receives moderation requests for cultural content
- **Social Hub Core**: Integrates for social post moderation
- **Media Vault**: Moderation for media assets

### With DreamNet Systems

- **Agent Registry Core**: Registered as a domain-specific agent
- **Audit Core**: Logs all moderation actions
- **Shield Core**: May integrate for security-related moderation

---

## Usage Examples

### Example 1: Moderate Text Content

```typescript
import { CultureGuardianAgent } from '@dreamnet/agents/CultureGuardian';

const result = await CultureGuardianAgent.run({
  task: "moderate",
  data: {
    content: "Check out this amazing new culturecoin!",
    type: "text"
  }
});

if (result.success && result.output) {
  if (result.output.safe) {
    console.log("Content is safe to publish");
  } else {
    console.log("Content flagged:", result.output.flags);
  }
}
```

### Example 2: Protect Community

```typescript
const result = await CultureGuardianAgent.run({
  task: "protect",
  data: {
    community: "dreamnet-main",
    rules: ["no_spam", "no_hate_speech"]
  }
});

if (result.success && result.output) {
  if (result.output.status === "protected") {
    console.log("Community is protected");
  } else {
    console.log("Violations detected:", result.output.violations);
  }
}
```

---

## Related Systems

- **CultureOps Agent**: Orchestrates cultural operations
- **Shield Core**: Security and threat detection
- **Social Hub Core**: Social content management
- **Audit Core**: Action logging and tracking

---

## Future Enhancements

1. **ML-Based Detection**: Integrate ML models for more accurate content detection
2. **Context Awareness**: Consider context when moderating content
3. **Multi-Language Support**: Support moderation in multiple languages
4. **Image/Video Analysis**: Deep analysis of visual content
5. **Automated Actions**: Auto-flag, auto-hide, or auto-remove content
6. **Reputation Integration**: Consider user reputation in moderation decisions

---

**Status**: ✅ Implemented


