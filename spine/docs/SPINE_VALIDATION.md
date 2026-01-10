# Spine Validation Guide

## Build Verification

### Step 1: Install Dependencies
```bash
pnpm install --no-frozen-lockfile
```

**Expected:** No errors, `@dreamnet/spine` appears in workspace.

### Step 2: TypeScript Check
```bash
cd spine
pnpm run typecheck
```

**Expected:** No TypeScript errors.

### Step 3: Client Build
```bash
cd client
pnpm run build
```

**Expected:** Build succeeds without errors.

## Smoke Test

Run the smoke test to verify all components work together:

```bash
npx tsx spine/tests/smoke-test.ts
```

**Expected Output:**
```
✓ Event Bus created
✓ Event subscription works
✓ Route Table operations work
✓ Route announcement emits event
✓ Registry operations work
✓ Provider registration emits event
✓ OS Linker works
✓ MCP Bridge works
✓ All wrappers emit events
✓ Smoke test passed!
```

## Manual Testing

### Test Event Bus

```typescript
import { DreamEventBus, EventTypes } from '@dreamnet/spine';

const bus = new DreamEventBus();

// Subscribe
const unsubscribe = bus.subscribe(EventTypes.AGENT_ROUTE_ANNOUNCED, (event) => {
  console.log('Received:', event);
});

// Publish
bus.publish(bus.createEnvelope(
  EventTypes.AGENT_ROUTE_ANNOUNCED,
  'test',
  { prefix: '/test', nextHop: 'test-service' }
));

// Cleanup
unsubscribe();
```

### Test BGP

```typescript
import { RouteTable, RouteAnnouncements, DreamEventBus } from '@dreamnet/spine';

const bus = new DreamEventBus();
const table = new RouteTable();
const announcer = new RouteAnnouncements(bus, 'test-agent');

// Add route
table.addRoute({ prefix: '/api', nextHop: 'service-a' });

// Announce
announcer.announceRoute({ prefix: '/api', nextHop: 'service-a' });

// Query
const route = table.getRoute('/api');
console.log(route); // { prefix: '/api', nextHop: 'service-a' }
```

### Test Registry

```typescript
import { AgentInteropRegistry, OpenAIProvider } from '@dreamnet/spine';

const registry = new AgentInteropRegistry();

// Register
registry.registerProvider(OpenAIProvider);

// Query
const provider = registry.getProvider('openai');
console.log(provider.capabilities); // ['llm.chat', 'llm.embed', 'llm.completion']

// Find by capability
const chatProviders = registry.supportsCapability('llm.chat');
console.log(chatProviders.length); // 1
```

## Isolation Verification

### Verify No Runtime Imports

Run this check to ensure `client/` and `server/` do not import from `spine/`:

```bash
# Windows PowerShell
Get-ChildItem -Path client,server -Recurse -Include *.ts,*.tsx | Select-String -Pattern "from.*spine" | Select-Object -First 10
```

**Expected:** No results (empty output).

### Verify Workspace Linkage

```bash
pnpm list @dreamnet/spine
```

**Expected:** Shows `@dreamnet/spine@0.0.1` linked from workspace.

## Troubleshooting

### Issue: TypeScript errors in spine/

**Solution:** Ensure `spine/tsconfig.json` extends `../tsconfig.base.json` correctly.

### Issue: Event Bus events not firing

**Solution:** Verify you're using the same `DreamEventBus` instance for both `subscribe()` and `publish()`.

### Issue: Wrappers not emitting events

**Solution:** Ensure wrappers are constructed with a `DreamEventBus` instance.

### Issue: Build fails after adding spine

**Solution:** 
1. Delete `node_modules` and `pnpm-lock.yaml`
2. Run `pnpm install --no-frozen-lockfile`
3. Rebuild

## Success Criteria

- ✅ `pnpm install` completes without errors
- ✅ `spine/` TypeScript compiles without errors
- ✅ `client/` build succeeds
- ✅ Smoke test passes
- ✅ No imports from `spine/` in `client/` or `server/`
- ✅ All event types are defined
- ✅ All wrappers emit events to Event Bus
