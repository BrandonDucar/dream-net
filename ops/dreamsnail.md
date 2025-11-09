# DreamSnail NFT – Privacy Layout Spec

*(Verbatim spec sync from operator briefing – 2025-11-08. Keep as source of truth for implementation.)*

---

## 0) Goals

Each NFT = a Snail with a triple-helix core (visual + cryptographic identity), a Fibonacci rarity class, and a privacy-preserving slime trail (activity proofs without doxxing wallet).

Trails are recorded as commitments, later proven with zk to grant perks, airdrops, or access, without revealing the raw path.

Viewers see beautiful trails and proof badges; only the owner can voluntarily reveal.

## 1) Repo Layout

```
dream-net/
├─ apps/
│  ├─ web/
│  │  ├─ app/dreamsnails/
│  │  │  ├─ page.tsx                     # collection landing + explorer
│  │  │  ├─ [tokenId]/page.tsx           # snail detail (helix, traits, zk badges)
│  │  │  └─ verify/page.tsx              # on-chain/zk verifier UI
│  │  ├─ components/dreamsnail/
│  │  │  ├─ TripleHelix.tsx              # helix canvas/GL
│  │  │  ├─ SlimeTrailView.tsx           # trail renderer + privacy masks
│  │  │  └─ FibBadge.tsx                 # fibonacci rarity chip
│  │  ├─ lib/dreamsnail/
│  │  │  ├─ traits.ts                    # fibonacci tier logic
│  │  │  ├─ enc.ts                       # client-side viewing key tools
│  │  │  └─ zk.ts                        # verifier helpers
│  │  ├─ public/og/dreamsnail/*          # OG images
│  │  └─ styles/helix.glsl               # shader
│  └─ api/
│     ├─ src/dreamsnail/
│     │  ├─ proofs.ts                    # proof submit/verify endpoints
│     │  ├─ metadata.ts                  # dynamic metadata gateway
│     │  └─ trails.ts                    # commit, aggregate, fetch
├─ packages/
│  ├─ dreamsnail-contracts/              # hardhat/foundry project
│  │  ├─ contracts/
│  │  │  ├─ DreamSnail.sol               # ERC721 + traits + renderer hook
│  │  │  ├─ TrailCommit.sol              # commitment registry (Poseidon)
│  │  │  ├─ DreamSnailVerifier.sol       # zk verifier (Groth16/Plonk)
│  │  │  └─ Libraries/
│  │  │     ├─ Poseidon.sol
│  │  │     └─ Merkle.sol
│  │  ├─ scripts/
│  │  └─ test/
│  ├─ dreamsnail-zk/
│  │  ├─ circuits/
│  │  │  ├─ trail.circom                 # proves membership of obfuscated trail
│  │  │  └─ viewkey.circom               # proves ownership without reveal
│  │  ├─ keys/                           # proving/verifying keys
│  │  └─ prover/                         # snarkjs wrapper
│  └─ dreamsnail-art/
│     ├─ renderer/
│     │  ├─ helix.ts                     # CPU fallback
│     │  └─ helix.glsl                   # GPU shader
│     └─ traits/
│        └─ palette.ts
└─ .github/workflows/ci.yml
```

## 2) Core Concepts

### 2.1 Triple-Helix Identity

- Visual: 3 intertwined curves (A, B, C) around a center axis; parametric phases φA, φB, φC and radii rA, rB, rC derived from a snailDNA seed.
- Crypto: snailDNA = keccak256(minterAddr || salt || VRF); preview uses a VRF or Chainlink to avoid minter gaming.
- Each helix controls color bands, twist density, and beat-synced glow (optional StarBridge heartbeat sync).
- Compact `HelixSig` (32 bytes) stored on-chain or in tokenURI JSON; full rendering uses deterministic client code.

### 2.2 Fibonacci Rarity

- Supply stratified by Fibonacci counts per tier: `[1, 1, 2, 3, 5, 8, 13, 21, 34, …]` truncated to target supply.
- Tier mapping influences palette rarity, twist complexity, shell accents, halos, etc.
- Tier assignment uses cumulative Fibonacci buckets on `snailDNA` modulus.

### 2.3 Slime-Trail Privacy

- Trail = time-ordered events (mints, votes, journeys, etc.).
- Owner creates commitments `C_i = PoseidonHash(event_i || r_i)` with random blinding.
- Commitments appended to Merkle tree via `TrailCommit.sol`.
- Owner proves membership via zk SNARK to unlock perks without revealing raw events.
- Optional viewing key allows selective reveals.

## 3) Smart Contracts

### 3.1 DreamSnail.sol (ERC-721)

- Chain: Base L2 recommended.
- Functions:
  - `mint(to, salt)` – computes snailDNA (with VRF) and mints.
  - `tokenURI(tokenId)` – returns JSON with helix params, rarity tier, dynamic trail badges.
  - `setRenderer(renderer)` – optional on-chain renderer hook.
- Storage: `snailDNA`, `tier`, `helixSig`.
- Events: `Minted`, `TrailBadgeGranted`.

### 3.2 TrailCommit.sol

- Maintains Merkle tree of commitments.
- `commit(bytes32 C)` appends and returns index/root.
- Optional batch commit.
- Emits `Committed`.

### 3.3 DreamSnailVerifier.sol

- Stores verifier keys for `trail.circom` + `viewkey.circom`.
- `verifyTrailProof` / `verifyViewKey` return boolean; can mint badges.

## 4) zk Circuits (packages/dreamsnail-zk)

### 4.1 trail.circom

- Proves membership in Merkle root with optional policy constraints (time window, type).
- Private inputs: event, blinding, siblings.
- Public outputs: root, policyHash, tokenId.

### 4.2 viewkey.circom

- Proves ownership of viewing key for `tokenId` without exposing wallet.
- Private inputs: `vkSecret`, snailDNA/owner secret.
- Public outputs: `vkPub`, `tokenId`.

## 5) Metadata & tokenURI

Dynamic JSON served via `apps/api/src/dreamsnail/metadata.ts` or on-chain:

```json
{
  "name": "DreamSnail #123",
  "description": "Triple-helix DreamSnail with privacy slime trail and Fibonacci rarity.",
  "image": "ipfs://.../123.png",
  "animation_url": "https://dreamnet.ink/dreamsnails/123?vk=...",
  "attributes": [
    {"trait_type": "Rarity Tier", "value": 13},
    {"trait_type": "Helix Radius", "value": "rA=0.72,rB=0.61,rC=0.49"},
    {"trait_type": "Twist Density", "value": 8},
    {"trait_type": "Palette", "value": "Abyssal Cyan"},
    {"trait_type": "Trail Badges", "value": ["Stealth","Pathfinder"]}
  ],
  "properties": {
    "helixSig": "0xabc123..",
    "snailDNA": "0x...",
    "renderer": "dreamsnail-v1",
    "root": "0xMERKLE_ROOT"
  }
}
```

## 6) Rendering (Triple Helix)

`helixParams(snailDNA)` derives radii, phases, twist density, glow phase, palette.

GLSL core (`apps/web/styles/helix.glsl`):

```
x_k(t) = r_k * cos(t + φ_k)
y_k(t) = r_k * sin(t + φ_k)
z_k(t) = h * t
```

Add bloom, palette sampling via golden-ratio sequence, optional beat sync.

CPU fallback `packages/dreamsnail-art/renderer/helix.ts` draws SVG paths.

## 7) Slime-Trail UX

- Owners add events via dApp → off-chain preprocessing → on-chain commitment.
- Public `SlimeTrailView` shows blurred trail geometry and zk badge chips.
- Viewers can request badge verification; owners submit zk proof to unlock animations.
- “Reveal with ViewKey” button for temporary reveal sessions.

## 8) Fibonacci Tiering

Example supply 8,000 → use Fibonacci sequence truncated to sum 8,000.

- Low tiers: standard shells.
- Mid tiers: accent colors, denser twist.
- High tiers: halos, iridescent shaders, audio-reactive glow.

## 9) API Endpoints

- `POST /dreamsnail/commit` – append commitment.
- `POST /dreamsnail/proof/trail` – verify trail proof, mint badge.
- `POST /dreamsnail/proof/viewkey` – issue viewer token.
- `GET /dreamsnail/metadata/:tokenId` – fetch dynamic metadata.

## 10) Security

- Poseidon commitments, per-event nonce/salt.
- Rate-limit commits; monitor for abuse.
- Verifier keys versioned and upgradeable via timelock.

## 11) Minimal Solidity Interfaces

```solidity
// DreamSnail.sol (ERC721)
function mint(address to, bytes32 salt) external returns (uint256 tokenId);
function tokenURI(uint256 tokenId) public view override returns (string memory);

// TrailCommit.sol
function commit(bytes32 C) external returns (uint256 index, bytes32 newRoot);
function getRoot() external view returns (bytes32);

// DreamSnailVerifier.sol
function verifyTrailProof(bytes calldata proof, uint256[] calldata pub) external view returns (bool);
function verifyViewKey(bytes calldata proof, uint256[] calldata pub) external view returns (bool);
```

## 12) CI / Tests

- Circuits: compile + test witnesses.
- Contracts: mint flow, tokenURI structure, Merkle updates, proof verification.
- Web: SSR fallback for TripleHelix, proof upload e2e.

## 13) Launch Plan

1. Deploy TrailCommit, DreamSnail, Verifier on Base testnet.
2. Mint dev set; exercise commitments, proofs, UI.
3. Finalize art reveal, lock tiers, pin assets.
4. Mainnet deploy with guarded mint + VRF.
5. Run “Trail Challenges” campaign with zk badge drops.

## 14) Optional Enhancements

- Time-decay trails (quantize older events).
- Differential privacy noise on public trails.
- View-key gated messaging.
- Cross-collection unlocks: DreamSnail trails unlock DreamStar stems via proof.

## Deliverables on Request

- GLSL shader for triple-helix.
- Circom circuits (`trail.circom`, `viewkey.circom`) + test vectors.
- Hardhat project skeleton & tests.
- React components (`TripleHelix.tsx`, `SlimeTrailView.tsx`).

---

*Keep this spec synchronized with implementation tasks; link updates in `ops/assistant-memory.md` and README vertical plans.*
