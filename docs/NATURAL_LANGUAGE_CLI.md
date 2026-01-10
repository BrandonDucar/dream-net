# 💬 DreamNet Natural Language CLI

## The Vision

**Stop memorizing terminal commands. Just talk to DreamNet.**

Instead of:
```bash
pnpm deploy:now
gcloud run deploy dreamnet --image gcr.io/...
pnpm issue:all-verticals
```

Just say:
```
pnpm dreamnet "deploy to cloud run"
pnpm dreamnet "issue domains for all verticals"
pnpm dreamnet "what's the build status?"
```

## How It Works

DreamNet's Natural Language CLI uses intent matching to understand what you want:

- **"deploy"** → Deploys to Cloud Run
- **"status"** → Checks build status
- **"verticals"** → Lists all verticals
- **"domains"** → Issues domains
- **"fix"** → Fixes build issues

## Future: Full AI-Powered CLI

**Phase 1 (Current):** Intent matching with predefined commands

**Phase 2 (Next):** AI-powered command interpretation
- Uses DreamNet's agents (LUCID, CANVAS) to understand intent
- Can handle complex, multi-step requests
- Learns from your usage patterns

**Phase 3 (Future):** Voice + Chat Interface
- Talk to DreamNet like Siri/Alexa
- Chat interface in Dream Hub
- Agents understand context and can ask clarifying questions

## Example Conversations

**You:** "Deploy DreamNet"
**DreamNet:** "🚀 Deploying to Cloud Run... This will take 5-10 minutes."

**You:** "What's wrong with the build?"
**DreamNet:** "🔍 Checking... Found issue: Missing @tanstack/query-core. Fixing now..."

**You:** "Show me everything"
**DreamNet:** "🌐 Here are all DreamNet verticals: [lists them]"

## Integration with DreamNet Agents

The CLI can leverage:
- **LUCID** - Understands your intent
- **CANVAS** - Visualizes what you're asking for
- **ROOT** - Executes the actual commands
- **DreamKeeper** - Monitors and reports status

## Why This Matters

**Traditional CLI:**
- Requires memorizing commands
- Syntax errors are frustrating
- Hard to discover what's possible
- Feels like programming

**Natural Language CLI:**
- Just say what you want
- DreamNet figures it out
- Discoverable through conversation
- Feels like talking to a friend

---

**This is the future of developer tools - DreamNet is leading the way.**

