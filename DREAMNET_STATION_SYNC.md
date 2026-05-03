# 📡 DREAMNET STATION SYNC: NUC & VAULT

## 🖥️ STATION 1: THE NUC (GROUND STATION)
**Role:** The Body & The Voice
- **NATS:** Primary message bus (Cluster Mode: Enabled)
- **Redis:** Volatile state & audit trails
- **Ollama:** Local Llama-3/Mistral inference
- **Services:** `arya-executor`, `signal-screener`, `genealogist`

**Action Item:** 
- Run `docker compose up -d nats redis ollama`
- Ensure Port 4222 (NATS) is accessible by the Vault station.

---

## 🔐 STATION 2: MASTER VAULT (SECURITY STATION)
**Role:** The Soul & The Keys
- **Wallet Derivation:** 17,000 HD Wallets (BIP-44)
- **Encryption:** AES-256 for all local storage
- **Signing Service:** The only station allowed to access `AGENT_MNEMONIC`

**Action Item:**
- Deploy `VaultManager.ts`
- Generate the `agent_manifest.json` (The roster of all 17k agents).

---

## ⛓️ THE BRIDGE (NUC <-> VAULT)
1. **The Vault** derives a signature.
2. **The Vault** sends the signed transaction to the **NUC**.
3. **The NUC** broadcasts it to Base/Farcaster.
*Result: Your Master Seed never leaves the Vault, even though the NUC does the hard work.*
