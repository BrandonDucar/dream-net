# Commands to Push to GitHub

## Step 1: Authenticate GitHub CLI (you'll need to complete browser step)

```powershell
gh auth login --hostname github.com -p https -s "repo,workflow,read:org" --web
```

**When prompted:**
1. Copy the code shown (e.g., `03B9-B5C6`)
2. Open the URL in your browser: https://github.com/login/device
3. Paste the code
4. Authorize GitHub CLI
5. Make sure you're logged in as **BDucar** account (not BrandonDucar)

## Step 2: Configure Git to use GitHub CLI credentials

```powershell
gh auth setup-git
git config --global credential.helper "!gh auth git-credential"
```

## Step 3: Verify authentication

```powershell
gh auth status
```

Should show: `Logged in to github.com account BDucar`

## Step 4: Stage and commit any uncommitted changes (if needed)

```powershell
git status
git add client/src/components/auth/login-form.tsx vercel.json
git commit -m "chore: update login form and vercel config"
```

## Step 5: Fetch and push

```powershell
git fetch origin
git push origin main
```

## If push fails, try rebase first:

```powershell
git pull --rebase origin main
git push origin main
```

