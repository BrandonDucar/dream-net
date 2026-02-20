# Kubernetes Deployment Guide - DreamNet

## Quick Start (minikube local)

### 1. Create Kubernetes Cluster

```bash
# Install minikube if needed
brew install minikube

# Start cluster with adequate resources
minikube start \
  --cpus=8 \
  --memory=16384 \
  --driver=docker \
  --kubernetes-version=v1.28.0
```

### 2. Deploy DreamNet Infrastructure

```bash
# Create namespace and core infrastructure
kubectl apply -f k8s/base/00-namespace-config.yaml
kubectl apply -f k8s/base/10-redis.yaml
kubectl apply -f k8s/base/20-postgres.yaml
kubectl apply -f k8s/base/30-nats.yaml
kubectl apply -f k8s/base/40-prometheus.yaml
kubectl apply -f k8s/base/50-jaeger.yaml

# Wait for all deployments to be ready
kubectl wait --for=condition=ready pod -l app=dreamnet -n dreamnet --timeout=300s
```

### 3. Access Services

```bash
# Port forward for local access
kubectl port-forward -n dreamnet svc/prometheus 9090:9090 &
kubectl port-forward -n dreamnet svc/jaeger-query 16686:16686 &
kubectl port-forward -n dreamnet svc/redis 6379:6379 &

# URLs:
# Prometheus: http://localhost:9090
# Jaeger: http://localhost:16686
# Redis CLI: redis-cli -h localhost -p 6379
```

## Deployment Checklist

- [ ] Kubernetes cluster created
- [ ] Namespace created
- [ ] RBAC configured
- [ ] Redis StatefulSet ready (1/1)
- [ ] Postgres StatefulSet ready (1/1)
- [ ] NATS cluster ready (3/3)
- [ ] Prometheus ready (1/1)
- [ ] Jaeger ready (1/1)
- [ ] Port forwards established
- [ ] Data accessible via tools
- [ ] Metrics being collected
- [ ] Alerts configured

## Scaling

### To 5 NATS nodes:
```bash
kubectl scale statefulset nats -n dreamnet --replicas=5
```

### To add more storage:
```bash
# Update PVC and restart StatefulSet
kubectl patch pvc redis-pvc -n dreamnet -p '{"spec":{"resources":{"requests":{"storage":"50Gi"}}}}'
kubectl rollout restart statefulset/redis -n dreamnet
```

## Troubleshooting

```bash
# Check all resources
kubectl get all -n dreamnet

# Check pod status
kubectl describe pod redis-0 -n dreamnet

# View logs
kubectl logs redis-0 -n dreamnet

# Execute commands in pod
kubectl exec -it redis-0 -n dreamnet -- redis-cli ping
```

## Next: Deploy DreamNet Services

Once infrastructure is ready, deploy:
- Control Core
- Antigravity
- Clawedette
- Agent services

See `KUBERNETES_SERVICES.md` for service deployments.
