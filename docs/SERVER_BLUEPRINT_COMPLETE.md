# DreamNet Server Blueprint - Complete Architecture

**Status**: ✅ Complete  
**Last Updated**: 2025-01-27  
**File**: `server/index.ts` (2499 lines)

---

## 🎯 Executive Summary

The DreamNet server is an Express.js application that orchestrates 100+ routes, 20+ middleware layers, and 50+ biomimetic subsystems. It follows a **biomimetic organism model** where initialization mirrors biological systems coming to life.

**Key Philosophy**:
- **Graceful degradation**: Missing subsystems don't crash the server
- **Lazy loading**: Heavy subsystems only load when enabled
- **Non-blocking initialization**: Health checks pass immediately
- **Event-driven**: Everything connects through event buses

---

## 📋 PART 1: SERVER INITIALIZATION SEQUENCE

### Phase 0: Pre-Initialization (Lines 1-176)

**WHAT**: Setup before Express app creation

**Components**:
1. **Lazy Module Loaders**
   - `loadViteModule()` - Vite dev server (development only)
   - `loadLegacyLoader()` - Legacy module loader
   - `getDreamEventBus()` - Spine Event Bus (dynamic import)

2. **Route Imports** (Lines 24-142)
   - 70+ route creators imported
   - Some disabled/commented (media, poster, squad)
   - Placeholders for missing packages

3. **Subsystem Variable Declarations** (Lines 87-115)
   - Lazy-loaded subsystem variables
   - Initialized only when `INIT_HEAVY_SUBSYSTEMS=true`
   - Examples: `NeuralMesh`, `QuantumAnticipation`, `WolfPack`, etc.

4. **Spine Event Bus Initialization** (Lines 165-176)
   ```typescript
   (async () => {
     const DreamEventBusClass = await getDreamEventBus();
     eventBus = new DreamEventBusClass();
     (global as any).dreamEventBus = eventBus;
   })();
   ```
   - Initializes immediately (non-blocking)
   - Makes event bus globally available
   - Used by Spine wrappers for agent communication

**WHY**: 
- Lazy loading prevents startup failures
- Global event bus enables cross-system communication
- Variable declarations prepare for conditional initialization

---

### Phase 1: Express App Creation & Basic Middleware (Lines 178-252)

**WHAT**: Core Express setup and security middleware

**Sequence**:
1. **Express App Creation** (Line 178)
   ```typescript
   const app = express();
   ```

2. **Body Parsing** (Lines 181-182)
   ```typescript
   app.use(express.json({ limit: '10mb' }));
   app.use(express.urlencoded({ extended: false, limit: '10mb' }));
   ```
   - Limits prevent memory exhaustion
   - Supports JSON and URL-encoded bodies

3. **Request Timeouts** (Lines 185-189)
   ```typescript
   app.use((req, res, next) => {
     req.setTimeout(30000); // 30 seconds
     res.setTimeout(30000);
     next();
   });
   ```
   - Prevents hanging requests
   - 30-second timeout for all requests

4. **CORS Configuration** (Lines 192-209)
   - Configurable via `ALLOWED_ORIGINS` env var
   - Supports wildcard (`*`) or specific origins
   - Allows credentials
   - Handles OPTIONS preflight

5. **Global Rate Limiting** (Lines 212-252)
   - In-memory store (Map-based)
   - 100 requests per 15-minute window per IP
   - Skips health check endpoints
   - Auto-cleanup of old entries

**WHY**:
- Security first: CORS, rate limiting, timeouts
- Memory protection: Body size limits
- Production-ready: Handles edge cases

---

### Phase 2: Health & Readiness Endpoints (Lines 255-362)

**WHAT**: Critical endpoints that must respond immediately

**Endpoints**:

1. **`GET /health`** (Lines 287-320)
   - **Purpose**: Cloud Run health checks
   - **Response Time**: < 1 second (non-blocking DB check)
   - **Returns**:
     ```json
     {
       "ok": true,
       "service": "dreamnet-api",
       "timestamp": "...",
       "uptime": 123.45,
       "database": "healthy" | "unhealthy" | "not-configured" | "checking"
     }
     ```
   - **Database Check**: 
     - Timeout after 1 second
     - `null` (not configured) = OK
     - `false` (unhealthy) = 503
     - `true` (healthy) = 200

2. **`GET /agents`** (Lines 323-349)
   - Returns JSON if `Accept: application/json`
   - Otherwise forwards to frontend (SPA routing)
   - Lists active GPT agents

3. **`GET /ready`** (Lines 352-362)
   - Backward compatibility alias
   - Forwards to `/health/ready` (health router)
   - Always returns 200 (simple compatibility)

**WHY**:
- Cloud Run requires immediate health check response
- Non-blocking ensures health checks never timeout
- Database optional: Server can run without DB

---

### Phase 3: Core Middleware Chain (Lines 364-396)

**WHAT**: Request processing pipeline (executes in order)

**Middleware Order** (Critical - order matters):

```
1. Trace ID Middleware
   ↓
2. Metrics Middleware (optional - wrapped in try-catch)
   ↓
3. Idempotency Middleware
   ↓
4. Tier Resolver Middleware
   ↓
5. Control Core Middleware
   ↓
6. Auto-SEO Middleware
   ↓
7. Halo Triggers Middleware
   ↓
8. Route Handlers
```

**Detailed Breakdown**:

#### 1. Trace ID Middleware (Line 366)
**File**: `server/middleware/traceId.ts`
- Adds `X-Trace-Id` header to all requests
- Generates trace ID if not present
- Attaches `req.traceId` and `req.traceContext`
- Enables distributed tracing

#### 2. Metrics Middleware (Lines 369-374)
**File**: `server/middleware/metrics.ts`
- Tracks golden signals (latency, errors, throughput)
- Wrapped in try-catch (optional - can fail silently)
- ⚠️ **Issue**: Should be required, not optional

#### 3. Idempotency Middleware (Line 377)
**File**: `server/middleware/idempotency.ts`
- Handles `X-Idempotency-Key` header
- Prevents duplicate requests
- Stores responses in-memory
- ⚠️ **Issue**: No TTL cleanup (memory leak risk)

#### 4. Tier Resolver Middleware (Line 380)
**File**: `server/middleware/tierResolver.ts`
- Resolves access tier from:
  - `x-dreamnet-api-key` header (including God Vault keys)
  - `x-dreamnet-wallet-address` + `x-dreamnet-wallet-signature`
- Attaches `req.callerIdentity`, `req.callerTierId`, `req.callerTier`
- Integrates with God Vault detection

#### 5. Control Core Middleware (Line 385)
**File**: `packages/dreamnet-control-core/controlCoreMiddleware.ts`
- Enforces cluster-level access control
- Rate limiting per cluster
- Feature flag checks
- Global kill-switch
- **Note**: Only acts on routes with `clusterId` (via `withCluster()` helper)

#### 6. Auto-SEO Middleware (Line 388)
**File**: `server/middleware/autoSEO.ts`
- Applies SEO optimization globally
- Detects content creation endpoints
- Auto-optimizes before saving
- Zero-touch operation

#### 7. Halo Triggers Middleware (Lines 389-396)
- Records request for Halo-Loop analysis
- Wrapped in try-catch (optional)
- Triggers self-healing analysis

**WHY**:
- **Order matters**: Each middleware depends on previous
- **Trace first**: All requests get trace IDs
- **Security early**: Tier resolution before control core
- **Idempotency**: Prevents duplicate processing
- **Control last**: Final gate before route handlers

---

### Phase 4: Route Registration (Lines 397-470)

**WHAT**: 70+ API routes registered with Express

**Route Categories**:

#### Core Routes (Always Active)
- `/api/mesh` - Mesh networking
- `/api/graft` - Graft engine
- `/api/grafted` - Grafted content
- `/api` - Agent router
- `/api` - Forge router
- `/api/dna` - DNA sequences
- `/api/resonance` - Resonance patterns
- `/api/alive` - Liveness checks

#### Disabled Routes (Commented Out)
- `/api` - Halo router (line 402) - Placeholder metrics engine
- `/api` - Squad router (line 407) - Package not available
- `/api` - Media router (line 412) - @dreamnet/media-vault missing
- `/api` - Poster router (line 417) - @dreamnet/media-vault missing

#### Dream Routes
- `/api` - Dream router
- `/api` - Dream interactions
- `/api` - Dream contributions

#### Pack Routes
- `/api` - Wolf Pack router
- `/api` - Activate Packs router
- `/api/orca-marketplace` - Orca Pack marketplace

#### Agent Routes
- `/api` - Super Spine router
- `/api` - Brain router
- `/api` - Fleets router
- `/api` - Custom GPT Fleets router
- `/api` - GPT Agents router
- `/api/agent-wallets` - Agent wallet management
- `/api/marketplace` - Agent marketplace
- `/api/agent-outputs` - Agent outputs (Citadel)

#### Payment & Commerce Routes
- `/api/x402` - X402 Payment Gateway
- `/api/coinsensei` - CoinSensei (portfolio analytics)
- `/api` - Rewards router
- `/api` - Orders router

#### Social & Communication Routes
- `/api/social-media-auth` - Social media authentication
- `/api` - Social Media Ops router
- `/api/inbox-squared` - Inbox management
- `/api/email` - Email operations

#### Intelligence & Monitoring Routes
- `/api/citadel` - Citadel strategic command center
- `/api/snapshot` - Ecosystem snapshots
- `/api/drone-dome` - Health analysis
- `/api/event-fabric` - Event fabric design
- `/api/dreamkeeper` - Health monitoring
- `/api/market-data` - Market data
- `/api/competitive-intelligence` - Competitive analysis
- `/api/data-integrity` - Data integrity

#### Infrastructure Routes
- `/api` - Instant Mesh router
- `/api` - Foundry router
- `/api` - Dream Snail router
- `/api` - Biomimetic Systems router
- `/api/guardian` - Guardian router
- `/api` - Browser Agent router

**Route Registration Pattern**:
```typescript
app.use("/api/path", createRouter());
```

**WHY**:
- **Modular**: Each route is self-contained
- **Discoverable**: Clear API structure
- **Extensible**: Easy to add new routes
- **Organized**: Grouped by functionality

---

### Phase 5: Spine Wrapper Initialization (Lines 486-518)

**WHAT**: Connects subsystems to Spine Event Bus

**Wrappers Initialized**:

1. **Shield Core Wrapper** (Lines 490-497)
   - Connects Shield Core to Event Bus
   - Makes available globally: `(global as any).shieldCoreWrapper`

2. **Browser Agent Wrapper** (Lines 499-507)
   - Connects Browser Agent to Event Bus
   - Makes available globally: `(global as any).browserAgentWrapper`

3. **Deployment Wrapper** (Lines 509-517)
   - Connects Deployment system to Event Bus
   - Makes available globally: `(global as any).deploymentWrapper`

**WHY**:
- **Event-driven**: All subsystems communicate via Event Bus
- **Global access**: Wrappers available throughout server
- **Decoupled**: Subsystems don't directly depend on each other

---

### Phase 6: Optional Subsystems Initialization (Lines 528-1465)

**WHAT**: Heavy subsystems that only load when `INIT_SUBSYSTEMS=true`

**Function**: `initOptionalSubsystems(app, server)` (Line 528)

**Conditional Loading**:
```typescript
if (!envConfig.INIT_SUBSYSTEMS) {
  console.log("[Optional Subsystems] Skipped (INIT_SUBSYSTEMS not set to 'true')");
  return;
}
```

**Subsystems Initialized** (when enabled):

#### Tier II Subsystems (Always Loaded if INIT_SUBSYSTEMS=true)
1. **Neural Mesh** (Lines 538-544)
   - Unified nervous system
   - Synapse connections
   - Memory traces

2. **Quantum Anticipation Layer** (Lines 547-552)
   - Predictive analysis
   - Pattern recognition

3. **Squad Alchemy Engine** (Lines 555-560)
   - Squad optimization
   - Dynamic team formation

4. **Wolf-Pack Protocol** (Lines 563-568)
   - Funding discovery
   - Anomaly hunting

5. **Octopus Executor** (Lines 571-586)
   - 8-arm parallel runtime
   - Task queuing
   - Baseline health task enqueued

6. **Slug-Time Memory** (Lines 589-594)
   - Long-horizon trend tracking
   - Slow memory layer

#### Heavy Subsystems (Only if INIT_HEAVY_SUBSYSTEMS=true)
**Condition**: `if (envConfig.INIT_HEAVY_SUBSYSTEMS)` (Line 599)

**Subsystems** (Lines 601-1465):
1. Predator-Scavenger Loop
2. Dream Cortex
3. Reputation Lattice
4. Narrative Field
5. Identity Grid
6. Dream Vault
7. Dream Shop
8. Field Layer
9. DreamBet Core
10. Zen Garden Core
11. Civic Panel Core
12. Dream Tank Core
13. Liquidity Engine
14. Social Hub Core
15. Init & Ritual Core
16. Economic Engine Core
17. Agent Registry Core
18. DreamNet OS Core
19. Wolf Pack Funding Core
20. API Keeper Core
21. AI SEO Core
22. Env Keeper Core
23. Webhook Nervous Core
24. Jaggy Core
25. Shield Core
26. Orca Pack Core
27. Whale Pack Core
28. Spider Web Core
29. Market Data Core
30. Competitive Intelligence Core
31. Data Integrity Core
32. Wolf Pack Analyst Core
33. Wolf Pack Mailer Core
34. Runtime Bridge Core
35. Dream State Core
36. Star Bridge Lungs (initialized separately)

**External Integrations** (19 packages, Lines 1467-2499):
- LangChain, CrewAI, SuperAGI
- Lens Protocol, Farcaster
- Jellyfin, PeerTube
- ResearchHub, DeSci
- OpenTripPlanner, Valhalla
- Ghidra, Metasploit
- Aragon, Snapshot
- MusicGen, MusicLM
- Matrix, RocketChat

**WHY**:
- **Performance**: Heavy subsystems slow startup
- **Flexibility**: Can enable gradually
- **Resource management**: Only load what's needed
- **Graceful degradation**: Missing subsystems don't crash server

---

### Phase 7: Server Listening & Post-Init (Lines 2300-2498)

**WHAT**: Start HTTP server and initialize post-startup systems

**Sequence**:

1. **Create HTTP Server** (Line ~2300)
   ```typescript
   const server = createServer(app);
   ```

2. **Start Listening** (Line ~2310)
   ```typescript
   server.listen(port, host, () => {
     console.log(`[DreamNet] ✅ Server listening on ${host}:${port}`);
   });
   ```

3. **Vite Dev Server** (Lines ~2390-2407)
   - Only in development
   - Non-blocking initialization
   - Serves frontend static files

4. **Star Bridge Lungs** (Lines 2411-2450)
   - Initialized AFTER server listening
   - Non-blocking
   - Runs initial breath cycle
   - Starts continuous cycle (every 2 minutes)

5. **Whale Pack Control Loop** (Lines 2452-2458)
   - Starts after server listening
   - Runs every 5 minutes
   - Non-blocking

6. **Reliability System** (Lines 2460-2470)
   - Only if `USE_RELIABILITY_SYSTEM=true`
   - Non-blocking initialization

7. **Optional Subsystems** (Lines 2472-2476)
   - Called asynchronously
   - Non-blocking
   - Errors don't crash server

**Error Handling** (Lines 2478-2497):
- Try-catch around entire initialization
- Emergency server start if main init fails
- Cloud Run compatibility: Always responds to health checks

**WHY**:
- **Non-blocking**: Health checks pass immediately
- **Post-startup**: Heavy init after server listening
- **Resilient**: Errors don't crash server
- **Cloud Run**: Compatible with container platforms

---

## 🔄 PART 2: REQUEST FLOW DIAGRAM

### Complete Request Journey

```
HTTP Request
    ↓
[Phase 1: Basic Middleware]
    ├─ Body Parsing (JSON/URL-encoded)
    ├─ Request Timeouts (30s)
    ├─ CORS Headers
    └─ Rate Limiting (100/15min)
    ↓
[Phase 2: Health Check?]
    ├─ /health → Return immediately (< 1s)
    ├─ /ready → Return immediately
    └─ /agents → Return JSON or forward
    ↓
[Phase 3: Core Middleware Chain]
    ├─ Trace ID (add X-Trace-Id)
    ├─ Metrics (track golden signals)
    ├─ Idempotency (check X-Idempotency-Key)
    ├─ Tier Resolver (resolve access tier)
    ├─ Control Core (cluster access, rate limits, kill-switch)
    ├─ Auto-SEO (optimize content)
    └─ Halo Triggers (record for analysis)
    ↓
[Phase 4: Route Handler]
    ├─ Match route pattern
    ├─ Execute handler
    └─ Return response
    ↓
[Response]
    ├─ Headers (X-Trace-Id, X-Caller-Tier-Id, etc.)
    └─ Body (JSON/HTML)
```

---

## 🧬 PART 3: HOW IT WORKS (BIOMIMETIC MODEL)

### Biological Metaphor

The server initialization mirrors a **biological organism coming to life**:

1. **Pre-Init** = DNA/RNA (genetic code)
   - Module declarations
   - Route imports
   - Variable declarations

2. **Basic Middleware** = Cell Membrane (protection)
   - CORS = Immune system
   - Rate limiting = Metabolic rate
   - Timeouts = Cell death prevention

3. **Health Endpoints** = Vital Signs
   - Immediate response
   - Non-blocking checks
   - Life/death indicators

4. **Core Middleware** = Nervous System
   - Trace ID = Signal propagation
   - Metrics = Sensory feedback
   - Control Core = Brain stem (reflexes)

5. **Route Handlers** = Organs
   - Each route = Specialized organ
   - Modular functionality
   - Independent operation

6. **Subsystems** = Organ Systems
   - Optional = Can live without
   - Heavy = Require more resources
   - Event-driven = Nervous system connections

7. **Post-Init** = Growth & Development
   - Continuous cycles
   - Self-healing
   - Adaptation

### Event-Driven Architecture

**Spine Event Bus** connects everything:
```
Subsystem A → Event Bus → Subsystem B
```

**Example Flow**:
```
X402 Payment Gateway processes payment
    ↓
Broadcasts "x402.payment.success" event
    ↓
Event Bus routes to subscribers
    ↓
Citadel receives event
    ↓
Analyzes for intelligence
    ↓
Updates health reports
```

**WHY**:
- **Decoupled**: Subsystems don't directly depend on each other
- **Scalable**: Easy to add new subscribers
- **Observable**: All events traceable
- **Resilient**: Subsystem failures don't cascade

---

## 📊 PART 4: INITIALIZATION TIMELINE

### Startup Sequence (Approximate)

```
T+0ms:    Module imports, variable declarations
T+10ms:   Express app creation
T+20ms:   Basic middleware registration
T+30ms:   Health endpoints registered
T+40ms:   Core middleware chain registered
T+50ms:   Route registration (70+ routes)
T+60ms:   Spine wrappers initialized
T+70ms:   HTTP server created
T+80ms:   Server listening ✅ (Health checks pass)
T+100ms:  Vite dev server (development only)
T+200ms:  Star Bridge Lungs initialized
T+300ms:  Whale Pack control loop started
T+500ms:  Optional subsystems start loading (if enabled)
T+2000ms: Heavy subsystems loaded (if enabled)
T+5000ms: External integrations loaded (if enabled)
```

**Key Insight**: Server responds to health checks **before** heavy subsystems load.

---

## 🎯 PART 5: WHY IT'S DESIGNED THIS WAY

### Design Principles

1. **Graceful Degradation**
   - Missing subsystems don't crash server
   - Optional features can fail silently
   - Server always responds to health checks

2. **Lazy Loading**
   - Heavy subsystems only load when enabled
   - Reduces startup time
   - Saves resources

3. **Non-Blocking Initialization**
   - Health checks pass immediately
   - Cloud Run compatible
   - Post-startup initialization

4. **Event-Driven**
   - Subsystems communicate via Event Bus
   - Decoupled architecture
   - Easy to extend

5. **Biomimetic**
   - Mirrors biological systems
   - Self-healing capabilities
   - Adaptive behavior

### Trade-offs

**Pros**:
- ✅ Fast startup (health checks pass quickly)
- ✅ Resilient (errors don't crash server)
- ✅ Flexible (enable subsystems gradually)
- ✅ Scalable (event-driven architecture)

**Cons**:
- ⚠️ Complex initialization sequence
- ⚠️ Some subsystems may not be loaded when routes called
- ⚠️ In-memory stores (data lost on restart)
- ⚠️ Optional middleware can fail silently

---

## 📈 PART 6: CURRENT STATUS & GAPS

### ✅ What's Working

1. **Core Server**
   - Express app initializes correctly
   - Health checks respond immediately
   - 70+ routes registered
   - Middleware chain functional

2. **Subsystem Loading**
   - Conditional loading works
   - Graceful degradation functional
   - Event Bus connects subsystems

3. **Security**
   - CORS configured
   - Rate limiting active
   - Tier-based access control
   - God Vault detection

### ⚠️ Known Issues

1. **Metrics Middleware Optional**
   - Should be required
   - Can fail silently
   - Missing observability data

2. **Idempotency Memory Leak**
   - No TTL cleanup
   - In-memory storage
   - Should use Redis in production

3. **Disabled Routes**
   - Halo router (placeholder metrics)
   - Squad router (package missing)
   - Media/Poster routers (package missing)

4. **Heavy Subsystems**
   - Slow startup when enabled
   - May not be loaded when routes called
   - No health checks for subsystem readiness

---

## 🎨 PART 7: VITE INTEGRATION & FRONTEND ROUTING

### WHAT: Vite Integration

**Vite** is the frontend build tool and dev server. It integrates with Express in two modes:
- **Development**: Vite dev server with HMR (Hot Module Replacement)
- **Production**: Static file serving from built `dist/` directories

### WHERE: Vite Integration

**File**: `server/vite.ts`
- `setupVite()` - Development mode (HMR)
- `serveStatic()` - Production mode (static files)

**Integration Point**: `server/index.ts` lines 2389-2407

### HOW: Vite Integration Works

#### Development Mode (`setupVite`)

**When**: `app.get("env") === "development"`

**Flow**:
```
1. Load vite.config.ts
2. Create Vite server in middleware mode
3. Enable HMR (Hot Module Replacement)
4. Add Vite middlewares to Express
5. Add catch-all route (*) for SPA routing
   - Loads client/index.html
   - Transforms HTML with Vite
   - Serves transformed HTML
```

**Code** (`server/vite.ts` lines 22-80):
```typescript
export async function setupVite(app: Express, server: Server) {
  // 1. Load vite config
  const viteConfigPath = path.resolve(process.cwd(), "vite.config.ts");
  const viteModule = await import(pathToFileURL(viteConfigPath).href);
  const viteConfig = viteModule.default ?? viteModule;

  // 2. Create Vite server (middleware mode)
  const vite = await createViteServer({
    ...viteConfig,
    server: {
      middlewareMode: true,
      hmr: { server }, // HMR enabled
      allowedHosts: true,
    },
    appType: "custom",
  });

  // 3. Add Vite middlewares
  app.use(vite.middlewares);

  // 4. Catch-all route for SPA routing
  app.use("*", async (req, res, next) => {
    const template = await fs.promises.readFile(
      path.resolve(process.cwd(), "client", "index.html"),
      "utf-8"
    );
    const page = await vite.transformIndexHtml(req.originalUrl, template);
    res.status(200).set({ "Content-Type": "text/html" }).end(page);
  });
}
```

**Features**:
- **HMR**: Hot Module Replacement for instant updates
- **Transform**: Vite transforms HTML, CSS, JS on-the-fly
- **SPA Routing**: All non-API routes fall through to `index.html`

#### Production Mode (`serveStatic`)

**When**: `app.get("env") !== "development"`

**Flow**:
```
1. Check for admin dashboard dist
2. Serve admin dashboard at /admin/*
3. Check for client dist
4. Serve client static files at /*
5. Fallback to server/public if client dist missing
6. SPA routing fallback for non-API routes
```

**Code** (`server/vite.ts` lines 82-147):
```typescript
export function serveStatic(app: Express) {
  const adminDistPath = path.resolve(process.cwd(), "apps", "admin-dashboard", "dist");
  const clientDistPath = path.resolve(process.cwd(), "client", "dist");
  const fallbackPath = path.resolve(process.cwd(), "server", "public");

  // 1. Serve Admin Dashboard at /admin/*
  if (fs.existsSync(adminDistPath)) {
    app.use("/admin", express.static(adminDistPath));
    app.use("/admin/*", (_req, res) => {
      res.sendFile(path.resolve(adminDistPath, "index.html"));
    });
  }

  // 2. Serve main frontend at /*
  const staticPath = fs.existsSync(clientDistPath) ? clientDistPath : fallbackPath;
  app.use(express.static(staticPath));

  // 3. SPA routing fallback (only for non-API routes)
  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();
    if (req.originalUrl.startsWith("/admin")) return next();
    
    const indexPath = path.resolve(staticPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ ok: false, error: "not_found" });
    }
  });
}
```

**Static File Serving Order**:
1. `/admin/*` → Admin Dashboard (`apps/admin-dashboard/dist`)
2. `/*` → Main Frontend (`client/dist` or `server/public`)
3. `/api/*` → API routes (handled by Express routes)
4. `*` → SPA fallback (serves `index.html` for frontend routing)

**WHY**:
- **Development**: Fast HMR, instant updates, no rebuild needed
- **Production**: Optimized static files, CDN-ready
- **SPA Routing**: Frontend router handles client-side navigation
- **Graceful Degradation**: Falls back to API-only mode if frontend missing

---

## ⚠️ PART 8: ERROR PROPAGATION FLOW

### WHAT: Error Handling Architecture

DreamNet uses **Express error handling middleware** pattern with structured logging and Halo-Loop integration.

### WHERE: Error Handling

**Error Handler**: `server/index.ts` lines 2283-2331
**Error Logger**: `server/middleware/errorLogger.ts`
**Process Handlers**: `server/index.ts` lines 2352-2365

### HOW: Error Propagation Flow

#### Error Propagation Path

```
Route Handler throws error
    ↓
Caught by try-catch in route
    ↓
Route returns error response OR throws
    ↓
If thrown → Express error handler catches
    ↓
Error Handler (lines 2283-2331):
    ├─ Extract trace ID
    ├─ Log structured error
    ├─ Create error response
    ├─ Include trace ID
    ├─ Hide internal details in production
    └─ If 500+ error → Trigger Halo-Loop
    ↓
Response sent to client
```

#### Error Handler Implementation

**Location**: `server/index.ts` lines 2283-2331

**Code**:
```typescript
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const traceId = (_req as any).traceId || 'unknown';
  
  // 1. Structured logging
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: 'error',
    traceId,
    method: _req.method,
    path: _req.path,
    ip: _req.ip || _req.socket.remoteAddress,
    userAgent: _req.get('user-agent'),
    error: {
      name: err.name || 'Error',
      message: err.message || String(err),
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    },
    statusCode: status
  };
  console.error('[ERROR]', JSON.stringify(logEntry, null, 2));

  // 2. Create error response
  const errorResponse: any = {
    ok: false,
    error: status >= 500 ? 'internal_server_error' : 'request_error',
    message: NODE_ENV === 'production' && status >= 500
      ? 'An internal error occurred'
      : message
  };

  // 3. Include trace ID
  if (traceId !== 'unknown') {
    errorResponse.traceId = traceId;
  }

  // 4. Send response
  res.status(status).json(errorResponse);
  
  // 5. Trigger Halo-Loop for 500+ errors
  if (status >= 500) {
    try {
      haloTriggers.recordError?.();
    } catch {
      // Ignore if haloTriggers not available
    }
  }
});
```

#### Process-Level Error Handlers

**Unhandled Rejection** (Line 2352):
```typescript
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit - log and continue
});
```

**Uncaught Exception** (Line 2357):
```typescript
process.on('uncaughtException', (error) => {
  console.error('[Server] Uncaught Exception:', error);
  console.error('[Server] Stack:', error.stack);
  // Give server chance to log, then exit
  setTimeout(() => {
    console.error('[Server] Exiting due to uncaught exception');
    process.exit(1);
  }, 1000);
});
```

#### Route-Level Error Patterns

**Pattern 1: Try-Catch with Direct Response**
```typescript
router.post("/endpoint", async (req, res) => {
  try {
    const result = await subsystem.doSomething();
    res.json({ ok: true, result });
  } catch (error: any) {
    console.error("[Route] Error:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Operation failed"
    });
  }
});
```

**Pattern 2: Try-Catch with Throw (Goes to Error Handler)**
```typescript
router.post("/endpoint", async (req, res, next) => {
  try {
    const result = await subsystem.doSomething();
    res.json({ ok: true, result });
  } catch (error) {
    next(error); // Passes to Express error handler
  }
});
```

**Pattern 3: Validation Errors (400)**
```typescript
router.post("/endpoint", async (req, res) => {
  if (!req.body.requiredField) {
    return res.status(400).json({
      ok: false,
      error: "requiredField is required"
    });
  }
  // ... continue
});
```

**WHY**:
- **Structured Logging**: All errors logged with trace ID, context
- **Trace ID**: Enables distributed tracing
- **Production Safety**: Internal details hidden in production
- **Halo-Loop Integration**: 500+ errors trigger self-healing analysis
- **Process Safety**: Unhandled errors logged, don't crash server immediately

---

## 🔄 PART 9: ROUTE EXECUTION PATTERNS

### WHAT: Common Route Patterns

Routes follow consistent patterns for validation, subsystem calls, event broadcasting, and error handling.

### WHERE: Route Patterns

**Examples**:
- `server/routes/x402-payment-gateway.ts` - Payment processing
- `server/routes/wolf-pack.ts` - Funding operations
- `server/routes/super-spine.ts` - Agent orchestration
- `server/routes/agent-gateway.ts` - Intent routing

### HOW: Route Execution Patterns

#### Pattern 1: Simple Query Route

**Structure**:
```
1. Extract parameters
2. Call subsystem method
3. Return result
4. Error handling
```

**Example** (`server/routes/x402-payment-gateway.ts` line 70):
```typescript
router.get("/balance/:agentId/:chain", async (req, res) => {
  try {
    const { agentId, chain } = req.params;
    const balance = await x402PaymentGateway.getBalance(agentId, chain);
    res.status(200).json({ success: true, balance });
  } catch (error: any) {
    console.error("[X402] Balance query error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Balance query failed"
    });
  }
});
```

#### Pattern 2: Mutation Route with Validation

**Structure**:
```
1. Extract and validate input
2. Return 400 if validation fails
3. Call subsystem method
4. Return success/error response
```

**Example** (`server/routes/x402-payment-gateway.ts` line 21):
```typescript
router.post("/payment", async (req, res) => {
  try {
    const paymentRequest: X402PaymentRequest = {
      fromAgentId: req.body.fromAgentId,
      toAgentId: req.body.toAgentId,
      amount: req.body.amount,
      chain: req.body.chain || "base",
      serviceId: req.body.serviceId,
      metadata: req.body.metadata,
    };

    // Validation
    if (!paymentRequest.fromAgentId || !paymentRequest.toAgentId || !paymentRequest.amount) {
      return res.status(400).json({
        success: false,
        error: "fromAgentId, toAgentId, and amount are required",
      });
    }

    // Subsystem call
    const result = await x402PaymentGateway.processPayment(paymentRequest);

    // Response
    if (result.success) {
      res.status(200).json({ success: true, payment: result });
    } else {
      res.status(400).json({ success: false, error: result.error, payment: result });
    }
  } catch (error: any) {
    console.error("[X402] Payment processing error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Payment processing failed",
    });
  }
});
```

#### Pattern 3: Route with Event Broadcasting

**Structure**:
```
1. Validate input
2. Call subsystem method
3. Broadcast event to Star Bridge
4. Return result
```

**Example** (`server/core/agents/X402PaymentGateway.ts` line 146):
```typescript
// Inside subsystem, not route, but shows pattern
await broadcastStarbridgeEvent({
  topic: StarbridgeTopic.Economy,
  source: StarbridgeSource.External,
  type: result.success ? "x402.payment.success" : "x402.payment.failed",
  payload: {
    paymentId,
    fromAgentId: request.fromAgentId,
    toAgentId: request.toAgentId,
    amount: request.amount,
    chain: request.chain,
    serviceId: request.serviceId,
  },
});
```

#### Pattern 4: Route with Cluster Access Control

**Structure**:
```
1. Attach cluster via withCluster()
2. Control Core middleware enforces access
3. Route handler executes if allowed
```

**Example** (`server/routes/wolf-pack.ts` line 15):
```typescript
export function createWolfPackRouter(): Router {
  const router = Router();
  
  // Attach WOLF_PACK cluster to all routes
  router.use(withCluster("WOLF_PACK"));
  
  router.get("/wolf-pack/opportunities", async (req, res) => {
    // Control Core already checked access
    // Route handler executes
    const opportunities = wolfPack.getOpportunities();
    res.json({ ok: true, opportunities });
  });
}
```

#### Pattern 5: Route with Tier-Based Access

**Structure**:
```
1. Tier Resolver middleware sets req.callerTierId
2. Route checks tier
3. Return 403 if insufficient tier
```

**Example** (Common pattern):
```typescript
router.post("/admin/action", async (req, res) => {
  const tier = req.callerTierId; // From tierResolverMiddleware
  if (tier !== "OPERATOR" && tier !== "ARCHITECT" && tier !== "FOUNDER") {
    return res.status(403).json({
      ok: false,
      error: "Insufficient tier",
      required: "OPERATOR",
      current: tier
    });
  }
  // ... continue
});
```

#### Pattern 6: Route with Event Bus Integration

**Structure**:
```
1. Process request
2. Emit event to Event Bus
3. Return result
```

**Example** (`server/routes/vercel.ts` line 164):
```typescript
// Emit Nerve event
const event = createAiSeoEvent({
  sourceType: "deployment",
  eventType: "vercel.deployment.completed",
  severity: "info",
  payload: { deploymentId, url }
});
NERVE_BUS.publish(event);
```

### Common Route Helper Functions

**Get User ID**:
```typescript
const getUserId = (req: any) =>
  (req.headers["x-user-id"] as string) ||
  (req.query.userId as string) ||
  undefined;
```

**Get Trace ID**:
```typescript
const traceId = req.traceId || getTraceId(req);
```

**Validate Request**:
```typescript
if (!req.body.requiredField) {
  return res.status(400).json({
    ok: false,
    error: "requiredField is required"
  });
}
```

**WHY**:
- **Consistency**: All routes follow same patterns
- **Error Handling**: Try-catch prevents crashes
- **Validation**: Early validation prevents bad data
- **Event Broadcasting**: Subsystems stay synchronized
- **Access Control**: Cluster and tier checks enforce security

---

## 🌐 PART 10: FRONTEND ROUTING STRATEGY

### WHAT: Frontend Routing

DreamNet serves a **Single Page Application (SPA)** where the frontend router handles client-side navigation. Express serves static files and falls back to `index.html` for SPA routes.

### WHERE: Frontend Routing

**Vite Integration**: `server/vite.ts`
**Route Order**: Critical - API routes registered before SPA fallback

### HOW: Frontend Routing Works

#### Route Matching Order

```
1. API Routes (/api/*)
   ├─ Matched first
   ├─ Handled by Express route handlers
   └─ Never fall through to frontend

2. Admin Dashboard (/admin/*)
   ├─ Served from apps/admin-dashboard/dist
   ├─ Falls through to admin/index.html for SPA routing
   └─ Admin router handles client-side navigation

3. Static Files (/*)
   ├─ Served from client/dist (production)
   ├─ Or client/src (development via Vite)
   └─ Assets, images, etc.

4. SPA Fallback (*)
   ├─ Only for non-API routes
   ├─ Serves client/dist/index.html
   └─ Frontend router takes over
```

#### Development Mode Routing

**Flow** (`server/vite.ts` lines 53-79):
```
Request → /some-route
    ↓
Vite middleware checks if file exists
    ↓
If exists → Serve transformed file
    ↓
If not → Transform index.html
    ↓
Frontend router handles /some-route
```

**Features**:
- **HMR**: Changes reflect instantly
- **Transform**: Vite transforms on-the-fly
- **SPA Routing**: All routes fall through to `index.html`

#### Production Mode Routing

**Flow** (`server/vite.ts` lines 82-147):
```
Request → /some-route
    ↓
Check if static file exists
    ↓
If exists → Serve static file
    ↓
If not → Check if API route
    ↓
If API → 404 (API route not found)
    ↓
If not API → Serve index.html
    ↓
Frontend router handles /some-route
```

**Static File Serving**:
1. `/admin/*` → Admin Dashboard static files
2. `/*` → Main frontend static files
3. `/api/*` → API routes (never static)
4. `*` → SPA fallback (serves `index.html`)

#### Special Routes

**`GET /agents`** (`server/index.ts` line 323):
- If `Accept: application/json` → Returns JSON
- Otherwise → Falls through to frontend (SPA routing)

**`GET /health`** (`server/index.ts` line 287):
- Always handled by Express
- Never falls through to frontend

**`GET /ready`** (`server/index.ts` line 352):
- Always handled by Express
- Never falls through to frontend

### Frontend Router Integration

**Frontend Router** (React Router/Wouter):
- Handles client-side navigation
- Matches routes like `/miniapps/rewards`, `/token`, etc.
- Falls back to 404 if route not found

**Express Fallback**:
- Serves `index.html` for all non-API routes
- Frontend router takes over
- Enables deep linking (direct URLs work)

**WHY**:
- **SPA Architecture**: Single HTML file, client-side routing
- **Deep Linking**: Direct URLs work (e.g., `/miniapps/rewards`)
- **API Separation**: API routes never fall through to frontend
- **Performance**: Static files cached, API dynamic
- **Development**: HMR enables fast iteration

---

## 📊 PART 11: COMPLETE REQUEST EXECUTION FLOW

### End-to-End Request Journey

```
HTTP Request Arrives
    ↓
[Phase 1: Basic Middleware]
    ├─ Body Parsing (JSON/URL-encoded, 10MB limit)
    ├─ Request Timeouts (30s)
    ├─ CORS Headers
    └─ Rate Limiting (100/15min per IP)
    ↓
[Phase 2: Health Check?]
    ├─ /health → Return immediately (< 1s)
    ├─ /ready → Return immediately
    └─ /agents → Return JSON or forward
    ↓
[Phase 3: Core Middleware Chain]
    ├─ Trace ID (add X-Trace-Id, req.traceId)
    ├─ Metrics (track golden signals)
    ├─ Idempotency (check X-Idempotency-Key)
    ├─ Tier Resolver (resolve access tier, req.callerIdentity)
    ├─ Control Core (cluster access, rate limits, kill-switch)
    ├─ Auto-SEO (optimize content)
    └─ Halo Triggers (record for analysis)
    ↓
[Phase 4: Route Matching]
    ├─ API Route? (/api/*)
    │   ├─ Match route pattern
    │   ├─ Execute route handler
    │   │   ├─ Validate input
    │   │   ├─ Call subsystem
    │   │   ├─ Broadcast event (optional)
    │   │   └─ Return response
    │   └─ Error? → Error handler
    │
    ├─ Admin Route? (/admin/*)
    │   ├─ Serve static file if exists
    │   └─ Fall through to admin/index.html
    │
    ├─ Static File? (/*)
    │   ├─ Serve from client/dist
    │   └─ Return file
    │
    └─ SPA Route? (*)
        ├─ Serve client/dist/index.html
        └─ Frontend router handles
    ↓
[Phase 5: Response]
    ├─ Headers (X-Trace-Id, X-Caller-Tier-Id, etc.)
    └─ Body (JSON/HTML)
    ↓
[Phase 6: Error Handling (if error)]
    ├─ Error caught by route try-catch
    ├─ OR thrown to Express error handler
    ├─ Structured logging
    ├─ Error response created
    ├─ Trace ID included
    ├─ Halo-Loop triggered (if 500+)
    └─ Response sent
```

### Example: X402 Payment Request

```
POST /api/x402/payment
    ↓
Body Parsing → { fromAgentId, toAgentId, amount, chain }
    ↓
Trace ID → "trace_abc123"
    ↓
Metrics → Record request
    ↓
Idempotency → Check X-Idempotency-Key
    ↓
Tier Resolver → req.callerIdentity = { tierId: "BUILDER", ... }
    ↓
Control Core → Check WOLF_PACK cluster access
    ↓
Route Handler → POST /api/x402/payment
    ├─ Validate: fromAgentId, toAgentId, amount required
    ├─ Call: x402PaymentGateway.processPayment()
    │   ├─ Get wallets from Agent Wallet Manager
    │   ├─ Execute ERC20 transfer
    │   └─ Broadcast event to Star Bridge
    ├─ Return: { success: true, payment: result }
    └─ Error? → { success: false, error: "..." }
    ↓
Response → 200 OK { success: true, payment: {...} }
```

---

## 🎓 SUMMARY

**Server Blueprint** - 100% Complete:
- ✅ **2499 lines** of initialization code documented
- ✅ **7-phase initialization** sequence
- ✅ **8-layer middleware** chain
- ✅ **70+ routes** registered
- ✅ **50+ subsystems** (optional vs heavy)
- ✅ **19 external integrations** (optional)
- ✅ **Vite integration** (dev vs prod)
- ✅ **Error propagation** flow
- ✅ **Route execution** patterns
- ✅ **Frontend routing** strategy
- ✅ **Complete request** flow

**Initialization Philosophy**:
- **Fast**: Health checks pass immediately (< 1s)
- **Resilient**: Errors don't crash server
- **Flexible**: Enable subsystems gradually
- **Biomimetic**: Mirrors biological systems
- **Event-driven**: Everything connects via Event Bus

**Key Insights**:
1. Server **always responds** - even if subsystems aren't loaded
2. **Non-blocking initialization** - health checks pass before heavy init
3. **Graceful degradation** - missing subsystems don't crash server
4. **Event-driven architecture** - subsystems communicate via Event Bus
5. **SPA routing** - frontend router handles client-side navigation
6. **Structured error handling** - all errors logged with trace IDs

**Status**: ✅ **100% Complete** - Server fully documented and understood

---

**Next Steps**: Move to workflow documentation (how systems interact in sequences)

