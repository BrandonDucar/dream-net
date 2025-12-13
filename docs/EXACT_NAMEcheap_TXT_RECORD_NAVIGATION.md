# Exact Navigation: Add TXT Record in Namecheap

## Step-by-Step Click Path

### Step 1: Log In
1. Go to: **https://www.namecheap.com/myaccount/login/**
2. Enter your username/email and password
3. Click **"Sign In"**

### Step 2: Go to Domain List
**After logging in, you'll be on the dashboard. Look for:**

**Option A (Left Sidebar):**
- Look at the **LEFT SIDEBAR** menu
- Find and click **"Domain List"** (usually near the top, might be under "Domains" section)

**Option B (Top Navigation):**
- Look at the **TOP MENU BAR**
- Hover over or click **"Domain List"** or **"Domains"**
- Click **"Domain List"**

### Step 3: Find dreamnet.ink
1. You'll see a list of all your domains
2. Scroll or search to find **"dreamnet.ink"**
3. Look at the **RIGHT SIDE** of that row
4. You'll see a **"Manage"** button (blue or green button)
5. **Click "Manage"**

### Step 4: Go to Advanced DNS Tab
**You're now on the domain management page. Look at the TOP:**

1. You'll see tabs like: **"Overview"**, **"Domain"**, **"Advanced DNS"**, etc.
2. **Click the "Advanced DNS" tab** (it's usually the 3rd or 4th tab from the left)

### Step 5: Find the DNS Records Section
**After clicking "Advanced DNS", you'll see:**

1. A section called **"Host Records"** or **"DNS Records"**
2. You'll see existing records listed (A records, CNAME records, etc.)
3. Look for a **red button** that says **"+ Add New Record"** or **"Add Record"**
4. **Click the red "+ Add New Record" button**

### Step 6: Fill in the TXT Record Form
**A form will appear. Fill it in EXACTLY like this:**

1. **Type dropdown:** Click it, select **"TXT Record"**
2. **Host field:** Type **`@`** (just the @ symbol, nothing else)
3. **Value field:** Type **`google-site-verification=RVwiiI4d5iDPj49Nx_KEeM61X1-UBI9yLL6rYKSRAwE`**
4. **TTL dropdown:** Leave as **"Automatic"** or select **"Automatic"** (usually default)

### Step 7: Save
**Look for a green checkmark button (✅) or "Save" button:**
- Click the **green checkmark ✅** button
- OR click **"Save All Changes"** if that's what appears

---

## Visual Guide

```
Namecheap Dashboard
    ↓
[Domain List] ← Click here (left sidebar)
    ↓
dreamnet.ink [Manage] ← Click "Manage" button
    ↓
Domain Management Page
    ↓
[Advanced DNS] ← Click this tab (top menu)
    ↓
Host Records Section
    ↓
[+ Add New Record] ← Click red button
    ↓
Form appears:
    Type: [TXT Record ▼]
    Host: [@]
    Value: [google-site-verification=RVwiiI4d5iDPj49Nx_KEeM61X1-UBI9yLL6rYKSRAwE]
    TTL: [Automatic ▼]
    ↓
[✅ Save] ← Click green checkmark
```

---

## Direct URL Shortcuts

**After logging in, you can try these direct URLs:**

- Domain List: `https://ap.www.namecheap.com/domains/list/all`
- Domain Management (if you know the domain ID): `https://ap.www.namecheap.com/domains/domaincontrolpanel/dreamnet.ink`

**Note:** These URLs might redirect you to login first, then take you directly to the right page.

---

## Troubleshooting

**Can't find "Domain List"?**
- Look for "My Domains" or "Domains" in the menu
- Try the top navigation bar instead of sidebar

**Can't find "Advanced DNS" tab?**
- It might be called "DNS" or "DNS Management"
- Look for tabs at the top of the domain management page

**Don't see "+ Add New Record" button?**
- Scroll down - it might be below existing records
- Look for any red button or "+" icon

**Form fields look different?**
- Namecheap sometimes updates their UI
- Look for fields labeled: Type, Host, Value/Address, TTL
- Make sure Type = TXT Record, Host = @, Value = the google verification string

---

## What You're Looking For

**The form should look something like this:**

```
┌─────────────────────────────────────┐
│ Add New Record                      │
├─────────────────────────────────────┤
│ Type:     [TXT Record ▼]           │
│ Host:     [@              ]         │
│ Value:    [google-site-verification=...] │
│ TTL:      [Automatic ▼]             │
│                                     │
│           [✅ Save]  [Cancel]       │
└─────────────────────────────────────┘
```

**Fill it in, click Save, and you're done!**

