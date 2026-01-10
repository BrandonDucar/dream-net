# 🦴 Super Spine & Compute Engine Disks Strategy

## 🎯 What is Super Spine?

**Super Spine** = DreamNet's agent coordination backbone
- Manages 143+ agents
- Coordinates agent access
- Handles subscriptions
- Routes tasks to agents
- Tracks agent stats

## 💾 Current Storage (In-Memory)

Right now, Super Spine stores data **in memory** - this means:
- ❌ Data lost on restart
- ❌ Not shared across instances
- ❌ Not persistent

## ✅ Should Super Spine Use Persistent Disks?

### **YES - For Compute Engine VMs**

**Architecture:**
```
Compute Engine VM
├── Boot Disk (OS + App)
└── Persistent Disk (Super Spine Data)
    ├── /data/super-spine/
    │   ├── agents.json (agent registry)
    │   ├── subscriptions.json
    │   ├── tasks.json
    │   └── stats.json
```

### **For Cloud Run (Current Setup):**

**Use Cloud SQL/AlloyDB instead:**
- Cloud Run is stateless (no persistent disks)
- Super Spine data → PostgreSQL database
- Shared across all Cloud Run instances
- Automatic backups

## 🏗️ Implementation Strategy

### Option 1: Cloud Run (Current) → Use Database
```typescript
// Super Spine stores in PostgreSQL
// Shared across all instances
// Automatic persistence
```

### Option 2: Compute Engine → Use Persistent Disk
```bash
# Create disk
gcloud compute disks create super-spine-disk \
  --size=50GB \
  --type=pd-ssd \
  --zone=us-central1-a

# Mount at /data/super-spine
```

### Option 3: Hybrid → Database + Disk Cache
```typescript
// Database for persistence
// Disk cache for performance
// Best of both worlds
```

## 🔧 How to Use Disks

### Create Persistent Disk:
```bash
gcloud compute disks create super-spine-disk \
  --size=50GB \
  --type=pd-ssd \
  --zone=us-central1-a \
  --project=aqueous-tube-470317-m6
```

### Attach to VM:
```bash
gcloud compute instances attach-disk INSTANCE_NAME \
  --disk=super-spine-disk \
  --zone=us-central1-a
```

### Mount in VM:
```bash
sudo mkdir -p /data/super-spine
sudo mount /dev/disk/by-id/google-super-spine-disk /data/super-spine
```

### Configure Super Spine:
```typescript
// server/core/SuperSpine.ts
const STORAGE_PATH = process.env.SUPER_SPINE_STORAGE_PATH || '/data/super-spine';
```

## 💡 Recommendation

### For Cloud Run (Now):
- ✅ **Use Cloud SQL/AlloyDB** for Super Spine data
- ✅ No disks needed (Cloud Run is stateless)
- ✅ Database handles persistence

### For Compute Engine (Future):
- ✅ **Use Persistent Disk** for Super Spine
- ✅ Mount at `/data/super-spine`
- ✅ Store agent registry, subscriptions, tasks
- ✅ Survives VM restarts

## 🎯 Super Spine = Backbone Storage

**Super Spine stores:**
- Agent registry (143+ agents)
- Agent subscriptions
- Task queue
- Agent stats
- Access control data

**This should be persistent!**

---

**TL;DR: For Cloud Run → Use database. For Compute Engine → Use persistent disk!**

