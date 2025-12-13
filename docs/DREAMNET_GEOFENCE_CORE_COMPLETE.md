# DreamNet Geofence Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

DreamNet Geofence Core provides **IP-based location detection and region-specific content** for DreamNet. It enables tiered region mapping (Global, Country, City) with localized headlines, CTAs, color palettes, emojis, and hashtags.

---

## Key Features

### IP-Based Detection
- IP geolocation
- Region detection
- Location mapping
- Fallback handling

### Tiered Regions
- **Tier 0**: Global default
- **Tier 1**: Country-level
- **Tier 2**: City-level

### Region-Specific Content
- Localized headlines
- Localized CTAs
- Accent color palettes
- Emoji packs
- Hashtag packs
- B-roll packs

### Region Management
- Region configuration
- Content customization
- Fallback hierarchy
- Region matching

---

## Architecture

### Components

1. **Geofencing Core** (`index.ts`)
   - Region management
   - IP detection
   - Content retrieval
   - Region matching

---

## API Reference

### Initialization

#### `new GeofencingCore(): GeofencingCore`
Creates Geofencing Core instance.

**Example**:
```typescript
import { GeofencingCore } from '@dreamnet/dreamnet-geofence-core';

const geofence = new GeofencingCore();
```

### Region Detection

#### `detectRegion(ipAddress?: string): Promise<string>`
Detects region from IP address.

**Example**:
```typescript
const region = await geofence.detectRegion('192.0.2.1');
console.log(`Detected region: ${region}`);
```

### Content Retrieval

#### `getRegionContent(region: string): RegionContent`
Gets region content.

**Example**:
```typescript
const content = geofence.getRegionContent('US/CA/Los_Angeles');
console.log(`Headline: ${content.headline_local}`);
console.log(`CTA: ${content.cta_local}`);
console.log(`Palette: ${content.accent_palette.join(', ')}`);
```

#### `getContentForIP(ipAddress?: string): Promise<RegionContent>`
Gets content for detected IP.

**Example**:
```typescript
const content = await geofence.getContentForIP('192.0.2.1');
console.log(`Headline: ${content.headline_local}`);
```

### Region Management

#### `setRegionContent(region: string, tier: 0 | 1 | 2, content: RegionContent): void`
Sets region content.

**Example**:
```typescript
geofence.setRegionContent('US/TX/Austin', 2, {
  headline_local: 'Keep Austin Dreaming',
  cta_local: 'Join the Dream Hub',
  accent_palette: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
  emoji_pack: ['🤠', '🎸', '🌮'],
  hashtag_pack: ['#DreamNet', '#Austin', '#KeepDreaming'],
});
```

#### `getAllRegions(): RegionConfig[]`
Gets all regions.

**Example**:
```typescript
const regions = geofence.getAllRegions();
regions.forEach(region => {
  console.log(`${region.region} (Tier ${region.tier})`);
});
```

---

## Data Models

### RegionContent

```typescript
interface RegionContent {
  headline_local: string;
  subhead_local?: string;
  cta_local: string;
  accent_palette: string[];
  emoji_pack?: string[];
  hashtag_pack?: string[];
  broll_pack?: string[];
}
```

### RegionConfig

```typescript
interface RegionConfig {
  tier: 0 | 1 | 2; // 0=Global, 1=Country, 2=City
  region: string; // e.g., "US/CA/Los_Angeles", "JP/Tokyo", "Global"
  content: RegionContent;
}
```

---

## Tiered Region System

### Tier 0: Global
- Default fallback
- Universal content
- Base palette
- Standard CTAs

### Tier 1: Country
- Country-level content
- National themes
- Country-specific palettes
- Regional CTAs

### Tier 2: City
- City-level content
- Local themes
- City-specific palettes
- Localized CTAs

---

## Predefined Regions

### Los Angeles
- **Headline**: "Neon flows. Dreams move."
- **Palette**: Neon cyan, dark, pink
- **Emojis**: 🌴 ⚡️ 💧
- **Hashtags**: #DreamNet #NeonFlow #LAAfterdark

### Tokyo
- **Headline**: "Folded steel. Quiet power."
- **Palette**: White, dark, red
- **Emojis**: 🗼 🎴 🛡️
- **Hashtags**: #DreamNet #NeoPaper #TokyoCircuit

### Miami
- **Headline**: "Aqua chrome. Sunset mint."
- **Palette**: Cyan, coral, yellow
- **Emojis**: 🌴 🌊 ☀️
- **Hashtags**: #DreamNet #AquaChrome #SunsetMint

### New York
- **Headline**: "Graphite energy. Electric pulse."
- **Palette**: Gray, yellow, coral
- **Emojis**: 🗽 ⚡ 🏙️
- **Hashtags**: #DreamNet #NeonFlow #NYCBuild

### London
- **Headline**: "Muted slate. Royal accent."
- **Palette**: Gray, brown, gold
- **Emojis**: 🇬🇧 ☕ 🌧️
- **Hashtags**: #DreamNet #LondonTech #RoyalDream

---

## Region Matching Logic

1. **Exact Match**: Try exact region string
2. **City Match**: Try city-level match
3. **Country Match**: Try country-level match
4. **Global Fallback**: Use global default

---

## Integration Points

### DreamNet Systems
- **AI SEO Core**: SEO optimization
- **Social Media Poster**: Content posting
- **Orca Pack Core**: Content generation
- **Whale Pack Core**: Commerce content

### External Systems
- **IP Geolocation APIs**: Location detection
- **Content Management**: Content storage

---

## Usage Examples

### Detect and Get Content

```typescript
const content = await geofence.getContentForIP('192.0.2.1');
console.log(`Headline: ${content.headline_local}`);
console.log(`CTA: ${content.cta_local}`);
```

### Custom Region

```typescript
geofence.setRegionContent('US/WA/Seattle', 2, {
  headline_local: 'Emerald dreams. Cloud power.',
  cta_local: 'Join the Dream Hub',
  accent_palette: ['#00FF88', '#0066CC', '#FF3366'],
  emoji_pack: ['☁️', '🌲', '☕'],
  hashtag_pack: ['#DreamNet', '#Seattle', '#EmeraldDreams'],
});
```

---

## Best Practices

1. **Region Design**
   - Use appropriate tiers
   - Match content to culture
   - Consider local preferences
   - Test fallbacks

2. **Content Creation**
   - Localize headlines
   - Use appropriate colors
   - Match emoji culture
   - Relevant hashtags

3. **IP Detection**
   - Handle IP detection errors
   - Use fallback regions
   - Cache region data
   - Monitor accuracy

---

## Security Considerations

1. **Privacy**
   - Respect user privacy
   - Handle IP data securely
   - Don't store IPs
   - Comply with regulations

2. **Content Security**
   - Validate content
   - Sanitize inputs
   - Prevent injection
   - Audit changes

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

