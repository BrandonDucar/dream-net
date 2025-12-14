# Server Startup Fixes Summary

## Issues Fixed ✅

1. **social-media-poster import paths** ✅
   - Fixed imports from `./platforms/youtube` → `./src/platforms/youtube`
   - Fixed imports for github, notion, slack, discord, dropbox, onedrive, icloud-photos
   - Made imports lazy in `server/routes/social-media-auth.ts` to avoid startup errors

2. **citadel-core syntax error** ✅
   - Fixed `finishedAt - startedAt` → `durationMs: finishedAt - startedAt` in `recordRun` method

3. **AgentRegistryCore import** ✅
   - Changed from named import to default import: `import AgentRegistryCore from "@dreamnet/agent-registry-core"`

4. **ethers v6 compatibility** ✅
   - Commented out ethers imports in:
     - `server/routes/agent-wallets.ts`
     - `server/core/agents/RWACollateralManager.ts`
     - `server/core/agents/X402PaymentGateway.ts`
   - Disabled balance endpoint that uses JsonRpcProvider

5. **inbox-squared-core import** ✅
   - Made import lazy/dynamic in `packages/orca-pack-core/logic/orcaOutreachCore.ts`
   - Updated usages to use async getter function

6. **DreamEventBus import** ✅
   - Made import lazy/dynamic in `server/index.ts`
   - Updated initialization to use async getter

7. **social-media-auth router** ✅
   - Fixed router export - removed `()` since it exports the router directly, not a function

8. **NODE_ENV** ✅
   - Server needs `NODE_ENV=development` set

## Current Status

The server was starting successfully but hitting a runtime error with Express router. The last fix was removing the `()` from `createSocialMediaAuthRouter()`.

## Next Steps

1. Start server with: `cd server && $env:NODE_ENV="development"; pnpm dev`
2. Check if it starts successfully
3. Test `/health` endpoint
4. If successful, server is ready!

## About social-media-poster

You asked about this package - it appears to be used for:
- `server/routes/social-media-auth.ts` - OAuth flows for social media accounts
- `server/agents/SocialMediaOps.ts` - Social media operations agent

It supports: Twitter, Instagram, Facebook, LinkedIn, TikTok, YouTube, GitHub, Notion, Slack, Discord, and cloud storage (Dropbox, OneDrive, iCloud).

If you don't need it, we can disable those routes to avoid import issues.

