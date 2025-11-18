# Fix Gmail SMTP Authentication

## ❌ Current Issue
The email failed to send with error:
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted.
```

## ✅ Solution: Set Up Gmail App Password

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** in the left sidebar
3. Under "How you sign in to Google", click **2-Step Verification**
4. Follow the prompts to enable 2FA (if not already enabled)

### Step 2: Generate App Password
1. Still in **Security** settings
2. Under "How you sign in to Google", click **App passwords**
   - If you don't see this option, make sure 2FA is enabled first
3. Select app: **Mail**
4. Select device: **Other (Custom name)**
5. Enter name: **DreamNet Wolf Pack**
6. Click **Generate**
7. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update .env File
1. Open your `.env` file in the project root
2. Update or add:
   ```
   WOLFMAIL_SMTP_PASS=abcdefghijklmnop
   ```
   (Remove spaces from the app password - it should be 16 characters with no spaces)

3. Save the file

### Step 4: Test Again
Run the test script:
```bash
pnpm wolfpack:test
```

## 🔍 Verify Your Settings

Your `.env` should have:
```env
WOLFMAIL_SMTP_PASS=your-16-char-app-password
WOLFMAIL_FROM_EMAIL=dreamnetgeo@gmail.com
TEST_LEAD_EMAIL=brandonducar1234@gmail.com
```

## ⚠️ Important Notes

- **App Password ≠ Regular Password**: You MUST use an App Password, not your regular Gmail password
- **No Spaces**: The app password should be 16 characters with no spaces
- **One-Time Display**: Google only shows the app password once - copy it immediately
- **Account Security**: If you lose the app password, just generate a new one

## 🧪 Quick Test

After updating `.env`, run:
```bash
pnpm exec tsx scripts/checkWolfpackEmailStatus.ts
```

Then run the full test:
```bash
pnpm wolfpack:test
```

## ✅ Success Indicators

When it works, you'll see:
```
[WolfPackMailer] ✓ Email sent successfully to brandonducar1234@gmail.com
```

And you'll receive an email in your inbox!

