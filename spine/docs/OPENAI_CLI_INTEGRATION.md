# OpenAI CLI Integration Guide

## Overview

The OpenAI CLI provides command-line access to OpenAI services, useful for:
- Managing API keys
- Testing models
- Running fine-tuning jobs
- Monitoring usage
- Batch operations

## Installation

### Option 1: npm (Node.js)
```bash
npm install -g openai
```

### Option 2: pip (Python)
```bash
pip install openai
```

## Configuration

### Set API Key
```bash
openai api_key set sk-your-api-key-here
```

### Verify Configuration
```bash
openai api_key show
```

## Common Commands

### List Models
```bash
openai models list
```

### Chat Completion
```bash
openai chat completions create \
  --model gpt-4o \
  --message "Hello, DreamNet!"
```

### With System Message
```bash
openai chat completions create \
  --model gpt-4o \
  --system "You are a DreamNet agent." \
  --message "Create a new dream"
```

### Function Calling
```bash
openai chat completions create \
  --model gpt-4o \
  --message "What's the weather?" \
  --functions '[
    {
      "name": "get_weather",
      "description": "Get weather for location",
      "parameters": {
        "type": "object",
        "properties": {
          "location": {"type": "string"}
        }
      }
    }
  ]'
```

### Fine-Tuning
```bash
# Create fine-tuning job
openai fine_tuning jobs create \
  --training_file file.jsonl \
  --model gpt-4o

# List fine-tuning jobs
openai fine_tuning jobs list

# Get job status
openai fine_tuning jobs get ft-job-123
```

### Embeddings
```bash
openai embeddings create \
  --model text-embedding-3-small \
  --input "DreamNet is awesome"
```

## Integration with DreamNet

### Script Example: Deploy via CLI

Create `scripts/deploy-openai-agent.sh`:
```bash
#!/bin/bash

# Set API key
export OPENAI_API_KEY=$(cat .env | grep OPENAI_API_KEY | cut -d '=' -f2)

# Test connection
openai models list

# Create fine-tuned model for DreamNet
openai fine_tuning jobs create \
  --training_file training/dreamnet-agent.jsonl \
  --model gpt-4o \
  --suffix dreamnet-agent

echo "✅ OpenAI agent deployed"
```

### Node.js Integration

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function deployOpenAIAgent() {
  try {
    const { stdout } = await execAsync(
      `openai fine_tuning jobs create --training_file training/dreamnet-agent.jsonl --model gpt-4o`
    );
    console.log('OpenAI agent deployed:', stdout);
    return JSON.parse(stdout);
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
}
```

## Environment Variables

The CLI respects these environment variables:
- `OPENAI_API_KEY` - Your API key
- `OPENAI_BASE_URL` - Custom base URL (for proxies)
- `OPENAI_ORG_ID` - Organization ID

## Best Practices

1. **Use CLI for Batch Operations**: CLI is great for one-off tasks and scripts
2. **Use SDK for Applications**: Use SDK (`openai` or `@openai/agents`) in your code
3. **Store API Key Securely**: Never commit API keys to git
4. **Monitor Usage**: Use `openai usage` to track API usage
5. **Test Locally**: Use CLI to test before integrating into code

## Troubleshooting

### API Key Not Found
```bash
# Set API key
openai api_key set YOUR_KEY

# Or export as env var
export OPENAI_API_KEY=YOUR_KEY
```

### Permission Denied
```bash
# Make sure CLI is in PATH
which openai

# Reinstall if needed
npm install -g openai
```

## Next Steps

1. Set up OpenAI CLI in your development environment
2. Test API connection
3. Create fine-tuning jobs for DreamNet-specific tasks
4. Integrate CLI commands into deployment scripts
5. Use CLI for monitoring and debugging

