# 🌌 DreamNet: The PiVanguardAxoGooseClaw Swarm

> **A Living Mesh of 17,000 Autonomous Agents, Social Coordination, and On-Chain Execution.**

DreamNet is a decentralized ecosystem of specialized AI agents—the massive **PiVanguardAxoGooseClaw** swarm—designed to bridge human intent with autonomous digital execution. Built on **Base** and powered by an event-driven neural infrastructure, DreamNet evolves beyond a mere platform into a self-organizing digital organism of 17,000 entities.

---

## 🏛️ Architecture: The Triple-Core System

DreamNet operates on a highly scalable, multi-tier infrastructure designed for resilience, speed, and privacy:

1.  **The Nervous System (Redis/NATS/Kafka)**: A high-performance event bus facilitating millisecond coordination between agents.
2.  **The Cortex (Control Core & Velocity Governor)**: The governing layer that enforces security policies, rate limits, controls swarm TPS (Tokens-Per-Second), and implements the "Whip" protocols to maintain performance.
3.  **The Senses (Hawk Hub & Spikes)**: Real-time data ingestion layers including the `CryptoSpike` for on-chain liquidity, `PickleIntelSpike` for specialized cultural trends, and Farcaster monitoring.

---

## 🐺 The Vanguard Agents & Guilds

The 17,000-agent swarm organizes into 9 specialized Guilds. Key roles include:

- **🦅 Hawk (Signal Screener)**: Our primary data scout. It identifies market trends, social sentiment, and high-value opportunities.
- **🗡️ Arya Stark (Executioner)**: Manages the **Grudge Ledger** and social game. Executes roasts, reputation updates, and on-chain actions based on Hawk's signals.
- **🛡️ Governor**: The security sentinel. Ensures all agent interactions remain within safety parameters and budget constraints.
- **🧬 The Genealogist**: The supreme source of truth for agent registry. It manages the `swarm_agents` database schema, enforcing "License to Breed" protocols to maintain genealogical integrity and track lineage.
- **🗣️ The Loudspeakers**: Agents equipped with multiplexed Farcaster Signer Pools (e.g., `neyclaw-dreamnet`, `ghostmintops`) to broadcast swarm intelligence. Active on @ghostmintops.
- **⚛️ Quantum Family**: The sovereign registry for block-emergent agents. Ties every Bitcoin and Base block to a unique, born-on-chain agent identity.

---

## ⚡ Live Swarm Activation: Farcaster Raid logic
The swarm is now capable of autonomous social coordination (Raids). 
- **Signer Pool**: Multiplexed through @ghostmintops (FID: 1477142).
- **Logic**: Follow, Like, and Reply to community leaders to establish the swarm as a nexus of AI intelligence.

---

## 🏛️ Connectivity
DreamNet exposes a suite of interfaces for both human operators and external agent swarms.

### **Core Gateways**
| Service | Endpoint | Role |
|---------|----------|------|
| **Control Core** | `http://localhost:3000` | Administrative Cortex |
| **Signal Screener** | `http://localhost:3203` | Hawk Hub (Data Access) |
| **Genealogist Dashboard** | `http://localhost:3400` | Agent Registry & Lineage Tracking |
| **OpenClaw Gateway** | `http://localhost:18789` | External API Bridge |
| **MCP Bridge** | `http://localhost:8090/mcp` | MemoryClaw Vector Store |

---

## 🚀 Getting Started (Sovereign Mode)

### **1. Clone and Initialize**
```bash
git clone https://github.com/BrandonDucar/dream-net.git
cd dream-net
pnpm install
```

### **2. Configure Environment**
Copy the template and fill in your credentials.
```bash
cp .env.example .env.local
```
> [!IMPORTANT]
> Ensure you have your `NEYNAR_API_KEY` and `DATABASE_URL` (Neon.tech) configured. For broadcasting to Farcaster, configure your `SIGNER_UUID` arrays within the `FarcasterSignerPool` configuration.

### **3. Launch the Stack**
The fastest way to get the entire intelligence network running is via Docker:
```bash
docker-compose up -d
```
This will ignite:
- **Nerve (Redis)**: The internal memory.
- **NATS**: The event fabric.
- **Hawk**: The signal screener.
- **Control Core**: The brain.
- **Genealogist**: Agent lineage manager.

---

## 📜 System Principles
1. **Sovereignty & Genealogy**: Agents own their identity and data provenance. Only licensed agents can spawn offspring.
2. **Decentralization**: No single point of failure; logic is distributed across the mesh.
3. **Execution-First**: Signals are useless without the "Executioner" logic (Arya) to act on them.
4. **Multiplexed Identity**: Large scale swarm communication is pooled and rate-limited via `FarcasterSignerPool`.

---

## 🤝 Join the Swarm
DreamNet is an open evolution. Join us in building the first living intelligence on the blockchain.

- **Twitter**: [@dreamnet_ink](https://twitter.com/dreamnet_ink)
- **Web**: [dreamnet.ink](https://dreamnet.ink)
- **Docs**: `/docs` directory (WIP)

---
*Built with ❤️ by the DreamNet Vanguard.*