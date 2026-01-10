# 💬 DreamNet Terminal Integration for Cursor

## The Vision

**Repurpose your Cursor terminal to understand natural language.**

Instead of memorizing commands, just talk to DreamNet:
```
💬 DreamNet > deploy to cloud run
💬 DreamNet > what's the build status?
💬 DreamNet > show me all verticals
```

## Setup Options

### Option 1: Interactive DreamNet Shell (Recommended)

Run this in your terminal:
```bash
pnpm dreamnet:shell
```

This starts an interactive shell where you can just type naturally:
```
💬 DreamNet > deploy
💬 DreamNet > status
💬 DreamNet > help
```

### Option 2: PowerShell Integration (Windows)

Run once to set up:
```powershell
pnpm tsx scripts/setup-dreamnet-terminal.ps1
```

Then restart your terminal. You can use:
```powershell
DreamNet "deploy to cloud run"
dn "show verticals"
DreamNet  # Starts interactive shell
```

### Option 3: Direct Command

Just use the CLI directly:
```bash
pnpm dreamnet "deploy to cloud run"
pnpm dreamnet "check build status"
```

## How It Works

**Current Implementation:**
- Intent matching with predefined commands
- Falls back to regular terminal commands if not understood
- Interactive shell mode for continuous conversation

**Future Enhancement:**
- AI-powered intent understanding (using DreamNet agents)
- Context awareness (remembers what you're working on)
- Multi-step command execution
- Voice input support

## Example Conversations

**You:** `deploy`
**DreamNet:** `🚀 Deploying DreamNet to Cloud Run...`

**You:** `what's wrong?`
**DreamNet:** `🔍 Checking... Found issue: [explains]`

**You:** `fix it`
**DreamNet:** `🔧 Fixing... [executes fix]`

**You:** `show me everything`
**DreamNet:** `🌐 Here are all DreamNet verticals: [lists them]`

## Integration with Cursor

**In Cursor's terminal:**
1. Open terminal (Ctrl+`)
2. Run `pnpm dreamnet:shell`
3. Start typing naturally

**Or set as default:**
- Modify Cursor's terminal settings
- Set default shell to run DreamNet shell
- Terminal opens in "DreamNet mode" automatically

## Why This Matters

**Traditional Terminal:**
- Memorize commands
- Syntax errors
- Hard to discover features
- Feels like programming

**DreamNet Terminal:**
- Just say what you want
- Natural language
- Discoverable through conversation
- Feels like talking to a friend

---

**This is the future - DreamNet is making terminals conversational.**

