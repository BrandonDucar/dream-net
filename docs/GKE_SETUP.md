# Google Kubernetes Engine (GKE) Setup Guide

## Overview

You've created a GKE cluster for DreamNet! This guide will help you connect to it and deploy DreamNet.

## What You've Created

A GKE cluster provides:
- **Container orchestration** - Automatically manages your containers
- **Auto-scaling** - Scales pods based on demand
- **Load balancing** - Distributes traffic across instances
- **High availability** - Runs multiple replicas for reliability
- **Rolling updates** - Zero-downtime deployments

## Quick Start

### 1. Get Your Cluster Details

First, let's see what cluster you created:

```bash
gcloud container clusters list
```

### 2. Connect to Your Cluster

Once you know your cluster name and location, connect to it:

```bash
# Replace CLUSTER_NAME and ZONE with your actual values
gcloud container clusters get-credentials CLUSTER_NAME --zone=ZONE --project=aqueous-tube-470317-m6
```

### 3. Verify Connection

Check that kubectl is connected:

```bash
kubectl get nodes
```

You should see your cluster nodes listed.

### 4. Update Configuration

Update the deployment script with your cluster details:

1. Set environment variables:
   ```bash
   export GKE_CLUSTER_NAME="your-cluster-name"
   export GCP_REGION="your-region"  # e.g., us-central1
   export GCP_PROJECT_ID="aqueous-tube-470317-m6"
   ```

2. Or edit `infrastructure/google/gke/deploy.ts` and update:
   - `CLUSTER_NAME` (line 16)
   - `REGION` (line 15)
   - `PROJECT_ID` (line 14)

### 5. Deploy DreamNet

Once connected, deploy DreamNet:

```bash
pnpm deploy:gke
```

This will:
- Build Docker images
- Push to Google Container Registry
- Deploy to your GKE cluster
- Set up services and ingress

## Manual Deployment Steps

If you prefer to deploy manually:

### 1. Build and Push Images

```bash
# Build API image
gcloud builds submit --tag gcr.io/aqueous-tube-470317-m6/dreamnet-api:latest -f server/Dockerfile .

# Build frontend image (if you have client/Dockerfile)
gcloud builds submit --tag gcr.io/aqueous-tube-470317-m6/dreamnet-frontend:latest -f client/Dockerfile .
```

### 2. Create Secrets

Create Kubernetes secrets for environment variables:

```bash
kubectl create secret generic dreamnet-secrets \
  --from-literal=database-url="YOUR_DATABASE_URL" \
  --from-literal=openai-api-key="YOUR_OPENAI_KEY" \
  --from-literal=node-env="production"
```

### 3. Deploy Application

```bash
# Update image references in deployment.yaml first
kubectl apply -f infrastructure/google/gke/deployment.yaml
kubectl apply -f infrastructure/google/gke/service.yaml
kubectl apply -f infrastructure/google/gke/ingress.yaml
```

### 4. Check Status

```bash
# View pods
kubectl get pods

# View services
kubectl get services

# View ingress
kubectl get ingress

# View logs
kubectl logs -f deployment/dreamnet-api
```

## Configuration Files

- `infrastructure/google/gke/cluster.yaml` - Cluster configuration (if using Config Connector)
- `infrastructure/google/gke/deployment.yaml` - Application deployment
- `infrastructure/google/gke/service.yaml` - Kubernetes services
- `infrastructure/google/gke/ingress.yaml` - Load balancer and SSL
- `infrastructure/google/gke/deploy.ts` - Automated deployment script

## Prerequisites (Before Deploying)

Before running `pnpm deploy:gke`, you need to set up:

### 1. Static IP Address

Create a static IP address for the ingress:

```bash
gcloud compute addresses create dreamnet-ip --global --project=YOUR_PROJECT_ID
```

Verify it was created:
```bash
gcloud compute addresses describe dreamnet-ip --global
```

### 2. Managed SSL Certificate

Create a managed certificate for your domain:

```bash
kubectl apply -f infrastructure/google/gke/ingress.yaml
```

The certificate will be automatically provisioned by GKE. It may take 10-60 minutes to provision.

Check certificate status:
```bash
kubectl describe managedcertificate dreamnet-ssl
```

### 3. DNS Configuration

Point your domain to the static IP:

1. Get the static IP address:
   ```bash
   gcloud compute addresses describe dreamnet-ip --global --format="value(address)"
   ```

2. Update your DNS records:
   - Create an A record: `dreamnet.ink` → `<static-ip>`
   - Create an A record: `www.dreamnet.ink` → `<static-ip>`

3. Wait for DNS propagation (can take up to 48 hours, usually much faster)

### 4. Kubernetes Secrets

Create secrets for environment variables:

```bash
kubectl create secret generic dreamnet-secrets \
  --from-literal=database-url="YOUR_DATABASE_URL" \
  --from-literal=openai-api-key="YOUR_OPENAI_KEY" \
  --from-literal=admin-token="YOUR_ADMIN_TOKEN"
```

Or create a `secrets.yaml` file (don't commit secrets to git!):
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: dreamnet-secrets
type: Opaque
stringData:
  database-url: "postgresql://..."
  openai-api-key: "sk-..."
  admin-token: "your-secret-token"
```

Then apply it:
```bash
kubectl apply -f infrastructure/google/gke/secrets.yaml
```

## Next Steps

1. **Complete prerequisites** (static IP, certificate, DNS, secrets)
2. **Set environment variables** (`GCP_PROJECT_ID`, `GCP_REGION`, `GKE_CLUSTER_NAME`)
3. **Deploy** using `pnpm deploy:gke`

## Useful Commands

```bash
# View cluster details
gcloud container clusters describe CLUSTER_NAME --zone=ZONE

# Scale deployment
kubectl scale deployment dreamnet-api --replicas=5

# Update deployment
kubectl set image deployment/dreamnet-api dreamnet-api=gcr.io/aqueous-tube-470317-m6/dreamnet-api:new-tag

# Port forward for local testing
kubectl port-forward service/dreamnet-api-service 8080:80

# View cluster in console
# https://console.cloud.google.com/kubernetes/clusters
```

## Troubleshooting

- **Can't connect**: Make sure you've run `gcloud container clusters get-credentials`
- **Pods not starting**: Check logs with `kubectl logs <pod-name>`
- **Image pull errors**: Make sure images are pushed to GCR and project ID matches
- **Service not accessible**: Check ingress status and firewall rules

