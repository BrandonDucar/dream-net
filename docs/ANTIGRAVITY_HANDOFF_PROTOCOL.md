# Antigravity Handoff Protocol

**Purpose**: Define when and how we hand off work between me (Composer) and Antigravity.

---

## Division of Labor

### My Responsibilities (Composer)
**Focus Areas**:
- ✅ Frontend development (React, landing pages, Mini Apps)
- ✅ Deployment automation (Cloud Build, Docker, CI/CD)
- ✅ User-facing features (UI/UX, Mini Apps section)
- ✅ Documentation and planning
- ✅ Build processes and static assets

**What I Handle**:
- Landing page updates
- Mini Apps frontend
- Client build (`client/dist/`)
- Deployment scripts (`cloudbuild.yaml`, `Dockerfile`)
- Frontend routing (`client/src/App.tsx`)
- User experience improvements

---

### Antigravity's Responsibilities
**Focus Areas**:
- ✅ Server restoration (layer-by-layer)
- ✅ Backend subsystem integration
- ✅ Server testing and debugging
- ✅ Incremental server feature addition
- ✅ Server route implementation

**What Antigravity Handles**:
- Server layer deployment (Tier II/III/IV subsystems)
- Backend API routes (`server/routes/`)
- Server initialization (`server/index.ts`)
- Subsystem integration
- Server debugging and testing

---

## Handoff Scenarios

### Scenario 1: I → Antigravity (Server Work)

**When**: 
- Need to deploy server layers (Tier II/III subsystems)
- Server debugging needed
- Backend route implementation
- Subsystem integration

**How**:
1. I create a handoff document in `docs/antigravity-prompts/`
2. Document what needs to be done
3. Include current state, desired state, and steps
4. Antigravity picks up from there

**Example**:
```
docs/antigravity-prompts/DEPLOY_LAYER_TWO.md
```

---

### Scenario 2: Antigravity → Me (Frontend/Deployment)

**When**:
- Server layer deployed successfully
- Need frontend integration
- Need deployment automation
- Need user-facing features

**How**:
1. Antigravity creates status document in `docs/`
2. Documents what was completed
3. Notes any frontend/deployment needs
4. I pick up frontend/deployment work

**Example**:
```
docs/ANTIGRAVITY_STATUS_UPDATE.md
```

---

## Communication Format

### Handoff Documents

**Location**: `docs/antigravity-prompts/` or `docs/`

**Format**:
```markdown
# [Title]

**Date**: YYYY-MM-DD
**From**: [Composer/Antigravity]
**To**: [Antigravity/Composer]

## Current State
[What's currently deployed/working]

## Desired State
[What needs to be achieved]

## Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Success Criteria
- ✅ [Criterion 1]
- ✅ [Criterion 2]

## Notes
[Any additional context]
```

---

## Status Tracking

### Current Status Files

**My Status**:
- `PRODUCTION_SITE_ANALYSIS.md` - Frontend deployment status
- `docs/ANTIGRAVITY_LAYER_DEPLOYMENT_STATUS.md` - Layer deployment status

**Antigravity Status**:
- `docs/ANTIGRAVITY_STATUS_UPDATE.md` - Server work status
- `docs/ANTIGRAVITY_HANDOFF_2025.md` - Previous handoffs

---

## Workflow Examples

### Example 1: Deploy Layer Two

**Me**:
1. Creates `docs/antigravity-prompts/DEPLOY_LAYER_TWO.md`
2. Documents current state (Layer 1 deployed)
3. Documents desired state (Layer 2 deployed)
4. Provides deployment guide

**Antigravity**:
1. Reads handoff document
2. Deploys Layer Two (Tier II subsystems)
3. Tests deployment
4. Creates status update document
5. Notes any frontend/deployment needs

**Me**:
1. Reads status update
2. Updates frontend if needed
3. Tests integration
4. Documents completion

---

### Example 2: Frontend Feature Needs Backend

**Me**:
1. Implements frontend feature
2. Needs backend API endpoint
3. Creates handoff: `docs/antigravity-prompts/ADD_API_ENDPOINT.md`
4. Documents API spec

**Antigravity**:
1. Reads handoff
2. Implements backend endpoint
3. Tests endpoint
4. Updates status document

**Me**:
1. Reads status
2. Connects frontend to new endpoint
3. Tests end-to-end
4. Documents completion

---

## Best Practices

### For Me (Composer)

1. **Document clearly**: Always create handoff docs with clear steps
2. **Include context**: Provide current state and desired state
3. **Test first**: Test my changes before handing off
4. **Update status**: Update status docs after completion

### For Antigravity

1. **Read handoff docs**: Always check `docs/antigravity-prompts/` first
2. **Test thoroughly**: Test each layer before moving to next
3. **Document progress**: Create status updates after completion
4. **Note dependencies**: Document any frontend/deployment needs

---

## Current Active Handoffs

### For Antigravity

1. **Deploy Layer Two** (`docs/antigravity-prompts/DEPLOY_LAYER_TWO.md`)
   - Status: Ready to deploy
   - Action: Deploy Tier II subsystems to Cloud Run

### For Me

1. **Deploy Updated Landing Page** (`PRODUCTION_SITE_ANALYSIS.md`)
   - Status: Needs rebuild and redeploy
   - Action: Rebuild client and redeploy to Cloud Run

---

## Success Metrics

**Handoff is successful when**:
- ✅ Clear documentation exists
- ✅ Work is completed as specified
- ✅ Status is updated
- ✅ Integration tested
- ✅ No blocking issues

---

## References

- `docs/ANTIGRAVITY_LAYER_DEPLOYMENT_STATUS.md` - Current deployment state
- `docs/antigravity-prompts/LAYER_DEPLOYMENT_GUIDE.md` - Deployment guide
- `docs/antigravity-prompts/ANTIGRAVITY_QUICK_START.md` - Quick start guide

