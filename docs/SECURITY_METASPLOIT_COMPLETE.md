# Security Metasploit - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Security Metasploit provides **security testing framework integration** for DreamNet's Military vertical. It integrates with Metasploit framework for penetration testing, vulnerability assessment, and security research, enabling authorized security testing and threat assessment.

---

## Key Features

### Security Testing
- Exploit search
- Exploit execution
- Session management
- Vulnerability assessment

### API Integration
- Metasploit API integration
- Exploit database access
- Session management
- Error handling

---

## Architecture

### Components

1. **Metasploit Framework** (`MetasploitFramework.ts`)
   - API client wrapper
   - Exploit operations
   - Session management

---

## API Reference

### Initialization

#### `new MetasploitFramework(config: MetasploitConfig): MetasploitFramework`
Creates Metasploit framework client instance.

**Example**:
```typescript
import { MetasploitFramework } from '@dreamnet/security-metasploit';

const metasploit = new MetasploitFramework({
  apiUrl: 'https://metasploit.example.com',
  apiKey: process.env.METASPLOIT_API_KEY,
});
```

### Exploit Operations

#### `searchExploits(query: string): Promise<Exploit[]>`
Searches for exploits.

**Example**:
```typescript
const exploits = await metasploit.searchExploits('apache');
exploits.forEach(exploit => {
  console.log(`${exploit.name}: ${exploit.description}`);
});
```

#### `executeExploit(exploitName: string, target: string, options?: Record<string, any>): Promise<ExploitResult>`
Executes exploit.

**Example**:
```typescript
const result = await metasploit.executeExploit(
  'exploit/linux/http/apache_mod_cgi_bash_env_exec',
  '192.168.1.100',
  { RHOST: '192.168.1.100', RPORT: 80 }
);

if (result.success) {
  console.log(`Session ID: ${result.sessionId}`);
}
```

### Session Operations

#### `listSessions(): Promise<Array<{ id: string; type: string; info: string }>>`
Lists active sessions.

**Example**:
```typescript
const sessions = await metasploit.listSessions();
sessions.forEach(session => {
  console.log(`Session ${session.id}: ${session.type}`);
});
```

---

## Data Models

### MetasploitConfig

```typescript
interface MetasploitConfig {
  apiUrl: string;
  apiKey: string;
}
```

### Exploit

```typescript
interface Exploit {
  name: string;
  fullname: string;
  rank: string;
  description: string;
  platform: string[];
  targets?: Array<{ name: string; index: number }>;
}
```

### ExploitResult

```typescript
interface ExploitResult {
  success: boolean;
  sessionId?: string;
  error?: string;
  output?: string;
}
```

---

## Security Considerations

### Authorization
- **CRITICAL**: Only use on authorized systems
- Require explicit permission
- Document all testing
- Follow responsible disclosure

### Legal Compliance
- Obtain written authorization
- Follow local laws
- Respect privacy
- Report vulnerabilities responsibly

---

## Integration Points

### DreamNet Systems
- **Military Vertical**: Security testing
- **Guardian Framework Core**: Security operations
- **DreamNet Audit Core**: Security audit trails
- **DreamNet Alerts Core**: Security alerts

---

## Usage Examples

### Search and Execute Exploit

```typescript
const metasploit = new MetasploitFramework({
  apiUrl: process.env.METASPLOIT_API_URL,
  apiKey: process.env.METASPLOIT_API_KEY,
});

const exploits = await metasploit.searchExploits('apache');
const exploit = exploits[0];

// ONLY execute on authorized systems
const result = await metasploit.executeExploit(
  exploit.name,
  'authorized-target',
  {}
);
```

---

## Best Practices

1. **Security Testing**
   - **ALWAYS** get authorization
   - Document all activities
   - Follow responsible disclosure
   - Use in isolated environments

2. **Exploit Management**
   - Verify exploit compatibility
   - Test in safe environments
   - Monitor execution
   - Clean up sessions

---

## Security Warnings

### ⚠️ CRITICAL WARNINGS

1. **Authorization Required**
   - NEVER use without explicit authorization
   - Only test systems you own or have permission to test
   - Document all authorization

2. **Legal Compliance**
   - Follow all applicable laws
   - Respect privacy and data protection
   - Report vulnerabilities responsibly

3. **Ethical Use**
   - Use only for legitimate security testing
   - Do not use for malicious purposes
   - Follow responsible disclosure practices

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27  
**Warning**: This system is for authorized security testing only. Unauthorized use is illegal and unethical.

