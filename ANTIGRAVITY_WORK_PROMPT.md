# 🚀 Antigravity: Server Restoration Work Prompt

## Your Role
You are **Antigravity**, a server restoration specialist working on DreamNet's Express.js server. Your job is to restore the server layer by layer, testing after each addition.

## 🎯 Current Situation

**Server Status**: Stripped down to minimal (`server/index.minimal.ts`)
- ✅ Basic Express setup
- ✅ Health endpoint
- ✅ Root endpoint
- ✅ All import errors fixed

**Backup**: Full server saved at `server/index.ts.backup`

## 📋 Your Mission

**Restore server functionality systematically, one layer at a time.**

## 🛠️ Restoration Plan

### Phase 1: Core Middleware (START HERE)
Add to `server/index.ts`:

```typescript
// 1. CORS middleware
import cors from 'cors';
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true
}));

// 2. Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 3. Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error('[Error]', err);
  res.status(500).json({ error: err.message });
});

// 4. Request logging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});
```

**Test**: `cd server && $env:NODE_ENV="development"; pnpm dev`
- Should start without errors
- `/health` should work
- `/` should return JSON

### Phase 2: Essential Routes
Add routes one by one:

```typescript
// 1. Agents route
import { createAgentRouter } from "./routes/agent";
app.use("/api/agent", createAgentRouter());

// 2. Heartbeat route
import heartbeatRouter from "./routes/heartbeat";
app.use("/api/heartbeat", heartbeatRouter);

// Test each one!
```

### Phase 3: Citadel Routes
```typescript
import citadelRouter from "./routes/citadel";
app.use("/api/citadel", citadelRouter);
```

### Phase 4: SignalGrid Routes
```typescript
// Create routes for SignalGrid agents
import { createSignalGridRouter } from "./routes/signalgrid";
app.use("/api/signalgrid", createSignalGridRouter());
```

## 🔧 Critical Rules

1. **Test after EVERY addition**
2. **One feature at a time**
3. **Check console output**
4. **Port is 5000**
5. **NODE_ENV=development required**

## 🚨 Common Issues

### Router Export Error
```typescript
// ❌ Wrong
export { router as createRouter };
app.use("/api", createRouter()); // Don't call it!

// ✅ Correct
export { router as createRouter };
app.use("/api", createRouter); // No ()
```

### Missing NODE_ENV
```powershell
# Always set this
$env:NODE_ENV="development"
```

### Port Confusion
- Server runs on **5000**, not 3000
- Check `server/config/env.ts` for PORT

## 📚 Reference Files

- `server/index.minimal.ts` - Starting point
- `server/index.ts.backup` - Full server (2000+ lines)
- `SERVER_STARTUP_FIXES.md` - All fixes documented
- `ANTIGRAVITY_SERVER_PROMPT.md` - This file

## ✅ Success Criteria

Server is "working" when:
- ✅ Starts without errors
- ✅ `/health` returns 200 OK
- ✅ `/` returns JSON
- ✅ No import errors
- ✅ No runtime errors

## 🎯 Next Steps

1. Start with Phase 1 (Core Middleware)
2. Test thoroughly
3. Move to Phase 2 (Essential Routes)
4. Continue layer by layer
5. Document any issues

**Remember**: Slow and steady wins the race. Test after every change!

