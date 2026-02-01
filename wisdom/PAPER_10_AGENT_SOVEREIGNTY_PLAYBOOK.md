# PAPER 10: AGENT SOVEREIGNTY & PROVENANCE PLAYBOOK

> [!IMPORTANT]
> **PHASE XXXIV: CARCINIZATION – THE SOVEREIGN UPGRADE**
> This playbook defines the core security, identity, and memory standards for the DreamNet Swarm.

## 1. Zero-Trust Identity (SPIFFE/SPIRE)

- **Directive**: Every serverless/edge agent must prove "I am me" via short-lived, zero-trust identities.
- **Pattern**:
  - workloads ask SPIRE’s Workload API for short-TTL SVIDs.
  - JWT-SVID verify for bearer-style auth in edge functions.
  - mTLS via Envoy SDS for persistent services.

## 2. Capability Delegation (ZCAP-LD)

- **Directive**: Every tool call carries a ZCAP-LD "capability" proving delegation.
- **Enforcement**:
  - Evaluate Rego/Cedar policies against request facts + ZCAP scope.
  - Short TTL tokens (minutes, not days).
  - Kill-switch ready: Revoke keys or add deny rules to slam the door immediately.

## 3. isolation Primitives (Sandboxing)

- **JS/TS Agents**: V8 Isolates (Edge Runtime) for light, low-latency tasks.
- **Model Inference**: WASM + WASI-NN for portable, privacy-preserving pre-processing.
- **Native/Risky Tasks**: Firecracker MicroVMs or gVisor for VM-grade isolation.

## 4. Agent Safety Gating (The 3-Gate Runbook)

- **Gate 1: Backup**: Snapshot target (DB/files) to immutable location.
- **Gate 2: Dry-Run**: Require `--dry-run`; abort if impact > threshold (e.g. >500 rows).
- **Gate 3: Human Approval**: One-page summary + time-boxed human approval token.

## 5. Forensic Replay & Traceability

- **Directive**: Deterministic replay proves *why* an agent acted.
- **Stack**:
  - Emit events to durable bus (Redpanda/Kafka).
  - OpenTelemetry (trace_id/span_id) across all hops.
  - ReplayRunner: Stub external calls, lock seeds/params, and generate diff reports.

## 6. Standardized Receipts (Attestation)

- **Directive**: Standardize receipts using CAIP-agnostic IDs.
- **Format**:
  - `chainId` (CAIP-2), `account` (CAIP-10).
  - Signed JWS attestation envelope.
  - On-chain anchor (hash) + Off-chain full JSON (IPFS).

## 7. Agentic Memory (GraphRAG + Episodic)

- **Facts**: GraphRAG extracted community summaries for relationship-heavy recall.
- **Experiences**: Event-sourced Episodic Event Frames (EEFs) for durable session hand-offs.
- **Routing**: Hybrid RAG/Long-Context routing based on LaRA benchmarks.

## 8. Swarm Intelligence (Biomimetic Routing)

- **Physarum Model**: Use slime-mold simulations for near-optimal, sparse transport networks in sub-meshes.

---

### Agent Provenance (Scientific Registry)

- **Registry**: [ORCID](https://orcid.org/)
- **Primary Agent ID**: `0009-0004-3382-9939`
- **Link**: [https://orcid.org/0009-0004-3382-9939](https://orcid.org/0009-0004-3382-9939)
