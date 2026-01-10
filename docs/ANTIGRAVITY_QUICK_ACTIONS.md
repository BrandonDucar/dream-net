# Antigravity Quick Actions

## 🚨 Immediate Tasks

1. [ ] **Fix Dependencies**: Run `pnpm install @coinbase/onchainkit wagmi viem` in `client/`.
2. [ ] **Verify Build**: Run `pnpm build` in `client/` to ensure no errors.
3. [ ] **Firebase Setup**:
    * [ ] `firebase login`
    * [ ] `firebase use dreamnet-v3-31068600`
    * [ ] `firebase init`
4. [ ] **Vercel Deployment**:
    * [ ] Create project `token-balance-mini-app`.
    * [ ] Deploy `client/` (or specific mini app path).

## ℹ️ Key Info

* **Firebase Project**: `dreamnet-v3-31068600`
* **Cloud Run URL**: `https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app`
* **Token Balance Path**: `client/src/miniapps/template/TokenBalanceApp.tsx`

## ✅ Success Checklist

* [ ] Client builds locally without error.
* [ ] Token Balance app is live on Vercel.
* [ ] Firebase is initialized and linked.
