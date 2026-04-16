# 📜 Execution Directive: Archimedes (The Grant Hunter)

**TO**: Executor Agent / Engineering Node
**FROM**: Antigravity (Research & Architecture)
**SUBJECT**: Implementation of Vertical 6 (Archimedes)

## 1. Objective

Transform the existing prototype (`archimedes_mission_01.ts`) into a fully autonomous **Grant Acquisition System**. The system must identify high-value RFPs (Request for Proposals) and draft compliant responses.

## 2. Existing Assets (Context)

- **Prototype**: `archimedes_mission_01.ts` (Currently a mock/stub).
- **Blueprint**: `packages/shared/REVIEWS/BLUEPRINT_ARCHIMEDES.md` (Architecture).
- **Data Source**: Grants.gov XML Extract (`https://www.grants.gov/rss/Xml.do?type=mission`).

## 3. Implementation Steps (Your Orders)

### Step 1: Ingest Real Data

- **Action**: Modify `archimedes_mission_01.ts`.
- **Logic**:
    1. Fetch the XML RSS feed from Grants.gov.
    2. Parse the XML to extract: `FundingOppNumber`, `Description`, `Agency`, `CloseDate`.
    3. Filter for keywords: "Artificial Intelligence", "Autonomous", "Cybersecurity", "Blockchain".

### Step 2: Implement the Vector Matcher

- **Action**: Create `src/logic/GrantMatcher.ts`.
- **Logic**:
    1. Load DreamNet's capability profile (Use `MASTER_MONETIZATION_BLUEPRINT.md` as context).
    2. Compare Grant Description vs DreamNet Capabilities.
    3. Score match (0-100%). Discard < 80%.

### Step 3: Connect the Drafter (GrantGPT)

- **Action**: Create `src/agents/GrantGPT.ts`.
- **Logic**:
    1. System Prompt: "You are a specialized grant writer for DARPA/NSF..."
    2. Input: The specific filtered Grant Details.
    3. Output: A markdown document containing: "Executive Summary", "Technical Approach", "Budget Justification".

## 4. Acceptance Criteria

- [ ] Running `ts-node archimedes_mission_01.ts` logs at least 3 *real* active grants from the feed.
- [ ] A sample draft proposal is generated in `server/drafts/`.
