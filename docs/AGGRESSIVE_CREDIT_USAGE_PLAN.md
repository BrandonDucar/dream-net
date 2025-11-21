# Aggressive Credit Usage Plan

**Date**: 2025-01-27  
**Strategy**: Aggressive initial deployment → Monitor → Scale back or ramp up  
**Governor Mode**: Respects DreamNet governor limits (QPS, concurrency, queue limits)

---

## 💰 Available Credits

### AWS Free Tier (12 months from account creation)
- **Account**: `001092882186`
- **Free Tier Includes**:
  - **EC2**: 750 hours/month (t2.micro/t3.micro)
  - **S3**: 5 GB storage, 20K GET requests, 2K PUT requests
  - **EBS**: 10 GB General Purpose SSD
  - **Data Transfer**: 15 GB OUT/month
  - **Lambda**: 1M requests/month, 400K GB-seconds
  - **ECR**: 10 GB storage
  - **App Runner**: First 750 hours/month FREE
  - **CloudFront**: 1 TB transfer, 10M requests FREE

**Estimated Value**: ~$200-300/month if fully utilized

### Google Cloud Platform Free Tier
- **Project**: `dreamnet-62b49`
- **Free Credits**: $300 (expires after 90 days)
- **Always Free** (no expiration):
  - **Cloud Storage**: 5 GB total (1 GB Standard + 1 GB each tier)
  - **Network Egress**: 1 GB/month
  - **Cloud Run**: 2M requests/month, 360K GB-seconds, 180K vCPU-seconds
  - **Cloud Build**: 120 build-minutes/day
  - **Cloud Functions**: 2M invocations/month

**Estimated Value**: $300 one-time + ~$50-100/month always-free

---

## 🎯 Phase 1: Aggressive Initial Deployment (Days 1-7)

### Goal: Deploy everything, maximize free tier usage

#### AWS Deployment (Week 1)
**Day 1-2: Infrastructure Setup**
- ✅ Deploy backend to App Runner (750 hours free/month = ~25 hours/day)
- ✅ Deploy frontend to S3 + CloudFront (1 TB free transfer)
- ✅ Set up ECR repository (10 GB free storage)
- **Cost**: $0 (within free tier)

**Day 3-4: Scale Up**
- Deploy multiple Cloud Run services (if needed)
- Enable CloudFront caching
- Set up Lambda functions for background jobs (1M requests free)
- **Cost**: $0 (within free tier)

**Day 5-7: Optimization**
- Monitor usage via CloudWatch
- Optimize container sizes
- Enable auto-scaling (but stay within free tier)
- **Cost**: $0 (within free tier)

#### Google Cloud Deployment (Week 1)
**Day 1-2: Initial Deployment**
- ✅ Deploy to Cloud Run (2M requests/month free = ~66K requests/day)
- ✅ Set up Cloud Storage (5 GB free)
- ✅ Enable Cloud Build (120 minutes/day free)
- **Cost**: $0 (within always-free tier)

**Day 3-4: Scale Up**
- Deploy additional Cloud Run services
- Use Cloud Storage for static assets
- Set up Cloud Functions for webhooks (2M invocations free)
- **Cost**: Minimal (~$5-10/day from $300 credit)

**Day 5-7: Aggressive Usage**
- Maximize Cloud Run usage (within limits)
- Use Cloud Build for CI/CD (120 minutes/day)
- Enable Cloud CDN (if needed)
- **Cost**: Moderate (~$10-20/day from $300 credit)

### Governor Limits (Respect These!)
```typescript
// From client/src/governor/config.ts
maxQPS: 2                    // Max queries per second
maxConcurrency: 5           // Max concurrent requests
queueLimit: 20              // Max queued requests
mode: "canary"              // Canary mode (gradual rollout)
```

**Strategy**: 
- Start with governor limits LOW (canary mode)
- Gradually increase as we validate usage
- Monitor costs vs. free tier limits

---

## 📊 Phase 2: Monitoring & Optimization (Days 8-14)

### Goal: Find optimal usage level, stay within free tier

#### Daily Monitoring
- **AWS**: Check CloudWatch for:
  - App Runner hours used (target: <25 hours/day)
  - S3 storage (target: <5 GB)
  - CloudFront transfer (target: <33 GB/day = 1 TB/month)
  - ECR storage (target: <10 GB)

- **GCP**: Check Cloud Console for:
  - Cloud Run requests (target: <66K/day = 2M/month)
  - Cloud Storage usage (target: <5 GB)
  - Cloud Build minutes (target: <120 minutes/day)
  - Credit remaining (target: >$200 remaining)

#### Optimization Actions
1. **If approaching limits**:
   - Reduce Cloud Run instances
   - Optimize container images (smaller = less storage)
   - Enable caching (reduce requests)
   - Use CDN more aggressively

2. **If well under limits**:
   - Increase Cloud Run instances (but respect governor)
   - Deploy more services
   - Enable more features

3. **Governor Adjustments**:
   ```typescript
   // Week 2: Increase limits gradually
   maxQPS: 5                 // Up from 2
   maxConcurrency: 10       // Up from 5
   queueLimit: 50           // Up from 20
   mode: "open"             // Full rollout if stable
   ```

---

## 🚀 Phase 3: Scale Decision (Days 15-30)

### Decision Point: Scale Back or Ramp Up?

#### Scale Back Scenario (If costs rising)
**Triggers**:
- AWS free tier limits approaching
- GCP credits < $100 remaining
- Usage patterns show waste

**Actions**:
- Reduce Cloud Run instances to minimum viable
- Consolidate services
- Increase caching
- Reduce Cloud Build frequency
- **Target**: $0-10/month total cost

#### Ramp Up Scenario (If usage justified)
**Triggers**:
- High user engagement
- Revenue generating
- Well within free tier limits
- Governor limits not hit

**Actions**:
- Increase Cloud Run instances
- Deploy more services
- Enable premium features
- Increase governor limits
- **Target**: Maximize free tier, then optimize paid usage

---

## 📈 Usage Targets by Phase

### Phase 1 (Aggressive - Days 1-7)
| Service | Target Usage | Free Tier Limit | Status |
|---------|-------------|-----------------|--------|
| **AWS App Runner** | 20 hours/day | 25 hours/day | ✅ Safe |
| **AWS S3 Storage** | 3 GB | 5 GB | ✅ Safe |
| **AWS CloudFront** | 20 GB/day | 33 GB/day | ✅ Safe |
| **GCP Cloud Run** | 50K requests/day | 66K requests/day | ✅ Safe |
| **GCP Cloud Storage** | 3 GB | 5 GB | ✅ Safe |
| **GCP Cloud Build** | 100 min/day | 120 min/day | ✅ Safe |
| **GCP Credits** | ~$15/day | $300 total | ⚠️ Monitor |

### Phase 2 (Optimized - Days 8-14)
| Service | Target Usage | Free Tier Limit | Status |
|---------|-------------|-----------------|--------|
| **AWS App Runner** | 15 hours/day | 25 hours/day | ✅ Optimized |
| **AWS S3 Storage** | 4 GB | 5 GB | ✅ Optimized |
| **AWS CloudFront** | 25 GB/day | 33 GB/day | ✅ Optimized |
| **GCP Cloud Run** | 40K requests/day | 66K requests/day | ✅ Optimized |
| **GCP Cloud Storage** | 4 GB | 5 GB | ✅ Optimized |
| **GCP Cloud Build** | 80 min/day | 120 min/day | ✅ Optimized |
| **GCP Credits** | ~$10/day | $300 total | ✅ Sustainable |

### Phase 3 (Decision - Days 15-30)
**Scale Back**: Reduce to 50% of Phase 2 targets  
**Ramp Up**: Increase to 80% of free tier limits

---

## 🛡️ Governor Integration

### Respecting Governor Limits

**Current Governor Config**:
```typescript
mode: "canary"              // Gradual rollout
maxQPS: 2                   // Conservative start
maxConcurrency: 5           // Low concurrency
queueLimit: 20              // Small queue
```

**Phase 1 Governor Strategy**:
- Start in `canary` mode
- Monitor request patterns
- Gradually increase limits if stable

**Phase 2 Governor Strategy**:
- Move to `open` mode if stable
- Increase `maxQPS` to 5-10
- Increase `maxConcurrency` to 10-20
- Increase `queueLimit` to 50-100

**Phase 3 Governor Strategy**:
- **Scale Back**: Keep limits conservative
- **Ramp Up**: Increase limits aggressively

---

## 📋 Deployment Checklist

### AWS (Week 1)
- [ ] Deploy backend to App Runner
- [ ] Deploy frontend to S3 + CloudFront
- [ ] Set up ECR repository
- [ ] Configure CloudWatch alarms
- [ ] Set up billing alerts
- [ ] Monitor free tier usage

### GCP (Week 1)
- [ ] Deploy to Cloud Run
- [ ] Set up Cloud Storage buckets
- [ ] Configure Cloud Build
- [ ] Set up billing alerts
- [ ] Monitor credit usage
- [ ] Enable always-free services

### Monitoring (Ongoing)
- [ ] Daily cost checks
- [ ] Weekly usage reports
- [ ] Governor limit monitoring
- [ ] Performance metrics
- [ ] User engagement tracking

---

## 🎯 Success Metrics

### Week 1 Goals
- ✅ Both platforms deployed
- ✅ Services running smoothly
- ✅ Within free tier limits
- ✅ Governor limits respected
- ✅ <$50 GCP credits used

### Week 2 Goals
- ✅ Optimized usage patterns
- ✅ Cost per user calculated
- ✅ Governor limits adjusted
- ✅ Performance validated
- ✅ <$100 GCP credits remaining

### Week 3-4 Goals
- ✅ Decision made: Scale back or ramp up
- ✅ Usage patterns established
- ✅ Cost model validated
- ✅ Ready for production scaling

---

## 💡 Pro Tips

1. **Use CloudWatch/Cloud Console Dashboards**: Set up daily cost alerts
2. **Optimize Early**: Smaller containers = less storage = more free tier headroom
3. **Cache Aggressively**: Reduce requests = stay within free tier
4. **Monitor Governor**: Don't hit rate limits = better user experience
5. **Automate Scaling**: Use auto-scaling but set max limits to free tier

---

## 🚨 Red Flags (Scale Back Immediately)

- GCP credits < $50 remaining
- AWS approaching free tier limits
- Governor limits consistently hit
- Cost per user > $0.10/month
- No revenue/user engagement

---

## ✅ Green Lights (Ramp Up)

- GCP credits > $200 remaining
- AWS well under free tier limits
- Governor limits never hit
- High user engagement
- Revenue generating

---

**Status**: Ready to deploy aggressively! 🚀  
**Next**: Run deployment scripts and monitor closely.

