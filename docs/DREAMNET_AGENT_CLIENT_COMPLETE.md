# DreamNet Agent Client - Complete Documentation

**Package**: `@dreamnet/dreamnet-agent-client`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

DreamNet Agent Client provides **TypeScript/JavaScript client** for ChatGPT Agent Mode and other integrations. It enables AI agents to interact with DreamNet's API with retry logic, timeout handling, and natural language interfaces.

### Key Features

- **Natural Language Interface**: Query DreamNet using natural language
- **Retry Logic**: Exponential backoff for failed requests
- **Timeout Handling**: Configurable request timeouts
- **Context API**: Get contextual metadata about DreamNet
- **Vercel Integration**: List and manage Vercel projects
- **Cleanup Analysis**: Analyze cleanup opportunities

---

## API Reference

### Classes

#### `DreamNetAgent`

**Constructor**:
```typescript
constructor(options: DreamNetAgentOptions | string)
```

**Methods**:
- **`getContext(): Promise<any>`**: Get DreamNet context
- **`autonomousQuery(message, options?): Promise<any>`**: Natural language query
- **`checkSystemStatus(): Promise<any>`**: Check system status
- **`listVercelProjects(): Promise<any>`**: List Vercel projects
- **`getVercelProject(name): Promise<any>`**: Get Vercel project
- **`analyzeCleanupOpportunities(params?): Promise<any>`**: Analyze cleanup

**Environment Variables**: `DREAMNET_API_KEY`

---

**Status**: ✅ Implemented

