# DreamNet Kubernetes Migration Guide

## Overview

This guide transitions DreamNet from Docker Compose on Docker Desktop to Kubernetes for true multi-node scaling, achieving 100+ agent capacity while maintaining current architecture.

## Current State → Target State

**Current (Docker Compose):**
- Single Docker Desktop host (8GB RAM, 14 CPUs)
- 31 containers, ~50% utilization
- Manual scaling, no orchestration
- Bottleneck: Host resources exhausted at ~40 containers

**Target (Kubernetes):**
- Multi-node cluster (3-10 nodes)
- 100-500+ agent capacity
- Automatic scaling, self-healing
- Resource isolation per workload
- Distributed observability

## Prerequisites

### 1. Kubernetes Cluster Setup (Choose One)

**Option A: Local Development (minikube/kind)**
```bash
# Install minikube
brew install minikube
minikube start --cpus=8 --memory=16384 --driver=docker

# Or kind
kind create cluster --config kind-config.yaml
```

**Option B: Cloud Production (AWS/GCP/Azure)**
```bash
# AWS EKS
eksctl create cluster --name dreamnet --region us-east-1 --nodes=3

# GCP GKE
gcloud container clusters create dreamnet --num-nodes=3 --machine-type=n1-standard-4

# Azure AKS
az aks create --resource-group myResourceGroup --name dreamnet --node-count 3
```

### 2. Install Required Tools

```bash
# kubectl - cluster control
brew install kubectl

# Helm - package management
brew install helm

# kustomize - configuration management
brew install kustomize

# Prometheus Operator (for monitoring)
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

## Migration Path

### Phase 1: Infrastructure Layer (Week 1)

#### 1.1 Deploy Core Infrastructure

**Namespace Setup:**
```bash
kubectl create namespace dreamnet
kubectl label namespace dreamnet name=dreamnet
```

**ConfigMaps for Configuration:**
- Redis connection strings
- API endpoints
- Environment variables

**Secrets for Sensitive Data:**
- API keys (Gemini, Telegram, etc.)
- Database credentials
- Private keys

#### 1.2 Deploy Data Layer

**Redis (dreamnet_nerve):**
- StatefulSet with persistent volume
- Service for internal/external access
- Health checks and resource limits

**Postgres (clawedette-db + trading-organ):**
- StatefulSet with persistent volumes
- Backup cronjob for snapshots
- Point-in-time recovery setup

#### 1.3 Deploy Message Layer

**NATS (Message Bus):**
- StatefulSet cluster mode (3-5 replicas)
- JetStream for persistence
- Network policies for security

### Phase 2: Service Layer (Week 2)

#### 2.1 Deploy Core Services

**Control Core:**
- Deployment with 2-3 replicas
- Resource requests/limits
- Readiness/liveness probes
- Service discovery via DNS

**Antigravity (Orchestrator):**
- Deployment (single replica, high resource)
- Service for swarm coordination
- PersistentVolumeClaim for state

**Clawedette (Governor):**
- Deployment with 1-2 replicas
- ConfigMap for gnosis/blackboard
- Service for API access

#### 2.2 Deploy Agent Services

**Agent Spawn Service:**
- Deployment with operator pattern
- DynamicServiceAccount for pod creation
- Role/RoleBinding for Kubernetes API access

**Agent Health Monitor:**
- Deployment with metrics export
- Prometheus scrape config
- Alert rules

**Agent Message Bus:**
- NATS cluster integration
- JetStream subjects pre-created

### Phase 3: Observability Layer (Week 3)

#### 3.1 Monitoring Stack

**Prometheus:**
- StatefulSet with persistent volume
- ConfigMap for scrape configs
- Service for Grafana access

**Grafana:**
- Deployment with dashboards
- ConfigMap for provisioned datasources
- Ingress for web access

**Jaeger (Distributed Tracing):**
- All-in-one deployment (dev) or full deployment (prod)
- Service for agent instrumentation
- Storage backend (Elasticsearch or Cassandra)

#### 3.2 Logging Stack

**Loki:**
- StatefulSet or DaemonSet
- ConfigMap for scrape configs
- Integration with Grafana

**Promtail:**
- DaemonSet on all nodes
- ConfigMap for log pipelines
- Service monitors for Prometheus

### Phase 4: Backup & Disaster Recovery (Week 4)

#### 4.1 Snapshot Strategy

**Automated Backups:**
- Redis: nightly snapshots to S3
- Postgres: hourly snapshots + WAL archiving
- Etcd: continuous backup
- ConfigMaps/Secrets: git-backed

#### 4.2 Disaster Recovery

**RTO (Recovery Time Objective):** <15 minutes
**RPO (Recovery Point Objective):** <1 hour

**Restore Procedure:**
1. Restore infrastructure (namespaces, PVCs)
2. Restore data (Redis, Postgres, Etcd)
3. Redeploy services
4. Verify health checks

## Kubernetes Manifests Structure

```
k8s/
├── base/
│   ├── namespace.yaml
│   ├── configmaps/
│   │   ├── redis-config.yaml
│   │   ├── prometheus-config.yaml
│   │   ├── jaeger-config.yaml
│   │   └── blackboard-config.yaml
│   ├── secrets/
│   │   ├── api-keys.yaml
│   │   ├── db-credentials.yaml
│   │   └── jwt-secrets.yaml
│   ├── storage/
│   │   ├── redis-pvc.yaml
│   │   ├── postgres-pvc.yaml
│   │   └── prometheus-pvc.yaml
│   ├── services/
│   │   ├── redis-service.yaml
│   │   ├── postgres-service.yaml
│   │   ├── nats-service.yaml
│   │   └── api-service.yaml
│   ├── deployments/
│   │   ├── control-core.yaml
│   │   ├── antigravity.yaml
│   │   ├── clawedette.yaml
│   │   ├── agent-spawn.yaml
│   │   └── monitoring-stack.yaml
│   ├── statefulsets/
│   │   ├── redis.yaml
│   │   ├── postgres.yaml
│   │   ├── nats-cluster.yaml
│   │   └── prometheus.yaml
│   ├── jobs/
│   │   ├── backup-cronjob.yaml
│   │   └── migration-job.yaml
│   └── rbac/
│       ├── serviceaccount.yaml
│       ├── role.yaml
│       └── rolebinding.yaml
├── overlays/
│   ├── development/
│   │   ├── kustomization.yaml
│   │   └── patches/
│   ├── staging/
│   │   ├── kustomization.yaml
│   │   └── patches/
│   └── production/
│       ├── kustomization.yaml
│       └── patches/
└── helm/
    ├── values.yaml
    ├── Chart.yaml
    └── templates/
```

## Scaling Strategy

### Horizontal Pod Autoscaling (HPA)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: agent-spawn-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: agent-spawn-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Vertical Pod Autoscaling (VPA)

For right-sizing resource requests based on actual usage.

### Node Autoscaling

For cloud clusters: automatically add nodes when pods can't be scheduled.

## Monitoring & Observability

### Prometheus Metrics

**Key metrics to track:**
- Pod CPU/memory utilization
- Service latency (P50, P95, P99)
- Request rates by service
- Error rates
- Agent creation/deletion rate

### Grafana Dashboards

1. **Cluster Overview** - node health, resource utilization
2. **Service Health** - per-service metrics, error rates
3. **Agent Swarm** - agent count, task distribution
4. **Infrastructure** - disk usage, network I/O
5. **Cost Analysis** - resource usage by namespace/service

### Jaeger Tracing

**Instrument all services:**
- API calls between services
- Database queries
- Redis operations
- Agent spawn/task execution

**Sample traces:**
- Request from Clawedette → API → Redis
- Agent spawn workflow
- Task execution pipeline

## Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: dreamnet-isolation
spec:
  podSelector:
    matchLabels:
      app: dreamnet
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: dreamnet
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: dreamnet
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: TCP
      port: 53  # DNS
```

## Rollback Plan

### If Kubernetes deployment fails:

1. **Keep Docker Compose running** during transition (parallel operation)
2. **Traffic routing:** Use load balancer to split traffic (Docker Compose 50%, K8s 50%)
3. **Gradual migration:** Service by service, verify health at each step
4. **Rollback procedure:**
   ```bash
   # 1. Route all traffic back to Docker Compose
   # 2. Delete K8s namespace
   kubectl delete namespace dreamnet
   # 3. Restore from Docker Compose
   docker compose up -d
   # 4. Verify all services healthy
   ```

## Migration Checklist

- [ ] Kubernetes cluster provisioned and healthy
- [ ] Namespaces and RBAC configured
- [ ] ConfigMaps and Secrets created
- [ ] Storage provisioners configured
- [ ] Redis migrated (data validation)
- [ ] Postgres migrated (data validation)
- [ ] NATS cluster deployed
- [ ] Control Core deployed and healthy
- [ ] Antigravity deployed and healthy
- [ ] Clawedette deployed and healthy
- [ ] Agent services deployed
- [ ] Prometheus/Grafana collecting metrics
- [ ] Jaeger receiving traces
- [ ] Backup cronjobs running
- [ ] Network policies applied
- [ ] HPA/VPA configured
- [ ] Load tests passing
- [ ] Rollback procedures tested
- [ ] Team trained on K8s operations
- [ ] Documentation updated

## Timeline

- **Week 1:** Infrastructure layer (Redis, Postgres, NATS)
- **Week 2:** Service layer (Control Core, Antigravity, Clawedette, Agent services)
- **Week 3:** Observability (Prometheus, Grafana, Jaeger, Loki)
- **Week 4:** Backup/DR, optimization, production readiness

**Total migration time: 4 weeks to production**

## Cost Analysis

**Docker Desktop:** ~$20/month (laptop resource)

**Kubernetes (3 nodes, m5.xlarge on AWS):**
- Compute: ~$300/month
- Storage (EBS): ~$50/month
- Networking: ~$30/month
- Total: ~$380/month

**ROI:** 10x agent capacity + unlimited scaling + production-grade SLAs

## Next Steps

1. Choose deployment target (local/cloud)
2. Review manifests in `k8s/base/`
3. Customize for your environment
4. Deploy infrastructure layer
5. Run migration validation tests
6. Gradual traffic migration
7. Monitor and optimize

---

This migration unlocks unlimited scaling for the DreamNet organism while maintaining current architecture and adding enterprise-grade reliability.
