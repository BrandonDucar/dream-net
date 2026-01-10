# Generate Gmail App Password - Step by Step

## ✅ Current Status
- Password length: ✅ 16 characters (correct)
- Password format: ✅ No spaces (correct)
- Gmail authentication: ❌ Still failing

## 🔧 Solution: Generate a Fresh App Password

### Step 1: Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Scroll to "How you sign in to Google"
3. Click **2-Step Verification**
4. If not enabled, follow the prompts to enable it
5. **You MUST have 2-Step Verification enabled to use App Passwords**

### Step 2: Generate App Password
1. Still on the Security page: https://myaccount.google.com/security
2. Under "How you sign in to Google", click **App passwords**
   - If you don't see "App passwords", make sure 2-Step Verification is enabled first
3. You may need to sign in again
4. Select app: **Mail**
5. Select device: **Other (Custom name)**
6. Type: **DreamNet**
7. Click **Generate**
8. **Copy the 16-character password immediately** (Google only shows it once!)
   - It will look like: `abcd efgh ijkl mnop`
   - **Remove all spaces** when copying to .env

### Step 3: Update .env File
1. Open `.env` in the project root
2. Update the line:
   ```
   WOLFMAIL_SMTP_PASS=xjqsrfjpnsrkeukl
   ```
   Replace `xjqsrfjpnsrkeukl` with your NEW 16-character App Password (no spaces)

3. Save the file

### Step 4: Verify Account
Make sure you're generating the App Password for the **same account** as:
- `WOLFMAIL_FROM_EMAIL=dreamnetgeo@gmail.com`

If `dreamnetgeo@gmail.com` is not your account, you need to:
- Either change `WOLFMAIL_FROM_EMAIL` to your account
- Or generate the App Password for `dreamnetgeo@gmail.com`

### Step 5: Test Again
```bash
pnpm exec tsx scripts/testSmtpConnection.ts
```

## ⚠️ Common Issues

### "App passwords" option doesn't appear
- **Solution**: Make sure 2-Step Verification is enabled first
- It can take a few minutes for the option to appear after enabling 2FA

### "Invalid login" error persists
- **Solution**: Generate a completely NEW App Password
- Old App Passwords can expire or be revoked
- Make sure you're using the App Password, NOT your regular Gmail password

### Wrong account
- **Solution**: The App Password must be for the same account as `WOLFMAIL_FROM_EMAIL`
- Check that both are for `dreamnetgeo@gmail.com`

## 🎯 Quick Checklist
- [ ] 2-Step Verification enabled
- [ ] App Password generated (16 characters)
- [ ] App Password copied with NO spaces
- [ ] `.env` file updated with new password
- [ ] Password is for the same account as `WOLFMAIL_FROM_EMAIL`
- [ ] Test script run again

