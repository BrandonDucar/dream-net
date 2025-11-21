# Local Authentication Setup
## What You Need to Run Locally

Since I can't authenticate directly, here's what **you need to run** to connect to Google Cloud and AWS.

---

## 🔵 Google Cloud Setup

### Step 1: Install Google Cloud CLI

**Windows (PowerShell)**:
```powershell
# Download and install from:
# https://cloud.google.com/sdk/docs/install

# Or use Chocolatey:
choco install gcloudsdk
```

**Or use Firebase CLI** (easier if you already have it):
```bash
npm install -g firebase-tools
```

### Step 2: Authenticate

**Option A: Google Cloud CLI**
```bash
gcloud auth login
gcloud config set project dreamnet-62b49
```

**Option B: Firebase CLI** (if you prefer)
```bash
firebase login
firebase projects:list
# Should show dreamnet-62b49
```

### Step 3: Verify

```bash
# Check if authenticated
gcloud auth list

# Check project
gcloud config get-value project
# Should show: dreamnet-62b49
```

### Step 4: Get Token (for me to use)

**Firebase Token** (easiest):
```bash
firebase login:ci
# Copy the token it gives you
```

**Or Service Account** (more secure):
1. Go to Google Cloud Console
2. IAM & Admin → Service Accounts
3. Create service account
4. Download JSON key
5. Save path to JSON file

---

## 🟠 AWS Setup

### Step 1: Install AWS CLI

**Windows (PowerShell)**:
```powershell
# Download MSI installer from:
# https://awscli.amazonaws.com/AWSCLIV2.msi

# Or use Chocolatey:
choco install awscli
```

### Step 2: Configure AWS

```bash
aws configure
```

**It will ask for**:
- AWS Access Key ID: [you'll get this from AWS Console]
- AWS Secret Access Key: [you'll get this from AWS Console]
- Default region: `us-east-1`
- Default output format: `json`

### Step 3: Get AWS Credentials

**From AWS Console**:
1. Go to AWS Console → IAM → Users
2. Click your user (or create new one)
3. Security Credentials tab
4. Create Access Key
5. Copy Access Key ID and Secret Access Key

**Or if you have them already**:
```bash
aws configure set aws_access_key_id YOUR_KEY
aws configure set aws_secret_access_key YOUR_SECRET
aws configure set region us-east-1
```

### Step 4: Verify

```bash
# Check if configured
aws sts get-caller-identity

# Should show:
# {
#   "Account": "001092882186",
#   "UserId": "...",
#   "Arn": "..."
# }
```

---

## 📋 Quick Checklist

### Google Cloud
- [ ] Install `gcloud` CLI OR `firebase` CLI
- [ ] Run `gcloud auth login` OR `firebase login`
- [ ] Set project: `gcloud config set project dreamnet-62b49`
- [ ] Verify: `gcloud auth list`
- [ ] Get token: `firebase login:ci` (if using Firebase)

### AWS
- [ ] Install `aws` CLI
- [ ] Get Access Key ID and Secret from AWS Console
- [ ] Run `aws configure`
- [ ] Verify: `aws sts get-caller-identity`
- [ ] Should show Account: 001092882186

---

## 🔐 After You Authenticate

Once you're authenticated locally, I can:

1. **Use your credentials** (if set as environment variables)
2. **Deploy via scripts** (they'll use your local auth)
3. **Access cloud services** (via APIs)

**What I need from you**:
- ✅ Confirmation you're authenticated
- ✅ AWS Access Key ID + Secret (if deploying to AWS)
- ✅ Firebase token OR service account path (if deploying to Google Cloud)

---

## 🚀 Then I Can Deploy

**Google Cloud**:
```bash
# You run locally:
gcloud auth login
gcloud config set project dreamnet-62b49

# Then I can run:
bash scripts/deploy-google-cloud.sh
```

**AWS**:
```bash
# You run locally:
aws configure
# Enter your credentials

# Then I can run:
bash scripts/deploy-aws.sh
```

---

## 💡 Pro Tip

**If you're already logged into IDX/Firebase**:
- You might already be authenticated!
- Check: `firebase projects:list`
- If it shows `dreamnet-62b49`, you're good!

---

**Run these locally, then let me know when you're authenticated and I'll handle the deployment!** 🚀

