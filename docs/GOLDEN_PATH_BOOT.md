# 🌟 The Golden Path: DreamNet Boot Order

To ensure safe, reliable scaling, DreamNet follows a strict **Boot Order & Guardrails** protocol. We do not enable traffic until the system proves it is ready.

## 🔄 Boot Sequence (The DAG)

We treat the system startup as a Directed Acyclic Graph (DAG). Dependencies must be healthy before dependents start.

1. **Level 0: Infrastructure (The Foundation)**
    * **PostgreSQL** (Neon/Cloud SQL) - Must be reachable.
    * **Redis** (Memorystore) - Must be accepting connections.
    * **Networking** (VPC/DNS) - Routes verified.

2. **Level 1: Secrets & Logic (The Brain)**
    * **Secret Manager** - All API keys (OpenAI, Farcaster, Base) pulled and validated.
    * **EnvKeeper** - Verifies runtime configuration schema.

3. **Level 2: Orchestration (The Conductor)**
    * **Google Workflows** - Deployed and verified.
    * **Super Spine** - Agent registry initialized.

4. **Level 3: Services (The Body)**
    * *Parallel Boot*:
        * `wolf-pack` (Hunter)
        * `octopus-executor` (Finance)
        * `shield-core` (Defense)
    * **Probes**: Services typically wait 90s (Startup Probe) before accepting traffic.

5. **Level 4: The Edge (Connectivity)**
    * **API Gateway / Load Balancer** - Opens port 443 only after L3 is 100% healthy.

## 🚦 Guardrails & Probes

We implement **Kubernetes-style Probes** within our Cloud Run containers (via internal health checks and standardized endpoints).

### 1. Startup Probe (`/health/startup`)

* **Check**: Can we connect to DB? Do we have Secrets?
* **Timeout**: 90s.
* **Action**: If fail, container restarts. Traffic NOT routed.

### 2. Readiness Probe (`/health/ready`)

* **Check**: Are internal caches warm? Is the agent loop running?
* **Frequency**: Every 5s.
* **Action**: Load balancer only sends traffic if `200 OK`.

### 3. Liveness Probe (`/health/live`)

* **Check**: Is the Node.js event loop unblocked?
* **Frequency**: Every 10s.
* **Action**: If fail 3x, restart container (hard reset).

## 📉 Rollback Tripwires (The Safety Net)

We use **Cloud Monitoring** to trigger automatic rollbacks via a specialized Cloud Function (`deploykeeper`).

| Metric | Threshold | Duration | Action |
| :--- | :--- | :--- | :--- |
| **Error Rate** | > 1% | 5 mins | **ROLLBACK** |
| **Latency (p95)** | > 250ms | 5 mins | **WARN** |
| **Latency (p95)** | > 400ms | 5 mins | **ROLLBACK** |
| **AIS Danger** | > 0.8 | Instant | **ROLLBACK** |

---
*Status: Protocol Defined. Adhering to the "Golden Path".*
