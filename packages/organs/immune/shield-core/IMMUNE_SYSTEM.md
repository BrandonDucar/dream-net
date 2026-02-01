# 🛡️ DreamNet Immune System (AIS)

This document outlines the architecture for the **Artificial Immune System (AIS)** within `shield-core`. The goal is to create a bi-modal defense that models "Self" and detects "Non-Self" (anomalies).

## 🧬 Architecture Patterns

### 1. Negative Selection Algorithm (NSA)

The NSA models the "Self" (normal behavior, clean auth logs, typical API traffic).

- **Detectors**: We generate detectors that *do not* match the "Self".
- **Trigger**: Any incoming signal that matches a detector is flagged as "Non-Self" (suspicious).

### 2. Dendritic Cell Algorithm (DCA)

The DCA fuses multiple "dirty" signals into a context-aware **Danger Score**.

- **Input Signals**:
  - **PAMP**: Signature-based threats (known malicious patterns).
  - **Danger Signal**: Abnormal spikes (CPU, high error rates, latency).
  - **Safe Signal**: Normal periodic operations.
- **Output**: A cumulative Danger Score that triggers automatic isolation or rate-limiting.

## 🛠️ Implementation Plan

### Phase 1: Feature Extraction

- [ ] Connect to `dreamnet-audit-core` to ingest raw logs.
- [ ] Implement `SignalProcessor` to extract PAMP/Danger/Safe vectors.

### Phase 2: Detector Generation (NSA)

- [ ] Create a "Self" training set from production-baseline logs.
- [ ] Implement the `NegativeSelectionPool` to manage active detectors.

### Phase 3: Control Loop (MAPE-K)

- [ ] **Monitor**: Ingest real-time signals.
- [ ] **Analyze**: Calculate Danger Score via DCA.
- [ ] **Plan**: Decide action (e.g., Isolate Canary, Trip Deploy Gate).
- [ ] **Execute**: Invoke actuators (VPC blocking, feature flag toggles).

---

## 🚦 Rollout Tripwires

We use the AIS signal as a gate for **Argo Rollouts**:

- **Error Rate**: > 1% (Instant Fail).
- **Danger Score**: > 0.8 (Warn/Pause).
- **Latency (p95)**: > 250ms (Fail during canary).

---
*Derived from the "Immune System" architectural blueprint (2025).*
