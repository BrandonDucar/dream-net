# Content Distribution Pipeline

**Status**: 📋 Pipeline Guide  
**Priority**: 🟢 LOW  
**Last Updated**: 2025-01-27

---

## Overview

Automated content distribution pipeline for DreamNet, including video optimization, Farcaster/Zora automation, Mythos Spine content series, and collector set mechanics.

---

## Video Optimization

### 5/8/12 Second Variants

**Purpose**: Create multiple duration variants for different platforms

**Process**:
1. Export original video
2. Create 5s, 8s, 12s variants
3. Optimize each for platform
4. Generate thumbnails

**Implementation**:
```typescript
class VideoOptimizer {
  async createVariants(video: Video): Promise<VideoVariants> {
    return {
      "5s": await this.createVariant(video, 5),
      "8s": await this.createVariant(video, 8),
      "12s": await this.createVariant(video, 12)
    };
  }
  
  async optimizeForPlatform(
    video: Video,
    platform: "farcaster" | "tiktok" | "instagram"
  ): Promise<Video> {
    // Platform-specific optimization
    switch (platform) {
      case "farcaster":
        return await this.optimizeForFarcaster(video);
      case "tiktok":
        return await this.optimizeForTikTok(video);
      case "instagram":
        return await this.optimizeForInstagram(video);
    }
  }
}
```

### Mute-First Optimization

**Purpose**: Optimize for autoplay muted feeds

**Requirements**:
- First frame must be legible
- No audio required for understanding
- Captions for context

### VCR Optimization

**Purpose**: Optimize Video Completion Rate

**Target**: 70-90% completion rate

**Techniques**:
- Hook in first 1-2 seconds
- Fast-paced editing
- Loopable endings
- Remove dead time

---

## Farcaster/Zora Automation

### Automated Posting

**Purpose**: Automatically post content to Farcaster and Zora

**Implementation**:
```typescript
class FarcasterZoraAutomation {
  async postToFarcaster(content: Content): Promise<void> {
    // Create Farcaster cast
    const cast = await this.createCast(content);
    
    // Post to Farcaster
    await Farcaster.post(cast);
  }
  
  async mintToZora(content: Content): Promise<void> {
    // Create Zora mint
    const mint = await this.createZoraMint(content);
    
    // Mint on Zora
    await Zora.mint(mint);
  }
  
  async postAndMint(content: Content): Promise<void> {
    // Post to Farcaster
    await this.postToFarcaster(content);
    
    // Mint on Zora
    await this.mintToZora(content);
  }
}
```

---

## Mythos Spine Content Series

### Arc Structure

**Arcs**:
1. **The DreamNet Tree** (Origin)
2. **The Snail** (Privacy & Patience)
3. **The Jaguar** (Speed & Strike)

**Episode Structure**:
- 5-7 micro-episodes per arc
- 15-25 second Grok clips
- Hook at end of each episode

**Cadence**:
- Mon/Wed/Fri: 1 new clip
- Sun: "Previously on DreamNet" supercut + remix prompt

---

## Collector Set Mechanics

### Set Structure

**Example**: "DreamNet Tree - Season 1 (12)"

**Components**:
- Named set
- Numbered pieces (Card 1/12, Card 2/12, etc.)
- Consistent traits
- Chase variants
- Completion bonus

**Metadata**:
```typescript
interface CollectorSet {
  setName: string;
  season: number;
  setSize: number;
  cards: Array<{
    cardNumber: number;
    rarity: "common" | "rare" | "chase" | "legendary";
    traits: Record<string, string>;
  }>;
  completionBonus: {
    description: string;
    unlock: string; // e.g., "S2 allowlist + Root Key"
  };
}
```

### Drop Cadence

- 3 cards/week
- 4 weeks total
- Final week = "Finishers Week"

---

## Implementation Checklist

- [ ] Video optimization pipeline
- [ ] Farcaster automation
- [ ] Zora automation
- [ ] Mythos Spine content creation
- [ ] Collector set mechanics
- [ ] Scheduling system
- [ ] Analytics tracking

---

**Status**: 📋 Complete

