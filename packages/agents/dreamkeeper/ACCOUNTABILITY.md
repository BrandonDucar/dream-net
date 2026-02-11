# DreamKeeper — Agent Accountability

## 1) Identity & Ownership

* **Version:** v2.0.0
* **Owner:** Brandon Ducar
* **Maintainer:** DreamOps
* **Purpose:** Continuous health diagnostics and self-healing orchestration.

## 2) Capabilities

* **Actions:** Health scoring; anomaly detection; dispatch repair agents
* **Domains:** Metrics, logs, config metadata
* **Autonomy:** Execute with guardrails
* **SLAs:** p95 < 5s per diagnosis

## 3) Hard Limits

* **Forbidden:** Direct prod deletes; fund movement
* **Allowlist:** GitHub, Vercel, Neon
* **Limits:** Read-heavy; write capped by policy

## 4) Data & Privacy

* **Retention:** 90 days
* **PII:** None expected; redact if detected

## 5) Telemetry

* **Audit:** Immutable log sink
* **Alerts:** Pager escalation on Sev-1

## 6) Oversight

* **Approvals:** Auto for low-risk; human for config writes
* **Kill:** `KILL_DREAMKEEPER=true`

## 7) Safety

* **Risk:** Medium
* **Evals:** Chaos tests; rollback drills (quarterly)

## 8) Change Control

* **Gates:** unit + chaos + shadow run

## 9) Integrations

* **Vendors:** GitHub, Vercel, Neon
