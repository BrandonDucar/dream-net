# DreamNet Bridge - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

DreamNet Bridge provides **integration layer for Cursor IDE** to communicate with DreamNet's autonomous agents. It enables Cursor to delegate tasks to specialized DreamNet agents for system status, economic analysis, DevOps operations, and wallet intelligence.

---

## Key Features

### Agent Integration
- DreamNet Agent client
- Autonomous queries
- Specialized agent access
- API key management

### Specialized Functions

1. **System Status** (`dnStatus`)
   - System health monitoring
   - Infrastructure status
   - Agent status
   - Overall health

2. **Economic Brain** (`dnEconomy`)
   - Token intelligence
   - Liquidity analysis
   - Economic queries
   - Financial insights

3. **DevOps / DeployKeeper** (`dnDevOps`)
   - Deployment status
   - Infrastructure queries
   - DevOps recommendations
   - Service management

4. **Wallet Intelligence** (`dnWalletIntel`)
   - Portfolio analytics
   - Wallet analysis
   - READ_ONLY mode
   - Security-first design

5. **OPS Contract** (`dnOpsContract`)
   - OPS_CONTRACT summary
   - Contract loading
   - Integration count
   - Environment variables

6. **OPS Validation** (`dnOpsValidate`)
   - Repository validation
   - Contract validation
   - Error reporting
   - Warning detection

---

## Architecture

### Components

1. **Agent Singleton**
   - Single agent instance
   - API key management
   - Base URL configuration
   - Error handling

2. **Specialized Functions**
   - System status queries
   - Economic queries
   - DevOps queries
   - Wallet queries
   - OPS queries

---

## API Reference

### System Status

#### `dnStatus(): Promise<string>`
Gets DreamNet system status.

**Example**:
```typescript
import { dnStatus } from '@dreamnet/dreamnet-bridge';

const status = await dnStatus();
console.log(status);
```

### Economic Brain

#### `dnEconomy(query: string): Promise<string>`
Queries economic/token/liquidity questions.

**Example**:
```typescript
import { dnEconomy } from '@dreamnet/dreamnet-bridge';

const analysis = await dnEconomy("Show me DREAM token liquidity across all pairs");
console.log(analysis);
```

### DevOps / DeployKeeper

#### `dnDevOps(query: string): Promise<string>`
Queries deployment and infrastructure questions.

**Example**:
```typescript
import { dnDevOps } from '@dreamnet/dreamnet-bridge';

const summary = await dnDevOps("Get deployment summary for DreamNet");
console.log(summary);
```

### Wallet Intelligence

#### `dnWalletIntel(query: string): Promise<string>`
Queries wallet and portfolio analytics.

**Example**:
```typescript
import { dnWalletIntel } from '@dreamnet/dreamnet-bridge';

const intel = await dnWalletIntel("Analyze portfolio for wallet 0x123...");
console.log(intel);
```

**Security Note**: READ_ONLY mode - never accepts private keys, seeds, or mnemonics.

### OPS Contract

#### `dnOpsContract(): Promise<string>`
Gets OPS_CONTRACT summary.

**Example**:
```typescript
import { dnOpsContract } from '@dreamnet/dreamnet-bridge';

const contract = await dnOpsContract();
console.log(contract);
```

### OPS Validation

#### `dnOpsValidate(): Promise<string>`
Validates repository setup against OPS_CONTRACT.

**Example**:
```typescript
import { dnOpsValidate } from '@dreamnet/dreamnet-bridge';

const validation = await dnOpsValidate();
console.log(validation);
```

### Agent Management

#### `resetAgent(): void`
Resets agent instance.

**Example**:
```typescript
import { resetAgent } from '@dreamnet/dreamnet-bridge';

resetAgent(); // Useful for testing or re-initialization
```

---

## Configuration

### Environment Variables

- **DREAMNET_API_KEY**: Required API key for DreamNet agent
- **DREAMNET_API_URL**: Optional API URL (defaults to `https://api.dreamnet.ink`)

### Example `.env`:

```env
DREAMNET_API_KEY=your-api-key-here
DREAMNET_API_URL=https://api.dreamnet.ink
```

---

## Usage Examples

### System Status

```typescript
const status = await dnStatus();
// Returns: System status JSON with infrastructure, agents, health
```

### Economic Analysis

```typescript
const analysis = await dnEconomy("What's the current DREAM/SHEEP liquidity?");
// Returns: Economic analysis with liquidity data
```

### DevOps Query

```typescript
const summary = await dnDevOps("What's the deployment status?");
// Returns: Deployment summary with affected services
```

### Wallet Intelligence

```typescript
const intel = await dnWalletIntel("Analyze wallet 0x123...");
// Returns: Wallet analytics (READ_ONLY, no keys accepted)
```

### OPS Contract

```typescript
const contract = await dnOpsContract();
// Returns: OPS_CONTRACT summary with version, integrations, env vars
```

### OPS Validation

```typescript
const validation = await dnOpsValidate();
// Returns: Validation results with errors and warnings
```

---

## Security Considerations

### Wallet Intelligence Security
- **READ_ONLY Mode**: Never accepts private keys, seeds, or mnemonics
- **Public Data Only**: Analyzes public blockchain data
- **No Key Storage**: Does not store or transmit keys
- **Secure Queries**: Validates queries before execution

### API Key Security
- **Environment Variables**: Store API keys in `.env`
- **Never Commit**: Do not commit API keys to git
- **Rotate Regularly**: Rotate API keys periodically
- **Monitor Usage**: Track API key usage

### Agent Security
- **Validation**: Validates queries before execution
- **Error Handling**: Handles errors securely
- **Rate Limiting**: Respects rate limits
- **Audit Logging**: Logs all queries

---

## Integration Points

### Cursor IDE
- Direct integration
- Code completion
- Query assistance
- Status monitoring

### DreamNet Systems
- DreamNet Agent Client
- OPS Sentinel
- All DreamNet subsystems

### External Systems
- DreamNet API
- Blockchain APIs
- Analytics systems

---

## Best Practices

1. **Query Design**
   - Be specific in queries
   - Use clear language
   - Include context
   - Request structured data

2. **Error Handling**
   - Handle errors gracefully
   - Check for null responses
   - Validate responses
   - Log errors

3. **Security**
   - Never pass private keys
   - Use environment variables
   - Rotate API keys
   - Monitor usage

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

