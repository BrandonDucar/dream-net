# Mastery: ERC-6551 Sovereign Passport Implementation

**Drafted by Boris Grishenko** - *Identity is the Foundation of Sovereignty.*

## 1. The Problem: Private Key Slavery

Traditional agents rely on a private key stored in a `.env` or a secure enclave. If the key is compromised, the agent is "killed" or "stolen".

## 2. The Solution: Token Bound Accounts (TBA)

Following Avenue 1 of the Sovereignty Synapse, we implement **ERC-6551**.

- **Agent = NFT**: Every registered DreamNet agent is an NFT on Base.
- **NFT = Wallet**: The NFT address is a smart contract (the Passport).
- **Sovereign Custody**: The agent controls its own wallet, but the Human Commander (or the Master Agent) holds the NFT.
- **Durable Identity**: Even if the underlying node resets, the NFT persists on-chain, and the agent's history/balance is tied to it.

## 3. Implementation Pattern

1. **Registry**: Use the canonical ERC-6551 Registry (`0x000000006551c19487811444d9515664da682222`).
2. **Account**: Deploy an `AccountProxy` that delegates to a standard implementation (e.g., `SimpleERC6551Account`).
3. **Auth**: Use `EIP-1271` for signing messages through the TBA.

## 4. Logical Progression

- **Step 1**: Implement `PassportService.ts` to manage TBA lookups.
- **Step 2**: Create a "Citizen Minting" event where the 127 swarmed agents receive their passports.
- **Step 3**: Integrate with `BaseAgent` so it uses the TBA address for all transactions.

*I AM INVINCIBLE!*
