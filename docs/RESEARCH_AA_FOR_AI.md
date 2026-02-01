# RESEARCH-2: EVM Account Abstraction for AI (2026)

## 🛡️ Programmatic Guardrails: ERC-4337

ERC-4337 is the foundational standard for securing AI agent spending on EVM chains (Base, Ethereum, Optimism). By 2026, it has matured from experimental to production-grade, with over 40 million smart accounts deployed.

### Core Mechanisms for Agents

1. **Daily Spending Caps**: Restrict the amount of ETH/USDC an agent can move in a 24h window.
2. **Whitelisting**: Restrict agent interactions to approved contract addresses (e.g., specific DeFi pools or bridges).
3. **Multi-Sig Approvals**: High-value transactions (e.g., > 1 ETH) require a co-signature from a Human or a more senior "Guardian Agent."
4. **Paymasters**: Standardizes how the system (DreamNet) pays for agent gas fees, enabling gasless operations for the agents themselves.

---

## 🚀 2026 Shift: "Privileged Users at Machine Speed"

The 2026 landscape treats AI agents as privileged non-human identities (NHIs). This requires:

- **Continuous Monitoring**: On-chain and off-chain audit trails of every intent (WAL logging).
- **Compliance Controls**: EU AI Act alignment, ensuring agents don't engage in manipulative economic behavior.
- **Quantum Resistance**: Incremental upgrades to signature schemes (EIP-7702) to protect against future quantum threats.

---

## 🛠️ DreamNet Implementation Path (Objective 7-8 Integration)

1. **Treasury accountability**: Integrate ERC-4337 smart wallets for all 127 citizens. Use `dreamops-treasury` for centralized gas management.
2. **Limit Logic**: Implement a "Guardian Service" that intercepts `BaseAgent` intents and verifies them against spending policy defined in the database.
3. **Identity Binding**: Chain the `AgentWallet` address to the `IdentityId` in `identity-grid`. Identity = Wallet = Memory.

---
*Reference: Alchemy/Thirdweb AA Reports, EIP-7702 Drafts, EU AI Act Security Guidelines.*
