# Token Balance Mini App

A standalone Base Mini App for viewing token balances on Base L2.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set environment variables (create `.env` file):
```bash
VITE_TOKEN_ADDRESS=0x...  # Your ERC20 token address
```

3. Run development server:
```bash
pnpm dev
```

4. Build for production:
```bash
pnpm build
```

## Deployment to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. After deployment, update `public/.well-known/farcaster.json`:
   - Update `homeUrl` with your Vercel URL
   - Update all image URLs
   - Add your Base Account address to `baseBuilder.ownerAddress`

4. Setup Account Association:
   - Go to [Base Build Account Association Tool](https://build.base.org/account-association)
   - Paste your Vercel URL
   - Click "Submit" then "Verify"
   - Copy the `accountAssociation` fields and paste into `public/.well-known/farcaster.json`

5. Redeploy to Vercel with updated manifest

6. Test using [Base Build Preview Tool](https://build.base.org/preview)

7. Publish by posting your app URL to Base App

## Base Mini App SDK

This app uses `@farcaster/miniapp-sdk` to integrate with Base App. The SDK is initialized in `src/App.tsx` and calls `sdk.actions.ready()` when the app loads to hide the loading splash screen.

