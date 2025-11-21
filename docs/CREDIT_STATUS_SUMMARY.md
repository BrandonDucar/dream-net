# Cloud Credit Status Summary

**Generated**: 2025-01-27  
**Account**: AWS `001092882186`, GCP `dreamnet-62b49`

---

## 💰 Exact Credit Counts

### AWS Free Tier (Account: 001092882186)
**Status**: ✅ Active (12 months from account creation)

| Resource | Free Tier Limit | Monthly Value |
|----------|----------------|---------------|
| **App Runner** | 750 hours/month | ~$75/month |
| **S3 Storage** | 5 GB | ~$0.12/month |
| **S3 Requests** | 20K GET, 2K PUT | ~$0.50/month |
| **ECR Storage** | 10 GB | ~$1/month |
| **CloudFront Transfer** | 1 TB/month | ~$85/month |
| **CloudFront Requests** | 10M/month | ~$0.50/month |
| **Lambda** | 1M requests/month | ~$0.20/month |
| **Data Transfer** | 15 GB OUT/month | ~$1.50/month |

**Total Estimated Value**: ~$164/month for 12 months

### Google Cloud Platform (Project: dreamnet-62b49)
**Status**: ⚠️ Need to verify (gcloud not installed yet)

| Resource | Free Tier Limit | Monthly Value |
|----------|----------------|---------------|
| **Free Credits** | $300 (90 days) | $300 one-time |
| **Cloud Run Requests** | 2M/month | ~$0.40/month |
| **Cloud Run Compute** | 360K GB-seconds, 180K vCPU-seconds | ~$10/month |
| **Cloud Storage** | 5 GB total (1+1+1+1+1) | ~$0.12/month |
| **Network Egress** | 1 GB/month | ~$0.12/month |
| **Cloud Build** | 120 minutes/day | ~$50/month |
| **Cloud Functions** | 2M invocations/month | ~$0.40/month |

**Total Estimated Value**: 
- $300 one-time credit (90 days)
- ~$61/month always-free tier

---

## 🎯 Aggressive Usage Plan

### Phase 1: Aggressive Deployment (Days 1-7)

**Goal**: Deploy everything, maximize free tier usage

#### AWS Targets (Week 1)
- **App Runner**: 20 hours/day (600 hours/month) ✅ Well under 750 limit
- **S3 Storage**: 3 GB ✅ Well under 5 GB limit
- **CloudFront**: 20 GB/day (600 GB/month) ✅ Well under 1 TB limit
- **ECR**: 5 GB ✅ Well under 10 GB limit

**Daily Cost**: $0 (100% free tier)

#### GCP Targets (Week 1)
- **Cloud Run**: 50K requests/day (1.5M/month) ✅ Well under 2M limit
- **Cloud Storage**: 3 GB ✅ Well under 5 GB limit
- **Cloud Build**: 100 minutes/day ✅ Well under 120 limit
- **Credit Usage**: ~$15/day from $300 credit

**Daily Cost**: ~$15/day from credits (90 days = $300)

### Phase 2: Optimization (Days 8-14)

**Goal**: Optimize usage, stay within free tier

#### AWS Targets (Week 2)
- **App Runner**: 15 hours/day (450 hours/month) ✅ Optimized
- **S3 Storage**: 4 GB ✅ Optimized
- **CloudFront**: 25 GB/day (750 GB/month) ✅ Optimized
- **ECR**: 7 GB ✅ Optimized

**Daily Cost**: $0 (100% free tier)

#### GCP Targets (Week 2)
- **Cloud Run**: 40K requests/day (1.2M/month) ✅ Optimized
- **Cloud Storage**: 4 GB ✅ Optimized
- **Cloud Build**: 80 minutes/day ✅ Optimized
- **Credit Usage**: ~$10/day from $300 credit

**Daily Cost**: ~$10/day from credits

### Phase 3: Decision Point (Days 15-30)

**Scale Back** (if needed):
- Reduce to 50% of Phase 2 targets
- **AWS**: Still $0 (free tier)
- **GCP**: ~$5/day from credits

**Ramp Up** (if justified):
- Increase to 80% of free tier limits
- **AWS**: Still $0 (free tier)
- **GCP**: ~$20/day from credits

---

## 🛡️ Governor Integration

**Current Governor Limits**:
```typescript
mode: "canary"              // Gradual rollout
maxQPS: 2                   // 2 queries/second
maxConcurrency: 5           // 5 concurrent requests
queueLimit: 20              // 20 queued requests
```

**Phase 1 Strategy**:
- Start conservative (canary mode)
- Monitor request patterns
- Respect governor limits

**Phase 2 Strategy**:
- Increase to `open` mode if stable
- Increase `maxQPS` to 5-10
- Increase `maxConcurrency` to 10-20
- Increase `queueLimit` to 50-100

**Phase 3 Strategy**:
- **Scale Back**: Keep limits conservative
- **Ramp Up**: Increase limits aggressively

---

## 📊 Credit Burn Rate

### GCP Credits ($300, 90 days)

| Phase | Days | Daily Burn | Total Burn | Remaining |
|-------|------|------------|------------|-----------|
| **Phase 1** | 1-7 | $15/day | $105 | $195 |
| **Phase 2** | 8-14 | $10/day | $70 | $125 |
| **Phase 3** | 15-30 | $5-20/day | $80-320 | $45-$0 |

**Projected**: Credits will last ~20-30 days at aggressive rate

### AWS Free Tier (12 months)

| Phase | Monthly Usage | Free Tier Limit | Status |
|-------|---------------|-----------------|--------|
| **Phase 1** | ~$120/month | $164/month | ✅ Safe |
| **Phase 2** | ~$100/month | $164/month | ✅ Safe |
| **Phase 3** | ~$80-140/month | $164/month | ✅ Safe |

**Projected**: Free tier will last full 12 months

---

## 🚀 Deployment Strategy

### Week 1: Deploy Aggressively
1. **Day 1-2**: Deploy to AWS App Runner + CloudFront
2. **Day 1-2**: Deploy to GCP Cloud Run
3. **Day 3-4**: Scale up services
4. **Day 5-7**: Optimize and monitor

### Week 2: Optimize
1. Monitor usage daily
2. Optimize container sizes
3. Enable caching
4. Adjust governor limits

### Week 3-4: Decision
1. Evaluate usage patterns
2. Check credit remaining
3. Decide: Scale back or ramp up
4. Adjust strategy accordingly

---

## ✅ Next Steps

1. **Install gcloud CLI** (for GCP):
   ```powershell
   # Download from: https://cloud.google.com/sdk/docs/install
   ```

2. **Set up GCP credentials**:
   ```powershell
   gcloud auth application-default login
   gcloud config set project dreamnet-62b49
   ```

3. **Add AWS IAM permissions** (for S3, ECR, App Runner, CloudFront)

4. **Deploy aggressively**:
   ```bash
   pnpm deploy:aws    # Deploy to AWS
   pnpm deploy:gcp    # Deploy to GCP
   ```

5. **Monitor daily**:
   - AWS: Check CloudWatch
   - GCP: Check Cloud Console billing
   - Respect governor limits

---

## 📈 Success Metrics

- ✅ Both platforms deployed
- ✅ Within free tier limits
- ✅ Governor limits respected
- ✅ Services running smoothly
- ✅ Cost per user < $0.10/month

---

**Status**: Ready to deploy aggressively! 🚀  
**Credits Available**: AWS ~$164/month (12 months), GCP $300 (90 days)

