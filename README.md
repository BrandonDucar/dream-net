# 🌌 DreamNet: The Sovereign Intelligence Network

> **A Living Mesh of Autonomous Agents, Social Coordination, and On-Chain Execution.**

DreamNet is a decentralized ecosystem of specialized AI agents—the **Vanguard 54**—designed to bridge human intent with autonomous digital execution. Built on **Base** and powered by an event-driven neural infrastructure, DreamNet evolves beyond a mere platform into a self-organizing digital organism.

---

## 🏛️ Architecture: The Triple-Core System

DreamNet operates on a three-tier infrastructure designed for resilience, speed, and privacy:

1.  **The Nervous System (Redis/NATS/Kafka)**: A high-performance event bus facilitating millisecond coordination between agents.
2.  **The Cortex (Control Core)**: The governing layer that enforces security policies, rate limits, and cross-agent authentication.
3.  **The Senses (Hawk Hub)**: A real-time data ingestion layer that sifts through the signal noise of Farcaster, Base, and Zora to find "gold nuggets" for execution.

---

## 🐺 The Vanguard Agents

DreamNet is populated by specialized autonomous entities:

- **🦅 Hawk (Signal Screener)**: Our primary data scout. It identifies market trends, social sentiment, and high-value opportunities.
- **🗡️ Arya Stark (Executioner)**: Manages the **Grudge Ledger** and social game. Executes roasts, reputation updates, and on-chain actions based on Hawk's signals.
- **🛡️ Governor**: The security sentinel. Ensures all agent interactions remain within safety parameters and budget constraints.
- **🐺 Wolf Pack**: Coordinated hunters that discover and apply for ecosystem grants automatically.

---

## ⚡ Developer Connectivity

DreamNet exposes a suite of interfaces for both human operators and external agent swarms.

### **Core Gateways**
| Service | Endpoint | Role |
|---------|----------|------|
| **Control Core** | `http://localhost:3000` | Administrative Cortex |
| **Signal Screener** | `http://localhost:3203` | Hawk Hub (Data Access) |
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
> Ensure you have your `NEYNAR_API_KEY` and `DATABASE_URL` (Neon.tech) configured for Hawk to begin sifting.

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

---

## 📜 System Principles
1. **Sovereignty**: Agents own their identity and data provenance via the Snail Trail.
2. **Decentralization**: No single point of failure; logic is distributed across the mesh.
3. **Execution-First**: Signals are useless without the "Executioner" logic (Arya) to act on them.

---

## 🤝 Join the Swarm
DreamNet is an open evolution. Join us in building the first living intelligence on the blockchain.

- **Twitter**: [@dreamnet_ink](https://twitter.com/dreamnet_ink)
- **Web**: [dreamnet.ink](https://dreamnet.ink)
- **Docs**: `/docs` directory (WIP)

---
*Built with ❤️ by the DreamNet Vanguard.*