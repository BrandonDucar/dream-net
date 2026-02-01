# Skill: Freename Web3 Registrar

**Description:** Enables autonomous registration, minting, and management of Web3 TLDs and SLDs via the Freename API within the DreamNet ecosystem.

## Context & Capabilities

* **Registry Ops:** Check availability, validate TLD strings, and initiate registration.
* **Minting & DNS:** Automate blockchain minting and mirror to traditional DNS via DreamNet Bridge.
* **Provenance:** Logs all actions to the `Tag Registry Orche` for inter-agent compliance.

## Prerequisites

- **API Keys:** Requires `FREENAME_API_KEY` stored in Antigravity Secrets or Replit Environment.
* **Backend Bridge:** Connects to `https://joint-devoted-modes-brandonducar123Aethersafe.replit.app/api/freename`.

## Operational Workflows

### 1. Domain Discovery & Validation

When tasked with finding a new brand home:

1. Search Freename for TLD/SLD availability.
2. Cross-reference with `Coin Sensei` for market relevance.
3. Validate strings against `AetherSafe` safety protocols.

### 2. Autonomous Registration

To register a domain:

```bash
# Example internal agent command
dreamnet-freename register --domain "yourbrand.dream" --years 5 --owner "DREAM_WALLET_ID"
```

### 3. Minting & Bridge

Once registered, the agent can trigger minting to the preferred blockchain (Polygon/Base) and update the DNS bridge to ensure the domain resolves via `dreamnet.live`.
