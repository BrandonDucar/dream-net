# DreamNet Video Brand Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

DreamNet Video Brand Core provides **video branding and color grading** for DreamNet. It applies DreamNet's signature two-color palette (Neon Blue #17D6FF + Raspberry Red #FF2768) to videos with HSL/hue curve adjustments, glow/bloom effects, preset system, and skin tone protection.

---

## Key Features

### Brand Color Palette
- **Primary**: Neon Blue #17D6FF
- **Accent**: Raspberry Red #FF2768
- Two-color signature
- Consistent branding

### Video Grading
- HSL/Hue curve adjustments
- Glow effects
- Bloom effects
- Skin tone protection
- LUT (Look-Up Table) support

### Preset System
- DN_PeakPop-Heavy preset
- DN_PeakPop-Light preset
- Custom preset creation
- Preset management

### LUT Generation
- .cube file generation
- DaVinci Resolve compatible
- Premiere Pro compatible
- CapCut compatible

---

## Architecture

### Components

1. **Brand Grading Core** (`index.ts`)
   - Preset management
   - Grading application
   - LUT generation
   - Video processing

---

## API Reference

### Initialization

#### `new BrandGradingCore(): BrandGradingCore`
Creates Brand Grading Core instance.

**Example**:
```typescript
import { BrandGradingCore } from '@dreamnet/dreamnet-video-brand-core';

const brandGrading = new BrandGradingCore();
```

### Video Grading

#### `applyGrading(videoPath: string, presetId: string, outputPath?: string): Promise<string>`
Applies brand grading to video.

**Example**:
```typescript
const outputPath = await brandGrading.applyGrading(
  '/path/to/input.mp4',
  'DN_PeakPop-Heavy',
  '/path/to/output.mp4'
);

console.log(`Graded video: ${outputPath}`);
```

### Preset Management

#### `getPreset(id: string): BrandPreset | undefined`
Gets preset by ID.

**Example**:
```typescript
const preset = brandGrading.getPreset('DN_PeakPop-Heavy');
if (preset) {
  console.log(`Preset: ${preset.name}`);
  console.log(`Primary: ${preset.config.primaryColor}`);
  console.log(`Accent: ${preset.config.accentColor}`);
}
```

#### `listPresets(): BrandPreset[]`
Lists all presets.

**Example**:
```typescript
const presets = brandGrading.listPresets();
presets.forEach(preset => {
  console.log(`${preset.id}: ${preset.name}`);
});
```

#### `createCustomPreset(name: string, primaryColor: string, accentColor: string, intensity?: "light" | "heavy"): BrandPreset`
Creates custom preset.

**Example**:
```typescript
const customPreset = brandGrading.createCustomPreset(
  'Custom Brand',
  '#00FF00',
  '#FF00FF',
  'light'
);

console.log(`Created preset: ${customPreset.id}`);
```

### LUT Generation

#### `generateLUT(presetId: string): Promise<string>`
Generates LUT file from preset.

**Example**:
```typescript
const lutPath = await brandGrading.generateLUT('DN_PeakPop-Heavy');
console.log(`LUT file: ${lutPath}`);
```

---

## Data Models

### BrandGradingConfig

```typescript
interface BrandGradingConfig {
  primaryColor: string; // Neon Blue #17D6FF
  accentColor: string; // Raspberry Red #FF2768
  intensity: "light" | "heavy";
  protectSkinTones: boolean;
  glowIntensity: number; // 0-1
  bloomIntensity: number; // 0-1
}
```

### BrandPreset

```typescript
interface BrandPreset {
  id: string;
  name: string;
  config: BrandGradingConfig;
  lutFile?: string; // Path to .cube file
}
```

---

## Presets

### DN_PeakPop-Heavy
- **Intensity**: Heavy
- **Primary**: #17D6FF (Neon Blue)
- **Accent**: #FF2768 (Raspberry Red)
- **Glow**: 0.3
- **Bloom**: 0.2
- **Skin Protection**: Enabled

### DN_PeakPop-Light
- **Intensity**: Light
- **Primary**: #17D6FF (Neon Blue)
- **Accent**: #FF2768 (Raspberry Red)
- **Glow**: 0.15
- **Bloom**: 0.1
- **Skin Protection**: Enabled

---

## Video Processing Features

### HSL/Hue Curve Adjustments
- Color grading curves
- Hue shifts
- Saturation control
- Luminance adjustments

### Glow Effects
- Edge glow
- Color glow
- Intensity control
- Selective application

### Bloom Effects
- Highlight bloom
- Color bloom
- Intensity control
- Selective application

### Skin Tone Protection
- Skin tone detection
- Selective protection
- Natural skin preservation
- Color accuracy

---

## LUT Format

### .cube Format
- 33-point LUT
- Standard format
- Industry compatible
- DaVinci Resolve compatible
- Premiere Pro compatible
- CapCut compatible

---

## Integration Points

### DreamNet Systems
- **Media Vault**: Video storage
- **Social Media Poster**: Video posting
- **Whale Pack Core**: Commerce videos
- **Orca Pack Core**: Content videos

### External Systems
- **FFmpeg**: Video processing
- **Video Editors**: LUT import
- **Media Storage**: Video storage

---

## Usage Examples

### Apply Heavy Grading

```typescript
const output = await brandGrading.applyGrading(
  'input.mp4',
  'DN_PeakPop-Heavy',
  'output.mp4'
);
```

### Create Custom Preset

```typescript
const preset = brandGrading.createCustomPreset(
  'My Brand',
  '#00FF00',
  '#FF00FF',
  'light'
);

await brandGrading.applyGrading('input.mp4', preset.id);
```

### Generate LUT

```typescript
const lutPath = await brandGrading.generateLUT('DN_PeakPop-Heavy');
// Use LUT in video editor
```

---

## Best Practices

1. **Preset Selection**
   - Use Heavy for bold content
   - Use Light for subtle branding
   - Match content style
   - Test on sample footage

2. **Skin Tone Protection**
   - Always enable for people
   - Test skin tones
   - Adjust if needed
   - Preserve natural look

3. **LUT Usage**
   - Export LUTs for editors
   - Use in post-production
   - Maintain consistency
   - Test before final render

---

## Security Considerations

1. **Video Security**
   - Validate video files
   - Check file formats
   - Limit file sizes
   - Secure storage

2. **Processing Security**
   - Validate paths
   - Sanitize inputs
   - Monitor processing
   - Handle errors

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

