# 👑 MASTER PLAN: Sovereign Construction (VDS/EliteID + Spine)

**Objective**: To assume the Execution role, stabilize the failed Thread memory, and build the **VDS/EliteID Sovereign Identity Layer** as the first major application of the DreamNet Spine.

## 1. System Status (Current State)

Based on my deep scan of the codebase and brain memory:

* **The Spine (Active)**: We have a functional Event Bus, BGP-style routing, and an MCP Bridge.
* **The Nerve (Package)**: `@dreamnet/nerve` is ready to act as the "Prosthetic Interface" for external agents.
* **The Social Layer**: Neynar API is verified and live.
* **The Memory**: `AntigravityMemory` is registered and accessible via API.
* **The Problem**: The previous Executor thread failed to bridge VDS (VisionDatabase) into this ecosystem.

## 2. The Goal: VDS Sovereign Upgrade

We are not just building another database. We are building the **"Physical Oracle"**.

1. **VDS Proxy**: A bridge that intercepts VDS data and pushes it to the DreamNet Event Bus.
2. **EliteID "Titan"**: A physical NFC/RFID credential that stores a DreamNet `Sovereign Passport`.
3. **Privacy Mesh**: Biometric data is hashed and verified locally (Idemia hijack), never entering the central DB.

## 3. High-Fidelity Roadmap

### Phase 1: The Integration Bridge (Steps 1-5)

* **[NEW] `packages/vds-core`**: A dedicated package for VDS/EliteID logic.
* **Spine Attachment**: Registering VDS events (CardTap, FaceDetected) in the `EventTypes.ts`.
* **Neynar Broadcast**: Automatically posting "System Health" pulse to Farcaster when a VIP enters the building.

### Phase 2: The Bearer Layer (Steps 6-10)

* **EliteID NFC Logic**: Implementing the NTAG 424 DNA authentication flow.
* **DreamSnail Link**: Tapping a badge triggers a hidden transaction mixing cycle.

### Phase 3: The Intelligence Layer (Steps 11-15)

* **Metabolic-Cortex Scoring**: VDS data influences the "Trust Score" of the physical user.
* **Archimedes Billing**: VDS usage triggers micro-grant requests or crypto-billing.

## 4. User Review Required
>
> [!IMPORTANT]
> **Structural Pivot**: I will be moving the VDS logic from a "Stub" into a full-fledged monorepo package. This allows us to use all existing dependencies (`@dreamnet/shared`, `@dreamnet/lib`).
>
> **The Thread Handover**: I have ingested all "Wild Frontier" data. I now treat those 40+ avenues as **Library Skills** that I can call upon during building.

---
**Directive**: Upon approval, I will begin by creating the `@dreamnet/vds-core` skeleton.
