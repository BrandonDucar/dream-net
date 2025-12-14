# Music MusicGen - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Music MusicGen provides **AI music generation** integration for DreamNet's DreamStar Music vertical. It integrates with Facebook's MusicGen AI models for text-to-music generation, enabling users to create music from natural language descriptions using Hugging Face's inference API.

---

## Key Features

### Music Generation
- Text-to-music conversion
- Multiple model sizes (small, medium, large)
- Duration control
- Temperature and sampling controls

### API Integration
- Hugging Face Inference API
- Model selection
- API key authentication
- Error handling

---

## Architecture

### Components

1. **MusicGen Client** (`MusicGenClient.ts`)
   - Hugging Face API wrapper
   - Music generation
   - Configuration management

---

## API Reference

### Initialization

#### `new MusicGenClient(config?: MusicGenConfig): MusicGenClient`
Creates MusicGen client instance.

**Example**:
```typescript
import { MusicGenClient } from '@dreamnet/music-musicgen';

const client = new MusicGenClient({
  apiUrl: 'https://api-inference.huggingface.co/models/facebook/musicgen-medium',
  apiKey: process.env.HUGGINGFACE_API_KEY,
  model: 'facebook/musicgen-medium',
});
```

### Music Generation

#### `generateMusic(request: MusicGenerationRequest): Promise<MusicGenerationResult>`
Generates music from text description.

**Example**:
```typescript
const result = await client.generateMusic({
  text: 'A peaceful acoustic guitar melody',
  duration: 30, // seconds
  temperature: 1.0,
  topK: 250,
  topP: 0.0,
});

if (result.success) {
  console.log(`Generated ${result.duration}s of music`);
  // Use result.audioData or result.audioUrl
}
```

#### `generateMusicUrl(text: string, duration?: number): Promise<MusicGenerationResult>`
Generates music and returns URL.

**Example**:
```typescript
const result = await client.generateMusicUrl('Upbeat electronic dance music', 60);
if (result.success && result.audioUrl) {
  console.log(`Music URL: ${result.audioUrl}`);
}
```

---

## Data Models

### MusicGenConfig

```typescript
interface MusicGenConfig {
  apiUrl?: string;
  apiKey?: string;
  model?: "facebook/musicgen-small" | "facebook/musicgen-medium" | "facebook/musicgen-large";
}
```

### MusicGenerationRequest

```typescript
interface MusicGenerationRequest {
  text: string;
  duration?: number; // seconds
  temperature?: number;
  topK?: number;
  topP?: number;
  model?: string;
}
```

### MusicGenerationResult

```typescript
interface MusicGenerationResult {
  success: boolean;
  audioUrl?: string;
  audioData?: ArrayBuffer;
  duration?: number;
  error?: string;
}
```

---

## Model Sizes

### Small (`facebook/musicgen-small`)
- Fastest generation
- Lower quality
- Good for testing

### Medium (`facebook/musicgen-medium`)
- Balanced speed/quality
- Default model
- Recommended for most use cases

### Large (`facebook/musicgen-large`)
- Highest quality
- Slower generation
- Best for production

---

## Integration Points

### DreamNet Systems
- **DreamStar Music**: Music generation vertical
- **Media Vault**: Audio storage
- **Social Hub Core**: Music sharing
- **Dream Vault**: Music templates

---

## Usage Examples

### Generate Music

```typescript
const client = new MusicGenClient({
  apiKey: process.env.HUGGINGFACE_API_KEY,
  model: 'facebook/musicgen-medium',
});

const result = await client.generateMusic({
  text: 'Upbeat electronic dance music',
  duration: 60,
});
```

---

## Best Practices

1. **Music Generation**
   - Use descriptive prompts
   - Experiment with parameters
   - Consider model size
   - Cache generated music

2. **API Management**
   - Secure API keys
   - Handle rate limits
   - Monitor usage
   - Cache results

---

## Security Considerations

1. **API Security**
   - Secure API keys
   - Use environment variables
   - Validate inputs
   - Monitor usage

2. **Content Security**
   - Validate generated content
   - Check copyright compliance
   - Store securely
   - Control access

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

