# 🔐 ENV AUDIT: Operational Surface & Secret Analysis

**Objective**: To identify active, required, and redundant secrets in the DreamNet ecosystem.

## 1. Intelligence Tiers (Active)

| Key | Provider | Status | Recommendation |
| :--- | :--- | :--- | :--- |
| `ANTHROPIC_API_KEY` | Anthropic | **ACTIVE** | Core for the "Sovereign Symbiote" strategy. |
| `OPENAI_API_KEY` | OpenAI | **ACTIVE** | Backup/Evaluation engine. |
| `AI_GATEWAY_API_KEY` | Vercel/Gateway | **ACTIVE** | Used for routing requests to specialized models. |

## 2. Financial Pipeline (Active)

| Key | Provider | Status | Recommendation |
| :--- | :--- | :--- | :--- |
| `STRIPE_SECRET_KEY` | Stripe | **ACTIVE** | Required for `DreamShop` and `Academy` billing. |
| `STRIPE_WEBHOOK_SECRET`| Stripe | **ACTIVE** | Critical for event-driven payment confirmation. |

## 3. The War Chest (Crypto Keys)

| Key | Chain | Utility | Recommendation |
| :--- | :--- | :--- | :--- |
| `HOT_SENDER_PK` | EVM | Automated shunting. | **CAUTION**: Keep in sharded storage. |
| `PHANTOM_PRIVATE_KEY`| Solana | MEV/Order flow. | Required for Project Archimedes. |
| `PRIVATE_KEY` | EVM | General deployment. | Used by `dreamnet-snail-core`. |

## 4. Communications Bridge (Active)

| Key | Provider | Status | Recommendation |
| :--- | :--- | :--- | :--- |
| `TELEGRAM_BOT_TOKEN` | Telegram | **ACTIVE** | Used for user notifications and Mini-Apps. |
| `WOLFMAIL_SMTP_PASS` | Gmail | **ACTIVE** | App Password for `WolfPack` funding outreach. |
| `TWILIO_AUTH_TOKEN` | Twilio | **ACTIVE** | Voice/SMS gateway for high-priority alerts. |

## 5. Infrastructure Command (Active)

| Key | Provider | Status | Recommendation |
| :--- | :--- | :--- | :--- |
| `RAILWAY_TOKEN` | Railway | **ACTIVE** | Deployment/Hosting management. |
| `VERCEL_API_KEY` | Vercel | **ACTIVE** | Frontend/Edge deployment management. |

## 6. Gap Analysis (What's Missing/Redundant)

* **Missing**: `NEYNAR_API_KEY` is referenced in `ElizaBridge.ts` but missing from `.env`. This blocks Farcaster connectivity.
* **Redundant**: Multiple `DATABASE_URL` entries (lines 19 vs 72). Suggest standardizing to the Neon East-1 pooler URL for better performance.
* **Redundant**: `PUBLISHABLE_STRIPE` and `VITE_STRIPE_PUBLIC` are identical. Standardize to `VITE_` prefix for frontend exposure.

---
**Status**: Audit complete. Immediate Action: Add `NEYNAR_API_KEY` to restore social hijacking.
