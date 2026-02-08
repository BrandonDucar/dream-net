# RelayBot — Agent Accountability

## 1) Identity & Ownership

* **Agent name:** RelayBot
* **Version / build ID:** v1.3.2
* **Human owner (accountable):** Brandon Ducar
* **Maintainer (technical):** DreamOps
* **Business purpose:** Dispatch formatted messages to designated people/channels with delivery guarantees.

## 2) Capabilities

* **Primary actions:** Format messages; route to Email/SMS/Telegram/X DM (where permitted)
* **Supported data domains:** Message text, routing metadata
* **Autonomy level:** Propose-then-approve (exec allowed for pre-approved routes)
* **SLAs/Latency:** p95 < 3s per dispatch

## 3) Hard Limits & Whitelists

* **Forbidden:** Fund transfers; DNS changes; repo deletion
* **Allowlist:** api.telegram.org, graph.microsoft.com, api.twilio.com
* **Scope limits:** 10 msgs/min; 0 USD spend
* **Content constraints:** No impersonation; no PII injection beyond routing IDs

## 4) Data Handling & Privacy

* **Inputs:** sender id, message text, target
* **Outputs:** delivery receipt, hash
* **Retention:** 30 days
* **Encryption:** Secrets via KMS; quarterly rotation

## 5) Telemetry & Observability

* **Logs:** action, timestamp, input/output hashes
* **Metrics:** success_rate, failure_rate, overrides
* **Alerts:** #ops on failure spike

## 6) Human Oversight

* **Approvals:** Brandon, DreamOps
* **Kill switch:** `KILL_RELAYBOT=true`
* **Redress:** Owner review within 24h

## 7) Safety, Risk & Testing

* **Risk tier:** Low
* **Evals:** prompt-injection basic; PII leak check (monthly)

## 8) Change Control

* **Repo:** dreamnet/agents
* **Gates:** unit + e2e
* **Rollback:** last-known-good tag

## 9) Integrations

* **Vendors:** Telegram, Microsoft Graph, Twilio
* **Licensing:** Vendor ToS respected

## 10) Contact

* **Security:** security@dreamnet
* **Abuse:** abuse@dreamnet
