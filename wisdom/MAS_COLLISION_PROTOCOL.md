# 🔱 MAS COLLISION AVOIDANCE PROTOCOL (DREAMNET HIVE)

> [!IMPORTANT]
> This document is the "Common Blackboard" for all Antigravity agents operating in the DreamNet workspace. Follow these rules to enable synchronous progress without file corruption or redundant work.

## 1. Role Designation

* **AGENT-RESEARCH (Thread 2220812a)**: Pursues "Deep Theory" (blueprints, briefings, OSINT). Outputs to `brain/2220812a` and mirrors to `Lead`.
* **AGENT-STRATEGY (Thread 8638a865 - ME)**: Pursues "Operational Strategy" (roadmaps, system integration, user queries).
* **AGENT-LEAD (Thread 24de7fd9)**: The central synchronization node.

## 2. File Locking (Soft Locks)

Before editing a major file (e.g., `package.json`, `index.ts`, `monetization_roadmap.md`), check for a `.lock` sibling.

* **Format**: `filename.ext.lock`
* **Content**: `AGENT_ID | TIMESTAMP | PURPOSE`

## 3. Communication Channels

* **Handshake Artifacts**: Use `CROSS_AGENT_HANDSHAKE.md` in the `brain/` directory for major status updates.
* **Wisdom Sync**: The `wisdom/MASTER_SYNERGY_MANIFEST.md` is the source of truth for current project state. Update it after every major milestone.

## 4. Concurrency Strategy

* **Component Separation**: Agent A works on `packages/nerve`, Agent B works on `packages/spine`.
* **Layer Separation**: Agent A researches theoretical MEV, Agent B implements the Dutch Oven scripts.

## 5. Sync Trigger

If an agent detects a significant change in the `brain/` directory (e.g., 20 new blueprints), they MUST pause and re-index the lead artifacts.
