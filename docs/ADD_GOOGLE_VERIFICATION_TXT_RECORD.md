# Add Google Site Verification TXT Record to Namecheap

## Step-by-Step Instructions

### Step 1: Log in to Namecheap
1. Go to: **https://www.namecheap.com/myaccount/login/**
2. Enter your credentials and log in

### Step 2: Navigate to Domain List
1. Once logged in, look at the **left sidebar**
2. Click **"Domain List"** (should be near the top of the sidebar)

### Step 3: Find dreamnet.ink
1. In the domain list, find **dreamnet.ink**
2. Look at the **right side** of the row for **dreamnet.ink**
3. Click the **"Manage"** button (it's on the right side of the domain row)

### Step 4: Open Advanced DNS
1. You should now be on the domain management page
2. Look at the **top menu tabs**
3. Click **"Advanced DNS"** tab

### Step 5: Add New Record
1. Scroll down to the DNS records section
2. Look for the **red "+ Add New Record"** button
3. Click it

### Step 6: Enter TXT Record Details
Fill in these exact values:

- **Type:** Select **"TXT Record"** from the dropdown
- **Host:** Enter **`@`** (just the @ symbol)
- **Value:** Enter **`google-site-verification=RVwiiI4d5iDPj49Nx_KEeM61X1-UBI9yLL6rYKSRAwE`**
- **TTL:** Select **"Automatic"** (or leave as default)

### Step 7: Save the Record
1. Click the **green Checkmark ✅** button to save
2. The record should appear in your DNS records list

### Step 8: Verify (Optional)
1. Wait 5-10 minutes for DNS propagation
2. You can verify it worked by running:
   ```bash
   nslookup -type=TXT dreamnet.ink
   ```
   Or use an online DNS checker like https://mxtoolbox.com/TXTLookup.aspx

---

## Quick Reference

**Direct Links:**
- Login: https://www.namecheap.com/myaccount/login/
- Domain List: https://ap.www.namecheap.com/domains/list/all
- DNS Management: After clicking "Manage" on dreamnet.ink, go to "Advanced DNS" tab

**Record Details:**
```
Type: TXT Record
Host: @
Value: google-site-verification=RVwiiI4d5iDPj49Nx_KEeM61X1-UBI9yLL6rYKSRAwE
TTL: Automatic
```

---

## Congratulations on the Clean Deploy! 🎉

Your DreamNet is now live! Once you add this TXT record, Google Search Console will be able to verify ownership of dreamnet.ink.

