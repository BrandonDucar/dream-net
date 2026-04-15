# DreamNet Unified Deployment Platform

## We ARE the Deployment Platform!

Instead of being dependent on Vercel or any single hosting provider, DreamNet **IS** the deployment platform. We provide a unified API that can deploy to **15+ hosting platforms** or use our own native DreamNet platform.

## Philosophy

**Why be dependent on Vercel when we can BE Vercel?**

DreamNet's deployment system:
- ✅ Deploys to any platform (or all platforms simultaneously)
- ✅ Uses DreamNet's native platform by default (no external dependencies)
- ✅ Provides unified API for all platforms
- ✅ Logs all deployments and integrations
- ✅ Never locked into a single vendor

## Supported Platforms

### 1. DreamNet Native (Primary)
- **Provider**: `dreamnet`
- **URL**: `https://{project}.dreamnet.ink`
- **Features**: CDN, auto-scaling, custom domains
- **No external dependencies required!**

### 2. Traditional Hosting Platforms
- **Vercel** (`vercel`) - Frontend hosting
- **Netlify** (`netlify`) - Static sites + serverless
- **Railway** (`railway`) - Backend hosting
- **Cloudflare Pages** (`cloudflare-pages`) - Edge hosting
- **Render** (`render`) - Full-stack hosting
- **Fly.io** (`fly-io`) - Edge computing
- **AWS Amplify** (`aws-amplify`) - AWS hosting
- **Azure Static Web Apps** (`azure-static-web-apps`) - Microsoft hosting
- **GitHub Pages** (`github-pages`) - Free static hosting
- **Surge.sh** (`surge`) - Simple static hosting
- **Firebase Hosting** (`firebase-hosting`) - Google hosting
- **DigitalOcean App Platform** (`digitalocean-app-platform`) - DO PaaS
- **Heroku** (`heroku`) - Traditional PaaS
- **Pixl** (`pixl`) - Website builder platform

## API Usage

### Deploy to Single Platform

```bash
POST /api/deployment/deploy
{
  "platform": "dreamnet",
  "projectName": "my-app",
  "sourceDirectory": "client/dist",
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "environmentVariables": {
    "NODE_ENV": "production"
  },
  "customDomain": "myapp.dreamnet.ink"
}
```

### Deploy to All Platforms

```bash
POST /api/deployment/deploy-all
{
  "projectName": "my-app",
  "sourceDirectory": "client/dist",
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist"
}
```

### List Available Platforms

```bash
GET /api/deployment/platforms
```

### Get Deployment Status

```bash
GET /api/deployment/status/:deploymentId?platform=dreamnet
```

## Integration with Website AI Designer

The Website AI Designer integration (`/api/website-designer`) can automatically deploy generated websites to any platform:

```typescript
// Generate website code
const code = await generateWebsiteCode({
  description: "A modern portfolio website",
  pages: ["Home", "About", "Contact"],
  style: "Modern"
});

// Deploy to DreamNet platform (or any platform)
const deployment = await deploy({
  platform: "dreamnet",
  projectName: "portfolio-site",
  sourceDirectory: "./generated-website",
  // ... code files
});
```

## Environment Variables

Each platform requires its own API token/key:

- `VERCEL_TOKEN` - Vercel
- `NETLIFY_TOKEN` - Netlify
- `RAILWAY_TOKEN` - Railway
- `CLOUDFLARE_API_TOKEN` - Cloudflare Pages
- `RENDER_API_KEY` - Render
- `FLY_API_TOKEN` - Fly.io
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` - AWS Amplify
- `AZURE_STATIC_WEB_APPS_API_TOKEN` - Azure
- `GITHUB_TOKEN` - GitHub Pages
- `SURGE_TOKEN` / `SURGE_LOGIN` - Surge
- `FIREBASE_TOKEN` - Firebase
- `DIGITALOCEAN_ACCESS_TOKEN` - DigitalOcean
- `HEROKU_API_KEY` - Heroku
- `PIXL_API_KEY` - Pixl (if available)

**Note**: DreamNet Native platform requires NO environment variables!

## Benefits

1. **No Vendor Lock-in**: Deploy to any platform or use DreamNet native
2. **Multi-Platform Deployment**: Deploy to all platforms simultaneously
3. **Unified API**: Same API for all platforms
4. **Native Platform**: No external dependencies for DreamNet deployments
5. **Integration Logging**: All deployments logged in integrations inventory
6. **Flexibility**: Choose the best platform for each project

## Implementation

The deployment system is implemented in:
- `packages/deployment-core/` - Core deployment abstraction
- `server/routes/deployment.ts` - API routes
- `DREAMNET_INTEGRATIONS_INVENTORY.md` - All platforms logged

## Future Enhancements

- Auto-detection of best platform for each project
- Cost optimization across platforms
- Performance monitoring and comparison
- Automatic failover between platforms
- Custom deployment strategies per project type

---

**DreamNet: We don't depend on platforms. We ARE the platform.** 🚀

