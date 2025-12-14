# Init Ritual Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Init Ritual Core provides an **onboarding and initialization system** for new DreamNet users. It guides users through a structured ritual flow, helping them set up their identity, choose a dream seed, link rituals, and complete their first actions.

---

## Key Features

### Init Stages
- **not-started**: Initial state
- **welcome**: Welcome message
- **choose-dream-seed**: Dream selection
- **link-ritual**: Ritual linking
- **first-action**: First action completion
- **completed**: Ritual complete

### Init Steps
- Show message steps
- Attach dream steps
- Attach ritual steps
- Launch Zen session steps
- Create social post steps
- Custom steps

### Flow Templates
- Default user init template
- Custom templates
- Template management
- Step ordering

---

## Architecture

### Components

1. **Init Store** (`store/initStore.ts`)
   - Template storage
   - Identity state storage
   - State management

2. **Ritual Engine** (`logic/ritualEngine.ts`)
   - Flow advancement
   - Step completion
   - Template seeding

3. **Init Scheduler** (`scheduler/initScheduler.ts`)
   - Init cycle execution
   - State updates
   - Progress tracking

---

## API Reference

### Template Management

#### `ensureDefaultTemplateSeeded(): void`
Ensures default template is seeded.

#### `upsertTemplate(template: InitFlowTemplate): InitFlowTemplate`
Creates or updates a template.

**Example**:
```typescript
import { InitRitualCore } from '@dreamnet/init-ritual-core';

InitRitualCore.upsertTemplate({
  id: 'custom-init',
  label: 'Custom Init Flow',
  description: 'Custom onboarding flow',
  steps: [
    {
      id: 'step-1',
      type: 'show-message',
      title: 'Welcome!',
      description: 'Welcome to DreamNet',
      order: 1,
    },
    {
      id: 'step-2',
      type: 'attach-dream',
      title: 'Choose Your Dream',
      dreamId: 'dream:seed-1',
      order: 2,
    },
  ],
});
```

#### `listTemplates(): InitFlowTemplate[]`
Lists all templates.

### Identity State

#### `getOrCreateIdentityState(identityId: string, templateId?: string): IdentityInitState`
Gets or creates identity init state.

**Example**:
```typescript
const state = InitRitualCore.getOrCreateIdentityState(
  'user:founder',
  'default-user-init'
);

console.log(`Stage: ${state.stage}`);
console.log(`Completed steps: ${state.completedStepIds.length}`);
```

#### `getIdentityState(identityId: string): IdentityInitState | undefined`
Gets identity init state.

### Flow Control

#### `advanceIdentity(context: InitRitualContext, identityId: string, templateId?: string): { state: IdentityInitState; nextStep?: InitStep }`
Advances identity through init flow.

**Example**:
```typescript
const result = InitRitualCore.advanceIdentity(
  {
    identityGrid: { ... },
    dreamCortex: { ... },
    dreamTankCore: { ... },
  },
  'user:founder',
  'default-user-init'
);

console.log(`Current stage: ${result.state.stage}`);
if (result.nextStep) {
  console.log(`Next step: ${result.nextStep.title}`);
}
```

#### `completeStep(identityId: string, stepId: string): IdentityInitState`
Completes a step for an identity.

**Example**:
```typescript
const newState = InitRitualCore.completeStep('user:founder', 'step-1');
console.log(`Completed steps: ${newState.completedStepIds}`);
```

### Execution

#### `run(context: InitRitualContext): InitRitualStatus`
Runs init ritual cycle.

#### `status(): InitRitualStatus`
Gets init ritual status.

---

## Data Models

### InitStage

```typescript
type InitStage =
  | 'not-started'
  | 'welcome'
  | 'choose-dream-seed'
  | 'link-ritual'
  | 'first-action'
  | 'completed';
```

### InitStepType

```typescript
type InitStepType =
  | 'show-message'
  | 'attach-dream'
  | 'attach-ritual'
  | 'launch-zen-session'
  | 'create-social-post'
  | 'custom';
```

### InitStep

```typescript
interface InitStep {
  id: string;
  type: InitStepType;
  title: string;
  description?: string;
  dreamId?: string;
  vaultItemId?: string;
  suggestedAction?: string;
  order: number;
}
```

### InitFlowTemplate

```typescript
interface InitFlowTemplate {
  id: string;
  label: string;
  description?: string;
  steps: InitStep[];
}
```

### IdentityInitState

```typescript
interface IdentityInitState {
  identityId: string;
  templateId: string;
  stage: InitStage;
  completedStepIds: string[];
  createdAt: number;
  updatedAt: number;
}
```

### InitRitualStatus

```typescript
interface InitRitualStatus {
  lastRunAt: number | null;
  templateCount: number;
  activeIdentityCount: number;
  completedCount: number;
  sampleStates: IdentityInitState[];
}
```

---

## Default Template

### Default User Init Flow
1. **Welcome** - Show welcome message
2. **Choose Dream Seed** - Select initial dream
3. **Link Ritual** - Link first ritual
4. **First Action** - Complete first action
5. **Completed** - Mark as complete

---

## Step Types

### Show Message
- Display message to user
- Provide information
- Guide user

### Attach Dream
- Link dream to identity
- Reference Dream Tank
- Track dream selection

### Attach Ritual
- Link ritual to identity
- Reference Dream Vault
- Track ritual selection

### Launch Zen Session
- Start Zen Garden session
- Track wellness activity
- Record session

### Create Social Post
- Create social post
- Reference Social Hub
- Track social activity

---

## Integration Points

### DreamNet Systems
- **Identity Grid**: Identity management
- **Dream Cortex**: Dream selection
- **Dream Tank Core**: Dream management
- **Dream Vault**: Ritual templates
- **Zen Garden Core**: Wellness sessions
- **Social Hub Core**: Social posts
- **Field Layer**: Init progress fields
- **Neural Mesh**: Init patterns

### External Systems
- **Frontend**: UI integration
- **Analytics**: Init analytics
- **Notifications**: Init notifications

---

## Usage Examples

### Seed Default Template

```typescript
InitRitualCore.ensureDefaultTemplateSeeded();
```

### Get Identity State

```typescript
const state = InitRitualCore.getOrCreateIdentityState(
  'user:founder',
  'default-user-init'
);

console.log(`Stage: ${state.stage}`);
console.log(`Template: ${state.templateId}`);
console.log(`Completed: ${state.completedStepIds.length} steps`);
```

### Advance Identity

```typescript
const result = InitRitualCore.advanceIdentity(
  {
    identityGrid: identityGrid,
    dreamCortex: dreamCortex,
    dreamTankCore: dreamTankCore,
    dreamVault: dreamVault,
    zenGardenCore: zenGardenCore,
    socialHubCore: socialHubCore,
  },
  'user:founder'
);

if (result.nextStep) {
  console.log(`Next step: ${result.nextStep.title}`);
  console.log(`Type: ${result.nextStep.type}`);
}
```

### Complete Step

```typescript
const newState = InitRitualCore.completeStep('user:founder', 'step-1');
console.log(`New stage: ${newState.stage}`);
```

---

## Best Practices

1. **Template Design**
   - Create clear steps
   - Use appropriate step types
   - Order steps logically
   - Provide clear descriptions

2. **Flow Management**
   - Track progress carefully
   - Advance appropriately
   - Complete steps correctly
   - Monitor completion

3. **User Experience**
   - Provide clear guidance
   - Make steps actionable
   - Show progress
   - Celebrate completion

---

## Security Considerations

1. **Identity Security**
   - Validate identity IDs
   - Protect identity state
   - Audit state changes
   - Prevent manipulation

2. **Template Security**
   - Validate templates
   - Protect template data
   - Audit template changes
   - Prevent abuse

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

