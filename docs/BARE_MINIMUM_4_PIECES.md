# The 4 Essential Pieces - Bare Minimum Server

**Goal**: Just enough to start a server that responds to health checks

---

## Piece 1: Express App ✅
**What**: Create Express application
**Why**: Foundation - HTTP server framework
**Code**: `const app = express()`

---

## Piece 2: Health Endpoint ✅
**What**: `/api/health` route that returns 200
**Why**: Know if server is alive
**Code**: `app.get('/api/health', (req, res) => res.json({ ok: true }))`

---

## Piece 3: Error Handler ✅
**What**: Basic error handling middleware
**Why**: Server doesn't crash on errors
**Code**: `app.use((err, req, res, next) => { ... })`

---

## Piece 4: Server Listen ✅
**What**: HTTP server listens on port
**Why**: Server can receive requests
**Code**: `server.listen(port, host, () => { ... })`

---

## That's It!

**Everything Else is Optional**:
- ❌ Routes (except health)
- ❌ DreamNetOS
- ❌ Agents
- ❌ Subsystems
- ❌ Neural Mesh
- ❌ Everything else

---

## Current Problem

**What's Loading That We Don't Need**:
- DreamNetOS (line ~209) - loads 64 agents, Neural Mesh, etc.
- All routes registration
- All subsystems
- GPT agents

**Solution**: Comment out DreamNetOS initialization, keep only the 4 pieces above

---

## Test

After minimal server:
1. Start: `pnpm dev:app`
2. Test: `curl http://localhost:5000/api/health`
3. Should return: `{ "ok": true }`
4. That's it - server works!

Then add pieces one by one...

