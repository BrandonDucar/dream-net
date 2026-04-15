# AWS CLI Setup - Complete Guide

## 🎯 Quick Setup (Windows)

### Step 1: Download AWS CLI
1. **Open browser** → Go to: https://awscli.amazonaws.com/AWSCLIV2.msi
2. **Download** the `.msi` file
3. **Run installer** → Follow wizard → Finish

### Step 2: Verify Installation
**Close and reopen PowerShell**, then:
```powershell
aws --version
```
Should show: `aws-cli/2.x.x`

### Step 3: Configure AWS
```powershell
aws configure
```

**Enter**:
- **AWS Access Key ID**: [Get from AWS Console → IAM → Users → Your User → Security Credentials]
- **AWS Secret Access Key**: [Same place]
- **Default region**: `us-east-1` (or `us-gov-east-1` for GovCloud)
- **Default output format**: `json`

### Step 4: Verify Account
```powershell
aws sts get-caller-identity
```

Should show:
```json
{
  "UserId": "...",
  "Account": "001092882186",
  "Arn": "..."
}
```

---

## 🏛️ AWS GovCloud Setup (If Needed)

### For Government/Defense Workloads:

1. **Request GovCloud Access**:
   - Contact AWS Support
   - Use Account ID: `001092882186`
   - Request GovCloud account

2. **Separate Configuration**:
   ```powershell
   # Configure GovCloud profile
   aws configure --profile govcloud
   # Use GovCloud credentials when prompted
   ```

3. **Use GovCloud Profile**:
   ```powershell
   aws s3 ls --profile govcloud
   ```

---

## ✅ Quick Test Commands

```powershell
# Test AWS access
aws sts get-caller-identity

# List S3 buckets (if any)
aws s3 ls

# List EC2 instances (if any)
aws ec2 describe-instances

# Check available regions
aws ec2 describe-regions
```

---

## 🚀 Next Steps

Once AWS CLI is configured:

1. **Deploy to AWS Amplify** (Frontend):
   ```powershell
   aws amplify create-app --name dreamnet
   ```

2. **Deploy to AWS Lambda** (Backend):
   ```powershell
   # Use Serverless Framework or AWS SAM
   ```

3. **Deploy to AWS ECS/Fargate** (Full Stack):
   ```powershell
   # Use Docker + ECS
   ```

---

## 💡 Pro Tips

- **Multiple Profiles**: Use `--profile` flag for different AWS accounts
- **GovCloud**: Separate account, separate credentials
- **Credits**: $100 AWS credits available for commercial AWS
- **Security**: Never commit AWS credentials to Git!

---

**Ready to deploy!** 🚀

