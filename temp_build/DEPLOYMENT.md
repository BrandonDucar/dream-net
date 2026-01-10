# Deployment Guide for dreamnet.ink

## Vercel Deployment Setup

### Prerequisites
- Vercel account connected to your GitHub repository
- Custom domain: dreamnet.ink
- Environment variables configured

### Environment Variables Required
Add these to your Vercel project settings:

```bash
# Database
DATABASE_URL=your_neon_database_url
PGHOST=your_pg_host
PGDATABASE=your_pg_database  
PGUSER=your_pg_user
PGPASSWORD=your_pg_password
PGPORT=5432

# Runtime
NODE_ENV=production
```

### Deployment Steps

1. **Connect Repository to Vercel**
   ```bash
   # Install Vercel CLI if needed
   npm i -g vercel
   
   # Login and link project
   vercel login
   vercel --prod
   ```

2. **Configure Custom Domain**
   - In Vercel Dashboard → Project → Settings → Domains
   - Add: dreamnet.ink
   - Configure DNS records as shown by Vercel

3. **Build Configuration**
   - Build Command: `vite build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

4. **Deploy**
   ```bash
   # Deploy to production
   vercel --prod
   ```

### DNS Configuration for dreamnet.ink
Point your domain to Vercel:
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### Post-Deployment
Your Dream Network Intelligence Platform will be live at:
- https://dreamnet.ink
- All four intelligence systems operational
- DreamScope dashboard accessible at /dreamscope
- Admin panel at /admin

### Intelligence Systems Status
✓ DREAMKEEPER Core: Network monitoring
✓ AI Surgeon: Automated maintenance  
✓ Defense Network: Real-time threat detection
✓ Evolution Engine: Adaptive system improvement