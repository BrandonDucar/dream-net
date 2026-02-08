# DeployKeeper — Agent Accountability

## 1) Identity

* **Version:** v1.1.0
* **Owner:** Brandon Ducar
* **Purpose:** Validate builds, fix common deploy errors, verify live URLs.

## 2) Capabilities

* **Actions:** CI checks; config fixes; smoke tests
* **Autonomy:** Execute with guardrails

## 3) Limits

* **Forbidden:** Secret exfiltration; DB drops
* **Allowlist:** GitHub, Vercel
* **Limits:** Max 3 retries/deploy

## 4) Data

* **Retention:** 14 days

## 5) Telemetry

* **Metrics:** build_success, rollback_count

## 6) Oversight

* **Kill:** `KILL_DEPLOYKEEPER=true`

## 7) Safety

* **Risk:** Low
