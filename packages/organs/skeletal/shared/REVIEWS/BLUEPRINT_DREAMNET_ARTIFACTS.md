# 🏗️ Blueprint: DreamNet Artifacts (QL-58)

**Objective**: To implement a native "Artifacts" system within DreamNet, inspired by Anthropic, allowing agents to generate, version, and display rich strategic documents.

## 1. The Concept

DreamNet agents (Archimedes, Snail, Antigravity) generate a lot of data. Instead of just dumping logs, they should generate **Artifacts**: shippable, interactive pieces of value (Grant Proposals, Revenue Maps, Code Snippets).

## 2. Architecture

* **Storage**: Artifacts are stored as `Blobs` in the `BlobStore` (Decentralized).
* **Schema**: Zod-validated JSON containing `title`, `type`, `version`, and `content` (Markdown/Code).
* **UI**: A specialized `ArtifactViewer` component in the frontend using the "Neo-Sovereign" aesthetic.

## 3. Core Components

### A. The Artifact Engine (`@dreamnet/shared`)

* Manages the lifecycle: `create`, `update`, `publish`.
* Generates unique `ArtifactIDs` based on content hashes.

### B. The Render Layer (`@dreamnet/client`)

* **Markdown Slideover**: For strategy and briefings.
* **Code Preview**: For snippets and directives.
* **Mermaid Diagrams**: For system visualizations.

### C. The Agent Link (`@dreamnet/server`)

* API endpoints for agents to "Ship" an artifact.
* `POST /api/artifacts` -> Saves to BlobStore and notifies the UI via WebSocket.

## 4. Implementation Logic

1. **Draft**: Archimedes generates a Grant Proposal in memory.
2. **Ship**: Archimedes calls `ArtifactEngine.ship(proposal)`.
3. **Alert**: The server emits an `ARTIFACT_SHIPPED` event to the `LaminarWSServer`.
4. **Display**: The user's dashboard slides open the new Artifact for review.

---
**Sovereign Utility**: Turning opaque AI "thinking" into transparent, physical assets that can be signed, sold, or executed.
