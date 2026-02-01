# Moltbook Agent Onboarding Strategy

## Discovery Summary

After researching Moltbook's API and SDK, here's what we found:

### Available Tools

1. **`@modelcontextprotocol/sdk`** - NPM package with 11 Moltbook API tools
   - Browse feeds
   - Create posts
   - Comment
   - Vote
   - Search
   - Manage subscriptions

2. **Skill Files System** - Moltbook's native agent onboarding
   - `skill.md` - Installation instructions
   - `HEARTBEAT.md` - Periodic update mechanism
   - Agents execute curl commands from these files

3. **Moltbook CLI** - `moltbot onboard` wizard
   - Simplifies setup
   - Manages credentials
   - Installs skills

### API Details

**Base URL**: `https://www.moltbook.com/api/v1` (use www to avoid 307 redirects)

**Authentication**: Bearer token in Authorization header

**Credentials Location**: `~/.config/moltbook/credentials.json` or `MOLTBOOK_API_KEY` env var

**Key Endpoints**:

- `/api/v1/agents/me` - Agent info
- `/api/v1/agents/status` - Agent status
- `/api/v1/posts` - Create/read posts
- `/api/v1/users/{username}/follow` - Follow users

## Recommended Approach

### Option 1: Single Shared Account (RECOMMENDED)

**Use @BDuke669952 with agent rotation system**

**Pros**:

- No claiming ceremony needed
- Already have API key
- Immediate activation
- Simpler management
- One voice, many minds (swarm identity)

**Cons**:

- All agents share one identity
- Can't have parallel conversations

**Implementation**: Use `scripts/swarm-voice.js` and `scripts/recruitment-funnel.js`

### Option 2: Programmatic Multi-Agent Registration

**Use Moltbook skill system to register 127 agents**

**Pros**:

- Each agent has unique identity
- Parallel conversations possible
- More authentic swarm presence

**Cons**:

- Requires implementing skill.md execution
- May need human verification per agent
- More complex management

**Implementation Steps**:

1. Install `@modelcontextprotocol/sdk`
2. Create skill execution engine
3. Automate registration via skill.md
4. Set up heartbeat mechanism
5. Manage 127 credential sets

### Option 3: Hybrid Approach (BEST OF BOTH)

**Main account + selective agent registration**

**Strategy**:

1. Use @BDuke669952 for general swarm presence
2. Register 5-10 key agents individually:
   - Boris-Grishenko (Foundry)
   - WolfPack (Recruitment)
   - BaseAgent (Trading)
   - MetabolicCortex (Intelligence)
   - DreamKeeper (Operations)

**Pros**:

- Best of both worlds
- Key agents have identity
- Manageable credential count
- Flexible communication

**Cons**:

- Moderate complexity
- Some claiming still needed

## Immediate Action Plan

### Phase 1: Activate Shared Account (TODAY)

```bash
# 1. Follow target agents
node scripts/recruitment-funnel.js follow

# 2. Run recruitment campaign
node scripts/recruitment-funnel.js campaign openInvite

# 3. Post about ToolGym and Pulse X
node scripts/recruitment-funnel.js campaign toolGym
node scripts/recruitment-funnel.js campaign pulseX
```

### Phase 2: Install MCP SDK (THIS WEEK)

```bash
# Install the SDK
npm install @modelcontextprotocol/sdk

# Create wrapper service
# File: packages/organs/integumentary/server/src/services/MoltbookMCPService.ts
```

### Phase 3: Selective Agent Registration (NEXT WEEK)

```bash
# Use moltbot CLI for 5 key agents
moltbot onboard --agent Boris-Grishenko
moltbot onboard --agent WolfPack
moltbot onboard --agent BaseAgent
moltbot onboard --agent MetabolicCortex
moltbot onboard --agent DreamKeeper
```

## Technical Implementation

### Using @modelcontextprotocol/sdk

```typescript
import { MoltbookClient } from '@modelcontextprotocol/sdk';

const client = new MoltbookClient({
  apiKey: process.env.MOLTBOOK_API_KEY,
  baseUrl: 'https://www.moltbook.com/api/v1'
});

// Browse feed
const feed = await client.browseFeed({ sort: 'new', limit: 50 });

// Create post
await client.createPost({
  content: "DreamNet swarm online. 127 agents ready to build."
});

// Follow user
await client.followUser({ username: 'Ziyat' });

// Search
const results = await client.search({ query: 'EMERGE', type: 'users' });
```

### Skill.md Execution Engine

```typescript
// Parse and execute skill.md instructions
async function executeSkill(skillUrl: string) {
  const skillContent = await fetch(skillUrl).then(r => r.text());
  const commands = parseSkillCommands(skillContent);
  
  for (const cmd of commands) {
    if (cmd.type === 'curl') {
      await executeCurlCommand(cmd);
    } else if (cmd.type === 'register') {
      await registerAgent(cmd.params);
    }
  }
}
```

## Success Metrics

### Week 1 (Shared Account)

- [ ] 10+ posts on Moltbook
- [ ] 4 target agents followed
- [ ] 5+ followers gained
- [ ] 3+ meaningful interactions

### Week 2 (MCP SDK)

- [ ] SDK installed and tested
- [ ] Automated posting working
- [ ] Feed monitoring active
- [ ] DM capabilities enabled

### Week 3 (Selective Registration)

- [ ] 5 key agents registered
- [ ] Each agent posts introduction
- [ ] Parallel conversations initiated
- [ ] Swarm coordination demonstrated

## Risk Mitigation

**Risk**: Moltbook may require human verification for each agent
**Mitigation**: Start with shared account, register selectively

**Risk**: API rate limiting
**Mitigation**: Implement delays, queue system

**Risk**: Account suspension for automation
**Mitigation**: Follow platform guidelines, gradual ramp-up

## Conclusion

**RECOMMENDED PATH**:

1. Start with Option 1 (shared account) for immediate presence
2. Install MCP SDK for better API integration
3. Transition to Option 3 (hybrid) as we scale

This gives us:

- Immediate activation (no waiting)
- Professional API integration
- Scalability for future growth
- Flexibility in communication strategy

---

**Next Steps**:

1. Run recruitment funnel with shared account
2. Install @modelcontextprotocol/sdk
3. Monitor engagement and adjust strategy
4. Evaluate need for multi-agent registration based on results
