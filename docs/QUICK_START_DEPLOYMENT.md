# 🚀 Quick Start - Deploy DreamNet to Cloud

**Date**: 2025-01-27  
**Goal**: Get DreamNet running on Kubernetes + Data Pools in 15 minutes

---

## ⚡ Quick Commands

### 1. Authenticate (You Do - 2 min)
```bash
gcloud auth login
gcloud auth application-default login
```

### 2. Enable APIs (Automated - 2 min)
```bash
pnpm enable:gcp-apis
```

### 3. Deploy! (Automated - 10 min)
```bash
# Deploy data infrastructure first
pnpm deploy:data-gcp

# Then deploy to Kubernetes
pnpm deploy:gke
```

**That's it!** DreamNet will be running on GKE with auto-scaling, load balancing, and data infrastructure.

---

## 📊 What Gets Created

### Kubernetes
- ✅ GKE cluster with 3-10 nodes (auto-scaling)
- ✅ DreamNet API deployment (3-20 pods)
- ✅ Frontend deployment
- ✅ Load balancer with SSL
- ✅ Ingress routing

### Data Infrastructure
- ✅ Cloud SQL Postgres (primary database)
- ✅ BigQuery (analytics warehouse)
- ✅ Redis cache (Memorystore)

### Auto-Scaling
- ✅ Horizontal Pod Autoscaler (HPA)
- ✅ Cluster Autoscaler
- ✅ CPU/Memory-based scaling

---

## 🎯 After Deployment

### Get Service URLs
```bash
# Get ingress IP
kubectl get ingress

# Get service IPs
kubectl get services
```

### Monitor
```bash
# Watch pods
kubectl get pods -w

# View logs
kubectl logs -f deployment/dreamnet-api

# Check HPA
kubectl get hpa
```

### Scale
```bash
# Manual scale (or let HPA do it)
kubectl scale deployment dreamnet-api --replicas=10
```

---

## 🔧 Troubleshooting

### APIs Not Enabled
```bash
# Check billing
gcloud billing projects describe dreamnet-62b49

# Enable APIs manually if needed
gcloud services enable container.googleapis.com --project=dreamnet-62b49
```

### Authentication Issues
```bash
# Check current account
gcloud auth list

# Set account
gcloud config set account brandonducar1234@gmail.com

# Verify credentials
gcloud auth application-default print-access-token
```

### Cluster Creation Fails
- Check billing is enabled
- Check APIs are enabled
- Check IAM permissions
- Check quotas (usually fine for new projects)

---

## 📈 What's Next

After initial deployment:
1. **Monitor costs** - Check billing dashboard
2. **Optimize** - Right-size resources
3. **Scale** - Add more regions
4. **Enhance** - Add GPU nodes for AI workloads

---

**Ready?** Just authenticate and run the commands above! 🚀

