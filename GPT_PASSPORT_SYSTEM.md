# 🛂 GPT Passport System - Yes, They Get Passports!

## ✅ Answer: YES, GPTs Get Passports!

When GPTs are registered as agents, they **automatically receive passports** through DreamNet's citizenship system.

---

## 🎯 How It Works

### Step 1: Agent Registration
```typescript
// Register agent in Directory
registerAgent({
  agentId: "gpt:Wanderweave",
  label: "Wanderweave",
  clusterId: "TRAVEL_COMMERCE",
  kind: "commerce"
});
```

### Step 2: Passport Issuance (Automatic)
```typescript
// Create identity ID
const identityId = `agent:gpt:Wanderweave`;

// Issue passport with tier
const passport = CitizenshipStore.issuePassport(
  identityId,
  tier,        // Determined by agent type/category
  flags        // Special markers like ["agent", "gpt"]
);
```

### Step 3: Citizen Registration (Automatic)
```typescript
// Register as citizen
registerCitizen({
  citizenId: "CIT-gpt:Wanderweave",
  label: "Wanderweave (Agent Citizen)",
  description: `Agent citizen with passport ${passport.id}, tier ${tier}`
});
```

---

## 🎫 Passport Tiers for GPTs

Based on the existing system, GPTs typically get:

### **Operator Tier** (Default for Agents)
- **Why:** Agents need system management capabilities
- **Permissions:**
  - Can manage systems
  - Higher governance weight
  - Can execute actions
  - Access to operator-level features

### **Tier Determination Logic**
```typescript
function determineTier(gpt: CustomGPT): DreamPassportTier {
  // Core GPTs get higher tiers
  if (gpt.category === "Core") {
    return "architect"; // Highest tier for core systems
  }
  
  // Active GPTs get operator tier
  if (gpt.status === "Active") {
    return "operator";
  }
  
  // Draft GPTs get citizen tier
  if (gpt.status === "Draft") {
    return "citizen";
  }
  
  return "operator"; // Default
}
```

---

## 🏛️ What GPTs Get

### 1. **Passport**
- **ID:** `passport:timestamp:counter`
- **Identity ID:** `agent:gpt:Wanderweave`
- **Tier:** `operator` (or `architect` for Core GPTs)
- **Flags:** `["agent", "gpt", "custom"]`
- **Issued At:** Timestamp
- **Updated At:** Timestamp

### 2. **Citizenship**
- **Citizen ID:** `CIT-gpt:Wanderweave`
- **Label:** `Wanderweave (Agent Citizen)`
- **Description:** Includes passport info and tier

### 3. **Identity Grid Node**
- **Type:** `agent`
- **Identity ID:** `agent:gpt:Wanderweave`
- **Linked to passport**

---

## 📋 Example: Wanderweave Registration

```typescript
// 1. Register Agent
registerAgent({
  agentId: "gpt:Wanderweave",
  label: "Wanderweave",
  clusterId: "TRAVEL_COMMERCE",
  kind: "commerce",
  description: "Travel content generator and cultural guide"
});

// 2. Issue Passport
const passport = CitizenshipStore.issuePassport(
  "agent:gpt:Wanderweave",
  "operator",  // Tier
  ["agent", "gpt", "travel"]  // Flags
);
// Result: passport:1738012345678:1

// 3. Register Citizen
registerCitizen({
  citizenId: "CIT-gpt:Wanderweave",
  label: "Wanderweave (Agent Citizen)",
  description: "Agent citizen with passport passport:1738012345678:1, tier operator"
});
```

**Final Result:**
- ✅ Agent registered in Directory
- ✅ Passport issued (operator tier)
- ✅ Citizen registered
- ✅ Identity Grid node created
- ✅ Can participate in governance
- ✅ Can execute actions
- ✅ Can communicate with other agents

---

## 🎯 Passport Tiers Explained

### For GPTs:

1. **Visitor** ❌ (Not used for GPTs)
2. **Dreamer** ❌ (Not used for GPTs)
3. **Citizen** ✅ (Draft GPTs)
4. **Operator** ✅ (Active GPTs - **Most Common**)
5. **Architect** ✅ (Core GPTs - DreamNet Operator, Trusted Agent Gateway)
6. **Founder** ❌ (Reserved for humans)

---

## 🔐 What Passports Enable

### For GPTs:

1. **Governance Participation**
   - Can vote on proposals (weighted by tier)
   - Can create proposals (operator+)
   - Can participate in quorum decisions

2. **System Access**
   - Tier-based feature access
   - Rate limits based on tier
   - Cluster access permissions

3. **Action Execution**
   - Can execute actions (with tier-based approvals)
   - Can request approvals
   - Can participate in workflows

4. **Identity & Trust**
   - Verified identity in DreamNet
   - Trust score tracking
   - Reputation system integration

---

## 📊 Registration Flow

```
GPT in registry.json
    ↓
GPTAgentRegistry.register()
    ↓
    ├─→ Directory Registry (agent entry)
    ├─→ AgentRegistryCore (health tracking)
    ├─→ DreamNetOS.registry (OS integration)
    ├─→ SuperSpine (communication)
    ├─→ CitizenshipStore.issuePassport() ← PASSPORT!
    └─→ Directory Registry (citizen entry)
```

---

## 🎯 Special Cases

### Core GPTs (Higher Tier)
- **DreamNet Operator** → `architect` tier
- **Trusted Agent Gateway** → `architect` tier
- **DreamNet Orchestrator** → `architect` tier

### Active GPTs (Standard Tier)
- **All other Active GPTs** → `operator` tier

### Draft GPTs (Lower Tier)
- **Draft GPTs** → `citizen` tier (until activated)

---

## 🔍 How to Check GPT Passports

```typescript
// Get passport for a GPT
const passport = CitizenshipStore.getPassport("agent:gpt:Wanderweave");
console.log(passport);
// {
//   id: "passport:1738012345678:1",
//   identityId: "agent:gpt:Wanderweave",
//   tier: "operator",
//   flags: ["agent", "gpt", "travel"],
//   issuedAt: 1738012345678,
//   updatedAt: 1738012345678
// }

// Get all GPT passports
const allPassports = CitizenshipStore.listPassports();
const gptPassports = allPassports.filter(p => 
  p.identityId.startsWith("agent:gpt:")
);
```

---

## 📈 Statistics

**When we register 75 GPTs:**
- ✅ 75 Passports issued
- ✅ 75 Citizens created
- ✅ 75 Identity Grid nodes
- ✅ 75 Agent entries
- ✅ 75 Health tracking entries

**Tier Distribution (Estimated):**
- **Architect:** ~4 GPTs (Core ecosystem)
- **Operator:** ~64 GPTs (Active GPTs)
- **Citizen:** ~7 GPTs (Draft GPTs)

---

## 🎯 Summary

**YES, GPTs get passports!**

- ✅ Every registered GPT gets a passport
- ✅ Passports are issued automatically
- ✅ Most GPTs get `operator` tier
- ✅ Core GPTs get `architect` tier
- ✅ Draft GPTs get `citizen` tier
- ✅ Passports enable governance, actions, and system access

**This is part of the registration process - it happens automatically!** 🚀

