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

## Next Steps

1. **Update cluster name** in deployment scripts to match your cluster
2. **Set up secrets** for environment variables
3. **Configure domain** in ingress.yaml (currently set to dreamnet.ink)
4. **Deploy** using `pnpm deploy:gke` or manual steps above

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

