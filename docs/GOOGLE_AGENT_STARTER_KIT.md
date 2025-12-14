# Google Agent (Antigravity) Starter Kit

**Purpose:** Complete setup guide for integrating Antigravity agents with DreamNet

---

## 🎯 What is Antigravity?

Antigravity is Google's agent system that can work with DreamNet to:
- Deploy and manage Cloud Run services
- Execute agent tasks via the Spine agent interop system
- Coordinate with DreamNet's biomimetic architecture
- Use specialized prompts for different agent roles

---

## 📋 Prerequisites

### 1. Google Cloud Setup

```bash
# Install Google Cloud SDK
# https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login
gcloud auth application-default login

# Set project
export GCP_PROJECT_ID=your-project-id
export GCP_REGION=us-central1
gcloud config set project $GCP_PROJECT_ID
```

### 2. Environment Variables

Add to your `.env` file:

```bash
# Google Cloud Configuration
GCP_PROJECT_ID=your-project-id
GCP_REGION=us-central1
GCP_SERVICE_NAME=dreamnet

# Optional: Service Account Key (if not using default credentials)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

### 3. Install Dependencies

```bash
# Google Cloud SDK packages are already in package.json
pnpm install
```

---

## 🚀 Quick Start

### Step 1: Verify Google Cloud Access

```bash
# Test Google Cloud client
pnpm test:gcp

# Or manually test
node -e "
const { googleCloudClient } = require('./server/integrations/googleCloudClient');
googleCloudClient.verifyCredentials().then(console.log);
"
```

### Step 2: Configure Antigravity Provider

The `AntigravityProvider` stub is located at:
- `spine/agent-interop/AntigravityProvider.ts`

**Current Status:** Stub implementation - needs Antigravity to fill in

**What Antigravity Needs to Implement:**

1. **Initialize Method:**
   ```typescript
   async initialize(): Promise<void> {
     // Connect to Antigravity API
     // Authenticate with Google Cloud
     // Register with DreamNet Spine
   }
   ```

2. **Execute Task Method:**
   ```typescript
   async executeTask(task: AgentTask): Promise<AgentTaskResult> {
     // Execute agent task via Antigravity
     // Return result to DreamNet
   }
   ```

### Step 3: Use Antigravity Prompts

All prompts are ready in `docs/antigravity-prompts/`:

**Available Agent Roles:**

1. **SUPERVISOR_PROMPT.md** - Coordinates all agents
2. **DEPLOYER_PROMPT.md** - Handles deployments
3. **CARTOGRAPHER_PROMPT.md** - Maps dependencies
4. **SHIELD_BROWSER_AUDITOR_PROMPT.md** - Security audits
5. **COST_GOVERNOR_AUDITOR_PROMPT.md** - Cost analysis
6. **INTEGRATION_VALIDATOR_PROMPT.md** - Tests integrations
7. **ENTERPRISE_READINESS_PROMPT.md** - Enterprise prep

**How to Use:**

```bash
# Copy prompt to Antigravity
cat docs/antigravity-prompts/SUPERVISOR_PROMPT.md

# Or provide direct link to Antigravity
# Point Antigravity to: docs/antigravity-prompts/SUPERVISOR_PROMPT.md
```

---

## 🔧 Integration Points

### 1. Spine Agent Interop

**Location:** `spine/agent-interop/`

**Files:**
- `AntigravityProvider.ts` - Provider stub (needs implementation)
- `AgentInteropRegistry.ts` - Registry for all providers
- `ProviderDescriptor.ts` - Provider interface

**How to Register:**

```typescript
import { AgentInteropRegistry } from './spine/agent-interop';
import { AntigravityProvider } from './spine/agent-interop/AntigravityProvider';

const registry = new AgentInteropRegistry();
registry.registerProvider('antigravity', new AntigravityProvider({
  name: 'antigravity',
  type: 'google-cloud',
  capabilities: ['deploy', 'manage', 'execute']
}));
```

### 2. Google Cloud Client

**Location:** `server/integrations/googleCloudClient.ts`

**Available Services:**
- Cloud Run (serverless containers)
- Cloud Storage (file storage)
- Cloud Build (CI/CD)
- Cloud Functions (serverless functions)

**Usage:**

```typescript
import { googleCloudClient } from './server/integrations/googleCloudClient';

// Verify credentials
await googleCloudClient.verifyCredentials();

// Deploy to Cloud Run
await googleCloudClient.deployToCloudRun({
  serviceName: 'dreamnet',
  image: 'gcr.io/project/dreamnet:latest',
  region: 'us-central1'
});
```

### 3. DreamNet OS Integration

**Location:** `server/core/dreamnet-os.ts`

Antigravity agents can interact with DreamNet OS via:
- Agent registry
- Task execution
- Event bus

---

## 📝 Available Prompts for Antigravity

### Priority 1: Supervisor

**File:** `docs/antigravity-prompts/SUPERVISOR_PROMPT.md`

**Purpose:** Coordinate all Antigravity agents

**Key Tasks:**
- Coordinate integration validation
- Coordinate enterprise readiness
- Prioritize tasks across agents
- Ensure production readiness

### Priority 2: Deployer

**File:** `docs/antigravity-prompts/DEPLOYER_PROMPT.md`

**Purpose:** Handle deployments

**Key Tasks:**
- Deploy SLU contracts
- Deploy to Cloud Run
- Test deployment scenarios
- Create deployment documentation

### Priority 3: Integration Validator

**File:** `docs/antigravity-prompts/INTEGRATION_VALIDATOR_PROMPT.md`

**Purpose:** Test all 19 integrations

**Key Tasks:**
- Test all package initializations
- Create comprehensive test suite
- Validate API endpoints
- Performance benchmarking

---

## 🎯 Immediate Actions

### For Antigravity to Get Started:

1. **Read Supervisor Prompt:**
   ```
   docs/antigravity-prompts/SUPERVISOR_PROMPT.md
   ```

2. **Review Quick Start:**
   ```
   docs/antigravity-prompts/ANTIGRAVITY_QUICK_START.md
   ```

3. **Check SLU System:**
   ```
   docs/antigravity-prompts/SLU_SYSTEM_READY_FOR_ANTIGRAVITY.md
   ```

4. **Review Deployment Status:**
   ```
   docs/GOOGLE_CLOUD_DEPLOYMENT_STATUS.md
   ```

### For You to Enable Antigravity:

1. **Grant Antigravity Access:**
   - Google Cloud project access
   - Repository access (if needed)
   - API keys (if needed)

2. **Provide Context:**
   - Point to `docs/antigravity-prompts/SUPERVISOR_PROMPT.md`
   - Share this starter kit
   - Provide GCP project details

3. **Monitor Progress:**
   - Check Cloud Run deployments
   - Review agent task execution
   - Monitor integration tests

---

## 🔍 Testing Antigravity Integration

### Test 1: Verify Google Cloud Access

```bash
# Test credentials
curl http://localhost:3000/api/google-cloud/status
```

### Test 2: Test Antigravity Provider

```typescript
// Once AntigravityProvider is implemented
import { AntigravityProvider } from './spine/agent-interop/AntigravityProvider';

const provider = new AntigravityProvider({
  name: 'antigravity',
  type: 'google-cloud'
});

await provider.initialize();
const result = await provider.executeTask({
  type: 'deploy',
  target: 'cloud-run',
  config: { serviceName: 'dreamnet' }
});
```

### Test 3: Execute Agent Task via Spine

```bash
# Via API
curl -X POST http://localhost:3000/api/spine/agent/task \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "antigravity",
    "task": {
      "type": "deploy",
      "target": "cloud-run"
    }
  }'
```

---

## 📚 Additional Resources

### Documentation:
- `docs/antigravity-prompts/ANTIGRAVITY_QUICK_START.md` - Complete quick start
- `docs/antigravity-prompts/ANTIGRAVITY_PROMPTS_SUMMARY.md` - All prompts summary
- `docs/GOOGLE_CLOUD_DEPLOYMENT_STATUS.md` - Current deployment status
- `DEPLOYMENT_NOTES_GOOGLE.md` - Complete deployment guide

### Code:
- `spine/agent-interop/AntigravityProvider.ts` - Provider stub
- `server/integrations/googleCloudClient.ts` - Google Cloud client
- `server/core/dreamnet-os.ts` - DreamNet OS integration
- `cloudbuild.yaml` - Cloud Build configuration

### Prompts:
- All prompts in `docs/antigravity-prompts/` directory

---

## ✅ Checklist

- [ ] Google Cloud SDK installed
- [ ] Authenticated with `gcloud auth`
- [ ] Environment variables set
- [ ] Google Cloud client tested
- [ ] AntigravityProvider implemented (by Antigravity)
- [ ] Antigravity prompts reviewed
- [ ] Integration tested
- [ ] Deployment verified

---

## 🆘 Troubleshooting

### Issue: "Not implemented - Antigravity will implement"

**Solution:** AntigravityProvider is a stub. Antigravity needs to implement it.

### Issue: Google Cloud credentials not found

**Solution:**
```bash
gcloud auth application-default login
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
```

### Issue: Can't access Cloud Run

**Solution:** Verify IAM permissions:
```bash
gcloud projects get-iam-policy $GCP_PROJECT_ID
```

---

**Next Step:** Share this starter kit with Antigravity and point them to `docs/antigravity-prompts/SUPERVISOR_PROMPT.md`

