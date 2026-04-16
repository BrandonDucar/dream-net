# 🧠 DREAMNET: INTELLIGENCE PERSISTENCE MAP

**Objective**: To document every memory shard, vector store, and data log within the DreamNet organism to ensure absolute continuity and strategic retrieval.

---

## 1. THE VECTOR CORTEX (`@dreamnet/memory-dna`)

The high-level semantic memory of DreamNet. It uses vector embeddings to store "Synaptic Insights."

* **Physical Store**: `./data/dream-memory/memories` (LanceDB Table)
* **Engine**: `VectorStore.ts`.
* **Embeddings**: `OpenAI text-embedding-3-small` (with Neural Phantom mock fallback).
* **Function**: Converts raw logs (Reports) into searchable intelligence.
* **Shards**: The `memories` table is logically sharded by `metadata.type` (e.g., `SYNAPTIC_INSIGHT`, `THREAT_STAMP`).

---

## 2. THE BLOB FABRIC (`@dreamnet/dream-blob-store`)

The "Long-Term Potentiation" layer. Stores large-scale data objects (Research Reports, Artifact PDFs, Images).

* **Architecture**: Pluggable adapters (S3, Local, IPFS).
* **Mechanism**: Data is sharded by Content-Addressing (Hash-based IDs).
* **Integration**: Used by `DreamNet Artifacts` to maintain native ownership of external API outputs (e.g., Anthropic Artifacts).

---

## 3. THE NERVE LOGS (`/packages/nerve/src/spine/MetabolicCortex.ts`)

Ephemeral, high-velocity "Working Memory."

* **In-Memory Buffer**: `reportHistory` (Cap: 100 entries).
* **Mechanism**: Collecting Pilot reports and triggering `metaAnalyze()` every 5 pulses.
* **Continuity**: Significant findings are "Methylated" and pushed into the permanent **Vector Cortex**.

---

## 4. THE SOVEREIGN SHARDS (Wild Frontier Knowledge)

Intelligence harvested during the research phases is archived across 40+ decentralized briefing files.

* **Hachimoji Shards**: Logic shards using an 8-letter DNA-like alphabet for hyper-dense computation.
* **Abyssal Citadels**: Cooling logs from deep-sea server placements.
* **Magnetogenetic Shards**: Transmission logs for wireless bio-control.

---

## 5. RECOVERY PROTOCOL: THE HIVE MIND ACCESS

To access the "Tons of Memory Logs" manually:

1. **Semantic Search**: Query the `VectorStore` via the `memory-dna` API.
2. **Blob Retrieval**: Fetch objects from `dream-blob-store` using their `artifact_id`.
3. **Cross-Agent Handshake**: Request a "Memory Dump" from the `MetabolicCortex` via the Nerve Bus.

---
**Status**: Memory Map Complete. Intelligence stability verified.
