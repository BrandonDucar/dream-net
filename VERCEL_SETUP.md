# Vercel Deployment Setup for dreamnet.ink

## Step 1: Connect Repository to Vercel

### Option A: From Replit (Recommended)
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Connect your GitHub account if needed
4. Import this Replit project repository

### Option B: Direct GitHub Connection
1. Push this Replit to GitHub first
2. Connect GitHub repository to Vercel

## Step 2: Configure Project Settings

In Vercel Dashboard:
- **Framework Preset**: Other
- **Root Directory**: `./` (keep default)
- **Build Command**: `vite build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

## Step 3: Environment Variables

Add in Vercel Project Settings → Environment Variables:
```
DATABASE_URL=your_neon_database_connection_string
NODE_ENV=production
PGHOST=your_postgres_host
PGDATABASE=your_database_name
PGUSER=your_username
PGPASSWORD=your_password
PGPORT=5432
```

## Step 4: Configure Custom Domain

1. In Vercel Dashboard → Project → Settings → Domains
2. Add domain: `dreamnet.ink`
3. Configure DNS at your domain registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.19.19
   
   Type: CNAME  
   Name: www
   Value: cname.vercel-dns.com
   ```

## Step 5: Deploy

Click "Deploy" button or:
```bash
npm install -g vercel
vercel login
vercel --prod
```

## Expected Result

Your Dream Network Intelligence Platform will be live at:
- https://dreamnet.ink
- https://www.dreamnet.ink

All systems operational:
- DREAMKEEPER Core monitoring
- AI Surgeon automated maintenance
- Defense Network real-time protection  
- Evolution Engine adaptive improvement
- DreamScope unified dashboard at /dreamscope

## Troubleshooting

- Build failing? Check environment variables are setomain not working? DNS propagation can take up to 24 hours <! trigger redeploy --> 
- API errors? Verify DATABASE_URL is correct
- 4rrors? Check vercel.json routing configuration
- <!-- trigger redeploy -->

<!-- redeploy v2.0-rc1 commit -->
