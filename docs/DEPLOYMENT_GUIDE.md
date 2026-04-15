# DreamNet Deployment Guide

**Primary Stack:** Google Cloud Platform (Cloud Run + Cloud SQL/AlloyDB + Secret Manager + Cloud Build)

**Legacy Support:** Vercel (frontend-only), Railway (legacy), Neon PostgreSQL (development)

---

## Quick Start: Google Cloud Deployment

### Prerequisites

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed and authenticated: `gcloud auth login`
3. **Node.js 20+** and **pnpm 10.21.0+**
4. **Docker** (for local testing, optional)

### Environment Setup

Create a `.env` file in the repo root with:

```bash
# Required for GCP deployment
GCP_PROJECT_ID=your-gcp-project-id
GCP_REGION=us-central1
GCP_SERVICE_NAME=dreamnet

# Database (Cloud SQL connection string)
DATABASE_URL=postgresql://user:password@host:5432/database

# Optional: Cloud SQL instance connection name
CLOUD_SQL_INSTANCE_CONNECTION_NAME=project:region:instance

# Other required vars
NODE_ENV=production
PORT=8080  # Cloud Run uses PORT env var automatically
```

### Step 1: Deploy Data Infrastructure

Deploy Cloud SQL, BigQuery, and Redis:

```bash
pnpm deploy:data-gcp
```

This creates:
- **Cloud SQL PostgreSQL** instance
- **BigQuery** dataset
- **Memorystore Redis** instance

**Note:** The script will output connection details. Update your `DATABASE_URL` with the Cloud SQL connection string.

### Step 2: Deploy Application to Cloud Run

Deploy the full stack (frontend + backend):

```bash
pnpm deploy:gcp
```

This:
1. Builds the frontend (client/)
2. Builds the backend Docker image
3. Deploys to Cloud Run
4. Configures environment variables
5. Sets up Cloud CDN (optional)

**Output:** You'll get a Cloud Run URL like `https://dreamnet-xxx-uc.a.run.app`

### Step 3: Configure Custom Domain (Optional)

1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Select your service
3. Click "Manage Custom Domains"
4. Add your domain and follow DNS setup instructions

---

## Local Development

### Start Development Server

```bash
# Install dependencies
pnpm install

# Start all services in development mode
pnpm dev

# Or start just the server
pnpm dev:app
```

The server will start on `http://localhost:3000` (or `PORT` env var).

**Note:** The server can start without `DATABASE_URL`, but database features will be unavailable.

### Database Connection

For local development, you can use:

1. **Cloud SQL Proxy** (recommended for production-like testing):
   ```bash
   cloud-sql-proxy project:region:instance
   # Then use: DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
   ```

2. **Neon PostgreSQL** (legacy, for quick dev):
   ```bash
   DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname
   ```

3. **Local PostgreSQL**:
   ```bash
   DATABASE_URL=postgresql://user:pass@localhost:5432/dreamnet
   ```

---

## Deployment Commands Reference

### Primary (Google Cloud)

| Command | Purpose |
|---------|---------|
| `pnpm deploy:data-gcp` | Deploy data infrastructure (Cloud SQL, BigQuery, Redis) |
| `pnpm deploy:gcp` | Deploy full stack to Cloud Run |
| `pnpm deploy:gke` | Deploy to Google Kubernetes Engine (advanced) |

### Alternative (AWS)

| Command | Purpose |
|---------|---------|
| `pnpm deploy:aws` | Deploy to AWS App Runner |
| `pnpm deploy:data-aws` | Deploy AWS data infrastructure |
| `pnpm deploy:eks` | Deploy to Amazon EKS |

### Legacy (Optional)

| Command | Purpose |
|---------|---------|
| `pnpm deploy:vercel-legacy` | Deploy frontend to Vercel (legacy) |
| `pnpm vercel-build` | Build for Vercel |
| `pnpm vercel:monitor` | Monitor Vercel builds |

---

## Environment Variables

### Required for Google Cloud

| Variable | Description | Example |
|----------|-------------|---------|
| `GCP_PROJECT_ID` | Google Cloud project ID | `aqueous-tube-470317-m6` |
| `GCP_REGION` | GCP region | `us-central1` |
| `GCP_SERVICE_NAME` | Cloud Run service name | `dreamnet` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |

### Optional (Feature-Specific)

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | AI features |
| `ANTHROPIC_API_KEY` | Claude AI features |
| `STRIPE_SECRET_KEY` | Payment processing |
| `TWILIO_ACCOUNT_SID` | SMS/voice features |
| `VERCEL_TOKEN` | Vercel integration (legacy) |

### Feature Flags

| Variable | Default | Purpose |
|----------|---------|---------|
| `INIT_HEAVY_SUBSYSTEMS` | `false` | Enable DreamState, Directory, etc. |
| `INIT_SUBSYSTEMS` | `false` | Enable all subsystems |
| `MESH_AUTOSTART` | `true` | Auto-start mesh network |

---

## Database Configuration

### Primary: Google Cloud SQL

The database layer automatically detects the provider from `DATABASE_URL`:

- **Cloud SQL**: Uses standard `pg` driver (primary path)
- **Neon**: Uses `@neondatabase/serverless` driver (legacy path)

**Cloud SQL Connection Formats:**

1. **Direct connection** (if allowed):
   ```bash
   DATABASE_URL=postgresql://user:password@[IP_ADDRESS]:5432/database
   ```

2. **Cloud SQL Proxy** (recommended):
   ```bash
   CLOUD_SQL_INSTANCE_CONNECTION_NAME=project:region:instance
   DATABASE_URL=postgresql://user:password@/database?host=/cloudsql/project:region:instance
   ```

3. **Unix socket** (Cloud Run):
   ```bash
   DATABASE_URL=postgresql://user:password@/database?host=/cloudsql/project:region:instance
   ```

### Legacy: Neon PostgreSQL

For backward compatibility, Neon is still supported:

```bash
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/database
```

The system automatically detects `neon.tech` in the URL and uses the Neon driver.

---

## Troubleshooting

### Server Won't Start

1. **Check environment variables:**
   ```bash
   echo $DATABASE_URL
   echo $GCP_PROJECT_ID
   ```

2. **Check logs:**
   ```bash
   # Local
   pnpm dev:app

   # Cloud Run
   gcloud run services logs read dreamnet --project=your-project-id
   ```

3. **Database connection issues:**
   - Verify `DATABASE_URL` format
   - Check Cloud SQL instance is running
   - Verify network access (Cloud SQL Proxy or authorized networks)

### Deployment Fails

1. **Check gcloud authentication:**
   ```bash
   gcloud auth list
   gcloud config get-value project
   ```

2. **Verify project permissions:**
   ```bash
   gcloud projects get-iam-policy your-project-id
   ```

3. **Check Cloud Build logs:**
   ```bash
   gcloud builds list --project=your-project-id
   ```

### Database Connection Errors

- **"Connection refused"**: Check Cloud SQL instance status and network configuration
- **"Authentication failed"**: Verify database user credentials in `DATABASE_URL`
- **"Database does not exist"**: Create the database in Cloud SQL console

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  Google Cloud Platform                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌─────────────┐│
│  │  Cloud Run  │───▶│  Cloud SQL  │    │  BigQuery   ││
│  │  (App)      │    │ (Postgres)  │    │  (Analytics)││
│  └──────────────┘    └──────────────┘    └─────────────┘│
│         │                                              │
│         │                                              │
│  ┌──────────────┐    ┌──────────────┐                │
│  │ Secret       │    │ Memorystore  │                │
│  │ Manager      │    │ (Redis)      │                │
│  └──────────────┘    └──────────────┘                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Cloud Run** serves both:
- Frontend static files (built from `client/`)
- Backend API (from `server/`)

**Cloud SQL** is the primary database (replaces Neon).

**Secret Manager** stores sensitive environment variables.

**Cloud Build** handles CI/CD (via build triggers or manual `gcloud builds submit`).

---

## Legacy Provider Migration

### From Vercel

If you were using Vercel for frontend:

1. **Update API routes**: Change `vercel.json` rewrites to point to Cloud Run URL
2. **Environment variables**: Migrate from Vercel dashboard to Cloud Run or Secret Manager
3. **Custom domain**: Update DNS to point to Cloud Run instead of Vercel

### From Railway

If you were using Railway:

1. **Database**: Migrate from Railway Postgres to Cloud SQL
2. **Environment variables**: Export from Railway, import to Cloud Run
3. **Deployment**: Use `pnpm deploy:gcp` instead of Railway auto-deploy

### From Neon

If you were using Neon directly:

1. **Export data**: Use `pg_dump` to export from Neon
2. **Import to Cloud SQL**: Use `psql` or Cloud SQL import
3. **Update DATABASE_URL**: Change connection string to Cloud SQL format

---

## Next Steps

- **Monitoring**: Set up Cloud Monitoring and Alerting
- **Logging**: Configure Cloud Logging exports
- **Scaling**: Configure Cloud Run auto-scaling
- **CI/CD**: Set up Cloud Build triggers for automatic deployments
- **Backup**: Configure Cloud SQL automated backups

For more details, see:
- `docs/GOOGLE_CLOUD_COMPLETE_ECOSYSTEM.md`
- `infrastructure/README.md`
- `docs/INFRA_REFACTOR_INVENTORY.md`

