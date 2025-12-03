# Deploy Token Balance Mini App to Vercel

## Quick Deploy Steps

1. **Navigate to the Mini App directory:**
   ```bash
   cd miniapps/token-balance
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Build the app:**
   ```bash
   pnpm build
   ```

4. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

   If this is your first time:
   - It will ask you to link to a project
   - Choose "Create new project"
   - Name it: `dreamnet-token-balance`
   - Follow the prompts

5. **After deployment, you'll get a URL like:**
   ```
   https://dreamnet-token-balance.vercel.app
   ```

6. **Update the manifest** (`public/.well-known/farcaster.json`):
   - Replace all URLs with your actual Vercel URL
   - Update `homeUrl`, `iconUrl`, `splashImageUrl`, etc.

7. **Setup Account Association:**
   - Go to: https://build.base.org/account-association
   - Paste your Vercel URL
   - Click "Submit" then "Verify"
   - Copy the `accountAssociation` fields to the manifest

8. **Redeploy:**
   ```bash
   vercel --prod
   ```

9. **Test:**
   - Use Base Build Preview tool: https://build.base.org/preview
   - Paste your URL and test

10. **Publish:**
    - Post your app URL to Base App

