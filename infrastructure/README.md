# DreamNet Infrastructure Deployment

This directory contains deployment scripts and configurations for Google Cloud Platform and AWS.

---

## 🎯 Overview

DreamNet uses a unified deployment approach:
- **Frontend**: Static SPA (React + Vite) served as static files
- **Backend**: Express + TypeScript server serving both API routes and frontend static files

### Deployment Targets

**Google Cloud Platform:**
- **Service**: Cloud Run (containerized)
- **Architecture**: Single container serving both frontend and backend
- **Database**: Cloud SQL (PostgreSQL) - optional migration from Neon

**AWS:**
- **Frontend**: S3 + CloudFront (static hosting)
- **Backend**: App Runner (containerized) or ECS Fargate
- **Database**: Aurora PostgreSQL - optional migration from Neon

---

## 🚀 Quick Start

### Prerequisites

1. **Google Cloud Platform** (for `deploy:gcp`):
   ```bash
   # Install gcloud CLI
   # https://cloud.google.com/sdk/docs/install
   
   # Authenticate
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **AWS** (for `deploy:aws`):
   ```bash
   # Install AWS CLI
   # https://aws.amazon.com/cli/
   
   # Configure credentials
   aws configure
   ```

3. **Environment Variables**:
   - Create `.env.gcp` for Google Cloud deployments
   - Create `.env.aws` for AWS deployments
   - See `ENVIRONMENT_MANIFEST.md` for all required variables

### Deploy to Google Cloud

```bash
# Set GCP project (if not already set)
export GCP_PROJECT_ID=your-project-id
export GCP_REGION=us-central1

# Deploy
pnpm deploy:gcp
```

This will:
1. Build the frontend (`client/dist`)
2. Build Docker image (`server/Dockerfile`)
3. Push to Google Container Registry
4. Deploy to Cloud Run
5. Print service URL

### Deploy to AWS

```bash
# Set AWS configuration (if needed)
export AWS_REGION=us-east-1
export AWS_S3_BUCKET=dreamnet-frontend-prod

# Deploy
pnpm deploy:aws
```

This will:
1. Build the frontend (`client/dist`)
2. Upload frontend to S3
3. Create/update CloudFront distribution (if configured)
4. Build and push Docker image to ECR
5. Deploy backend to App Runner
6. Print service URLs

---

## 📁 Directory Structure

```
infrastructure/
├── README.md                 # This file
├── google/
│   └── deploy-all.ts        # GCP deployment script
└── aws/
    └── deploy-all.ts        # AWS deployment script
```

---

## ⚙️ Configuration

### Environment Variables

Deployment scripts automatically load environment variables from:
1. `.env.gcp` or `.env.aws` files (if present)
2. Current shell environment variables
3. Default values (where applicable)

**Required for Google Cloud:**
- `GCP_PROJECT_ID` or `GOOGLE_CLOUD_PROJECT` (default: `dreamnet-62b49`)
- `GCP_REGION` or `GOOGLE_CLOUD_REGION` (default: `us-central1`)

**Required for AWS:**
- AWS credentials configured via `aws configure`
- `AWS_REGION` (default: `us-east-1`)

**Optional:**
- `GCP_SERVICE_NAME` (default: `dreamnet`)
- `AWS_S3_BUCKET` (default: auto-generated)
- `AWS_APP_RUNNER_SERVICE` (default: `dreamnet-backend`)
- `AWS_ECR_REPOSITORY` (default: `dreamnet`)

See `ENVIRONMENT_MANIFEST.md` for complete list of all environment variables.

---

## 🐳 Docker Configuration

The backend uses `server/Dockerfile` which:
- Uses Node.js 20 slim base image
- Installs pnpm
- Builds backend TypeScript code
- Exposes port 8080
- Includes health check endpoint

**Note**: The Dockerfile builds the backend only. The frontend is built separately and served as static files by the Express server.

---

## 🔄 Rollback

### Google Cloud Run

```bash
# List revisions
gcloud run revisions list --service dreamnet --region us-central1

# Rollback to previous revision
gcloud run services update-traffic dreamnet \
  --to-revisions PREVIOUS_REVISION=100 \
  --region us-central1
```

### AWS App Runner

```bash
# List operations
aws apprunner list-operations --service-arn SERVICE_ARN --region us-east-1

# Rollback via AWS Console or update service configuration
```

---

## 🏗️ Architecture Decisions

### Why Cloud Run for GCP?

- **Simplicity**: Single container serving both frontend and backend
- **Serverless**: Auto-scaling, pay-per-use
- **Cost-effective**: Free tier available, competitive pricing
- **Integration**: Easy integration with Cloud SQL, Cloud Storage, etc.

### Why S3 + CloudFront + App Runner for AWS?

- **Frontend**: S3 + CloudFront provides CDN benefits and low latency
- **Backend**: App Runner provides serverless container hosting similar to Cloud Run
- **Separation**: Frontend and backend can scale independently
- **Cost**: S3 storage is very cheap, CloudFront has free tier

### Alternative: ECS Fargate

If App Runner doesn't meet requirements, backend can be deployed to ECS Fargate:
- More control over container configuration
- Better for long-running processes
- Requires more setup (VPC, load balancer, etc.)

---

## 🔍 Troubleshooting

### Google Cloud

**Build fails:**
```bash
# Check Cloud Build logs
gcloud builds list --limit=5
gcloud builds log BUILD_ID
```

**Deployment fails:**
```bash
# Check Cloud Run logs
gcloud run services logs read dreamnet --region us-central1 --limit=50
```

**Permission errors:**
- Ensure `gcloud auth login` is run
- Check IAM permissions: Cloud Run Admin, Cloud Build Editor

### AWS

**S3 upload fails:**
```bash
# Check AWS credentials
aws sts get-caller-identity

# Check S3 permissions
aws s3 ls
```

**ECR push fails:**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

**App Runner deployment fails:**
- Check IAM permissions: `apprunner:CreateService`, `ecr:GetAuthorizationToken`
- Verify ECR repository exists and image is accessible
- Check App Runner service logs in AWS Console

---

## 📊 Monitoring

### Google Cloud Run

- **Logs**: `gcloud run services logs read dreamnet --region us-central1`
- **Metrics**: Cloud Console → Cloud Run → Metrics
- **Health**: `/health` and `/ready` endpoints

### AWS

- **Logs**: CloudWatch Logs (App Runner service logs)
- **Metrics**: CloudWatch Metrics
- **Health**: `/health` and `/ready` endpoints

---

## 🔐 Security Best Practices

1. **Never commit `.env.gcp` or `.env.aws` files**
2. **Use Secret Manager (GCP) or Secrets Manager (AWS) for sensitive values**
3. **Rotate API keys regularly**
4. **Use least-privilege IAM roles**
5. **Enable Cloud Run authentication if needed** (remove `--allow-unauthenticated`)

---

## 🚧 Future Improvements

- [ ] Terraform/Pulumi infrastructure as code
- [ ] CI/CD integration (GitHub Actions, Cloud Build)
- [ ] Multi-region deployment
- [ ] Database migration scripts (Neon → Cloud SQL/Aurora)
- [ ] Automated rollback on health check failures
- [ ] Blue-green deployments
- [ ] Cost monitoring and alerts

---

## 📚 Related Documentation

- `ENVIRONMENT_MANIFEST.md` - Complete environment variable reference
- `server/Dockerfile` - Backend container configuration
- `docs/CURRENT_SYSTEM_STATUS.md` - System status and architecture
- `docs/COMPREHENSIVE_SYSTEM_REPORT.md` - Detailed system report

---

**Maintained By**: DreamOPS  
**Last Updated**: 2025-01-27

