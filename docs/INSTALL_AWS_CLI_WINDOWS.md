# Install AWS CLI on Windows
## Correct Installation Steps

**Error**: You tried to run the URL as a command - that's a download link, not a command!

---

## ✅ Correct Way to Install

### Option 1: Download and Install MSI (Easiest)

1. **Download the installer**:
   - Go to: https://awscli.amazonaws.com/AWSCLIV2.msi
   - Or copy this URL and paste in your browser
   - Download the `.msi` file

2. **Run the installer**:
   - Double-click the downloaded `AWSCLIV2.msi` file
   - Follow the installation wizard
   - Click "Next" → "Install" → "Finish"

3. **Verify installation**:
   ```powershell
   aws --version
   ```
   Should show: `aws-cli/2.x.x`

---

### Option 2: Use Chocolatey (If You Have It)

```powershell
choco install awscli
```

---

### Option 3: Use Winget (Windows Package Manager)

```powershell
winget install Amazon.AWSCLI
```

---

## 🔧 After Installation

**Close and reopen PowerShell** (so it picks up the new PATH)

**Then verify**:
```powershell
aws --version
```

**Configure AWS**:
```powershell
aws configure
```

**Enter**:
- AWS Access Key ID: [from AWS Console]
- AWS Secret Access Key: [from AWS Console]
- Default region: `us-east-1`
- Default output format: `json`

---

## ✅ Quick Check

After installing, run:
```powershell
aws sts get-caller-identity
```

Should show your AWS account: `001092882186`

---

**TL;DR**: Download the `.msi` file from the URL, don't run the URL as a command! 😊

