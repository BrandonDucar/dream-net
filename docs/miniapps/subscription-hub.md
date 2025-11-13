# Subscription Hub Mini App

The Subscription Hub mini app lets creators launch subscription tiers with on-chain payments and NFT access badges on Base. It is built on top of the DreamNet mini app framework.

## Smart Contracts

The mini app relies on two contracts deployed to Base (Mainnet or Sepolia):

- `SubscriptionHub.sol` – manages creator plans, payments, and renewals
- `SubscriptionBadge.sol` – ERC1155 contract that mints badges to active subscribers

Deploy both contracts with Hardhat:

```bash
# Configure RPC + private key in .env
# BASE_SEPOLIA_RPC_URL=...
# PRIVATE_KEY=0x...

pnpm hardhat run scripts/contracts/deploy.ts --network baseSepolia
```

The deployment script outputs the contract addresses and sets the hub as the badge minter. Record these values for the frontend.

## Environment Variables

Add the following variables to `client/.env` (or your Vercel project):

```bash
VITE_SUBSCRIPTION_HUB_ADDRESS=0xYourHubAddress
VITE_SUBSCRIPTION_BADGE_ADDRESS=0xYourBadgeAddress
VITE_BASE_RPC_URL=https://sepolia.base.org # or mainnet RPC
VITE_BASE_CHAIN_ID=84532 # 8453 for mainnet
```

The RPC URL is used for read-only queries when a wallet is not connected. The chain ID helps render the correct Base network.

## Running the Mini App

The Subscription Hub is registered at `/miniapps/subscription-hub`. Users can:

- Browse live creator plans with pricing, intervals, and badge IDs
- Subscribe/renew (auto-handling token approval + minting badges)
- Cancel subscriptions (burns badge and stops renewals)
- View badge status and next renewal date

Creators can:

- Define plan name, description, payment token, price, interval, and badge metadata URI
- Publish plans directly from the UI (writes to `SubscriptionHub`)
- View a summary of their live plans

## Base Manifest & Publishing Flow

When you are ready to publish the mini app inside Base:

1. Deploy the frontend to Vercel (GitHub → Vercel build pipeline already configured).
2. Visit the deployed URL and verify the app works with the deployed contracts.
3. Sign into Base Build with `ghostmint.base.eth` and use the account association tool to generate `accountAssociation` credentials.
4. Update `minikit.config.ts` (or your manifest file) with the app metadata and the signed credentials.
5. Push to `main` so Vercel redeploys with the updated manifest.
6. Preview at `https://base.dev/preview?url=YOUR_APP_URL` and submit for publishing in the Base app marketplace.

## Testing Checklist

- [ ] Deploy contracts to Base Sepolia and set env variables
- [ ] Verify plan creation and subscription flows with a test ERC20 token
- [ ] Confirm badges mint + burn correctly during subscribe/cancel
- [ ] Ensure token approval prompts only appear when necessary
- [ ] Test creator dashboard UX (plan list, status badges)
- [ ] Confirm fallback RPC fetches plans when wallet is disconnected

Document any Base manifest updates or contract redeploys in this file to keep the team in sync.
