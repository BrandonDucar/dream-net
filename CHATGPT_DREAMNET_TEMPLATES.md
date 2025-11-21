# 🤖 ChatGPT Agent Mode - DreamNet Request Templates

**Ready-to-use code templates for ChatGPT to call DreamNet API**

---

## 🔐 Authentication Setup

**Base URL:** `https://dreamnet.ink`  
**API Key:** `dn_live_YOUR_KEY_HERE` (replace with actual key)

**Headers (use for ALL requests):**
```javascript
const headers = {
  'Authorization': 'Bearer dn_live_YOUR_KEY_HERE',
  'Content-Type': 'application/json'
};
```

---

## 📋 JavaScript/TypeScript Templates

### Template 1: GET Request (Read Data)

```javascript
async function dreamNetGet(endpoint) {
  const response = await fetch(`https://dreamnet.ink${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer dn_live_YOUR_KEY_HERE',
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`DreamNet API error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

// Usage:
const status = await dreamNetGet('/api/heartbeat');
const projects = await dreamNetGet('/api/vercel/projects');
```

### Template 2: POST Request (Create/Send Data)

```javascript
async function dreamNetPost(endpoint, body) {
  const response = await fetch(`https://dreamnet.ink${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer dn_live_YOUR_KEY_HERE',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(`DreamNet API error: ${response.status} - ${error.error || error.message || response.statusText}`);
  }
  
  return await response.json();
}

// Usage:
const chatResponse = await dreamNetPost('/api/chatgpt-agent/chat', {
  message: 'Show me DreamNet status'
});
```

### Template 3: Natural Language Interface

```javascript
async function dreamNetChat(message) {
  // Step 1: Send natural language message
  const chatResponse = await dreamNetPost('/api/chatgpt-agent/chat', { message });
  
  // Step 2: Execute suggested actions
  const results = [];
  for (const action of chatResponse.actions || []) {
    try {
      const result = await dreamNetGet(action.endpoint);
      results.push({ action: action.type, data: result });
    } catch (error) {
      results.push({ action: action.type, error: error.message });
    }
  }
  
  return { chatResponse, results };
}

// Usage:
const response = await dreamNetChat('List all Vercel projects');
// Automatically executes suggested endpoints and returns results
```

### Template 4: Get Context (Auto-Discovery)

```javascript
async function dreamNetGetContext() {
  const context = await dreamNetGet('/api/chatgpt-agent/context');
  return context.context; // Returns all capabilities and endpoints
}

// Usage:
const capabilities = await dreamNetGetContext();
// Now you know what DreamNet can do!
```

### Template 5: Error Handling with Retries

```javascript
async function dreamNetRequest(endpoint, options = {}, retries = 3) {
  const defaultHeaders = {
    'Authorization': 'Bearer dn_live_YOUR_KEY_HERE',
    'Content-Type': 'application/json'
  };
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`https://dreamnet.ink${endpoint}`, {
        ...options,
        headers: { ...defaultHeaders, ...options.headers }
      });
      
      if (response.status === 429) {
        // Rate limited - wait and retry
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        }
      }
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(`DreamNet API error: ${response.status} - ${error.error || error.message || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
    }
  }
}

// Usage:
const data = await dreamNetRequest('/api/heartbeat', { method: 'GET' });
```

---

## 🐍 Python Templates

### Template 1: GET Request

```python
import requests

def dreamnet_get(endpoint):
    headers = {
        'Authorization': 'Bearer dn_live_YOUR_KEY_HERE',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(f'https://dreamnet.ink{endpoint}', headers=headers)
    response.raise_for_status()
    return response.json()

# Usage:
status = dreamnet_get('/api/heartbeat')
projects = dreamnet_get('/api/vercel/projects')
```

### Template 2: POST Request

```python
import requests

def dreamnet_post(endpoint, body):
    headers = {
        'Authorization': 'Bearer dn_live_YOUR_KEY_HERE',
        'Content-Type': 'application/json'
    }
    
    response = requests.post(
        f'https://dreamnet.ink{endpoint}',
        headers=headers,
        json=body
    )
    response.raise_for_status()
    return response.json()

# Usage:
chat_response = dreamnet_post('/api/chatgpt-agent/chat', {
    'message': 'Show me DreamNet status'
})
```

### Template 3: Natural Language Interface

```python
import requests

def dreamnet_chat(message):
    # Step 1: Send natural language message
    chat_response = dreamnet_post('/api/chatgpt-agent/chat', {'message': message})
    
    # Step 2: Execute suggested actions
    results = []
    for action in chat_response.get('actions', []):
        try:
            result = dreamnet_get(action['endpoint'])
            results.append({'action': action['type'], 'data': result})
        except Exception as e:
            results.append({'action': action['type'], 'error': str(e)})
    
    return {'chatResponse': chat_response, 'results': results}

# Usage:
response = dreamnet_chat('List all Vercel projects')
```

---

## 🔧 Common DreamNet Operations

### 1. Check System Status

```javascript
async function checkDreamNetStatus() {
  const status = await dreamNetGet('/api/heartbeat');
  return {
    healthy: status.status === 'healthy',
    cores: status.cores,
    packs: status.packs,
    subsystems: status.subsystems
  };
}
```

### 2. List Vercel Projects

```javascript
async function listVercelProjects() {
  const projects = await dreamNetGet('/api/vercel/projects');
  return projects.projects || [];
}
```

### 3. Analyze Vercel Cleanup

```javascript
async function analyzeVercelCleanup(targetDomain = 'dreamnet.ink') {
  const analysis = await dreamNetGet(`/api/vercel/analyze?targetDomain=${targetDomain}`);
  return analysis.actions || [];
}
```

### 4. Get Shield Core Threats

```javascript
async function getShieldThreats() {
  const threats = await dreamNetGet('/api/shield/threats');
  return threats.threats || [];
}
```

### 5. Query Dreams

```javascript
async function listDreams() {
  const dreams = await dreamNetGet('/api/dreams');
  return dreams.dreams || dreams || [];
}
```

### 6. Get Wolf Pack Opportunities

```javascript
async function getWolfPackOpportunities() {
  const opportunities = await dreamNetGet('/api/wolf-pack/opportunities');
  return opportunities.opportunities || opportunities || [];
}
```

---

## 🎯 Complete Example: Autonomous DreamNet Agent

```javascript
class DreamNetAgent {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://dreamnet.ink';
  }
  
  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(`DreamNet API error: ${response.status} - ${error.error || error.message}`);
    }
    
    return await response.json();
  }
  
  async getContext() {
    return this.request('/api/chatgpt-agent/context');
  }
  
  async chat(message) {
    return this.request('/api/chatgpt-agent/chat', {
      method: 'POST',
      body: { message }
    });
  }
  
  async executeAction(action, params = {}) {
    return this.request('/api/chatgpt-agent/execute', {
      method: 'POST',
      body: { action, params }
    });
  }
  
  async getStatus() {
    return this.request('/api/heartbeat');
  }
  
  async listVercelProjects() {
    return this.request('/api/vercel/projects');
  }
  
  async analyzeVercelCleanup(targetDomain = 'dreamnet.ink') {
    return this.request(`/api/vercel/analyze?targetDomain=${targetDomain}`);
  }
  
  async autonomousQuery(userQuery) {
    // 1. Get context
    const context = await this.getContext();
    
    // 2. Chat with DreamNet
    const chatResponse = await this.chat(userQuery);
    
    // 3. Execute suggested actions
    const results = [];
    for (const action of chatResponse.actions || []) {
      try {
        const endpoint = action.endpoint.replace('GET ', '').replace('POST ', '');
        const method = action.endpoint.startsWith('POST') ? 'POST' : 'GET';
        const result = await this.request(endpoint, { method });
        results.push({ action: action.type, success: true, data: result });
      } catch (error) {
        results.push({ action: action.type, success: false, error: error.message });
      }
    }
    
    return {
      query: userQuery,
      understood: chatResponse.understood,
      suggestions: chatResponse.suggestions,
      results
    };
  }
}

// Usage:
const agent = new DreamNetAgent('dn_live_YOUR_KEY_HERE');

// Autonomous query
const response = await agent.autonomousQuery('Show me DreamNet status and list Vercel projects');
console.log(response);

// Direct operations
const status = await agent.getStatus();
const projects = await agent.listVercelProjects();
```

---

## 🔒 Security Best Practices

### 1. Never Expose API Key
```javascript
// ❌ BAD - Don't hardcode in client-side code
const apiKey = 'dn_live_...';

// ✅ GOOD - Use environment variable or secure storage
const apiKey = process.env.DREAMNET_API_KEY;
```

### 2. Validate Responses
```javascript
async function safeDreamNetRequest(endpoint) {
  try {
    const response = await dreamNetGet(endpoint);
    // Validate response structure
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response format');
    }
    return response;
  } catch (error) {
    console.error('DreamNet request failed:', error);
    throw error;
  }
}
```

### 3. Handle Rate Limits
```javascript
async function rateLimitedRequest(endpoint, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await dreamNetGet(endpoint);
    } catch (error) {
      if (error.message.includes('429') && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
        continue;
      }
      throw error;
    }
  }
}
```

---

## 📊 Response Structure Examples

### Heartbeat Response
```json
{
  "status": "healthy",
  "timestamp": 1234567890,
  "cores": {
    "dreamSnailCore": { "status": "active" },
    "shieldCore": { "status": "active" }
  },
  "packs": {
    "wolfPack": { "status": "active" }
  }
}
```

### Chat Response
```json
{
  "success": true,
  "message": "Show me DreamNet status",
  "understood": true,
  "actions": [
    {
      "type": "get_status",
      "endpoint": "GET /api/heartbeat",
      "description": "Get DreamNet system status"
    }
  ],
  "suggestions": ["Try: GET /api/heartbeat"]
}
```

### Vercel Projects Response
```json
{
  "success": true,
  "projects": [
    {
      "id": "prj_...",
      "name": "dreamnet.ink",
      "framework": "nextjs"
    }
  ],
  "count": 1
}
```

---

## 🚀 Quick Start for ChatGPT

**Copy this into ChatGPT:**

```javascript
// DreamNet API Helper
const DREAMNET_API_KEY = 'dn_live_YOUR_KEY_HERE';
const DREAMNET_BASE = 'https://dreamnet.ink';

async function dreamNet(method, endpoint, body) {
  const response = await fetch(`${DREAMNET_BASE}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${DREAMNET_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return await response.json();
}

// Get context
const context = await dreamNet('GET', '/api/chatgpt-agent/context');

// Chat with DreamNet
const chat = await dreamNet('POST', '/api/chatgpt-agent/chat', {
  message: 'Show me DreamNet status'
});

// Execute suggested actions
for (const action of chat.actions) {
  const endpoint = action.endpoint.replace('GET ', '').replace('POST ', '');
  const method = action.endpoint.startsWith('POST') ? 'POST' : 'GET';
  const result = await dreamNet(method, endpoint);
  console.log(action.type, result);
}
```

---

**Ready to use!** ChatGPT can copy these templates and start calling DreamNet immediately! 🚀














