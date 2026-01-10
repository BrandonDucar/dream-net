# Environment Variables Check (DreamNet)

## 1. Required Variables (from `.env.example`)
The repository ships with a `.env.example` file listing the critical environment variables needed for DreamNet to operate:

- `DATABASE_URL` / `NEON_DATABASE_URL` – Postgres connection string for Neon database.
- `JWT_SECRET` – Secret used to sign auth tokens.
- `ADMIN_WALLETS` – Comma‑separated list of privileged wallet addresses.
- `OPENAI_API_KEY` – API key for OpenAI services (Agents, chat, embeddings, etc.).
- `STRIPE_SECRET_KEY` – Secret key for Stripe payment processing.
- `DISCORD_WEBHOOK_URL` – Webhook for Discord notifications.
- `TELEGRAM_BOT_TOKEN` – Token for the Telegram bot used by DreamNet.
- `VITE_DEV_AUTH` – Dev auth token used by the client during development.
- Additional keys: `PUBLIC_KEY`, `ENCRYPTION_KEY`, or others depending on modules.

## 2. Variables Checked by `integrationScanner.cjs`
The `agents/integrationScanner.cjs` script verifies that the following environment variables are set:

- `OPENAI_API_KEY` – Required for OpenAI API calls.
- `TELEGRAM_BOT_TOKEN` – For Telegram integration.
- `GITHUB_TOKEN` – Token used to access GitHub APIs and repos.
- `VERCEL_TOKEN` – Used to trigger Vercel deployments and manage projects.
- `PRIMARY_DOMAIN` – The main domain used for linking subdomains and health checks.

If any of these are missing, the integration scanner logs a warning.

## 3. Current Vercel Configuration
By inspecting the `dreamnet` and `dreamnet-v2` projects on Vercel, the following observations were made:

- Numerous database variables exist (`NEON_DATABASE_POSTGRES_URL`, `NEON_DATABASE_POSTGRES_PASSWORD`, etc.), along with auth and Redis keys such as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `ATLAS_DB_MONGODB_URI`, and `UPSTASH_REDIS_REST_TOKEN`.
- **Missing variables:** there are no entries for `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, or an admin token. Without these, DreamNet cannot interact with OpenAI services, process payments, or authenticate privileged operations.
- Vercel projects do not expose `GITHUB_TOKEN`, `VERCEL_TOKEN`, or `TELEGRAM_BOT_TOKEN`, which will be necessary for agent operations.

## 4. Recommended Actions
1. **Add missing secrets** – Provide the following secrets in Vercel (or a secure secret manager) for both staging and production projects:
   - `OPENAI_API_KEY` – from your OpenAI dashboard.
   - `STRIPE_SECRET_KEY` – from your Stripe account (test and production mode).
   - `ADMIN_TOKEN` or `ADMIN_WALLETS` – to define privileged users.
   - `GITHUB_TOKEN` – a personal access token or GitHub App token with repo read/write and workflow scopes.
   - `VERCEL_TOKEN` – Vercel Personal Access Token to trigger deployments via API.
   - `TELEGRAM_BOT_TOKEN` – the token for your Telegram bot.
   - `PRIMARY_DOMAIN` – e.g. `dreamnet.ink`.

2. **Sync environment across projects** – Ensure that both `dreamnet` and `dreamnet-v2` (or the new unified project) contain identical secrets so local and production builds behave the same.

3. **Document in Ops repository** – Keep the `.env.example` file up to date with any new variables introduced by additional agents or services.

4. **Avoid committing secrets** – Never commit actual secret values to the repository; use Vercel’s environment variable management or a secrets manager (e.g. HashiCorp Vault) instead.

5. **Run integration scanner** – After setting the variables, run `agents/integrationScanner.cjs` locally or in CI to ensure all required keys are present.

## 5. Conclusion
The environment currently lacks several critical secrets necessary for DreamNet to fully operate. Providing these secrets and aligning environment variables across all deployments will enable the agents and services to run correctly.
