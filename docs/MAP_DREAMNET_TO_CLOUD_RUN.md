# Map dreamnet.ink to Google Cloud Run

## Current Cloud Run URL
`https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app`

## Steps to Map Domain

### Step 1: Set Up Domain Mapping in Google Cloud Console

1. Go to: **Google Cloud Console** → **Cloud Run** → **Your Service**
2. Click **"MANAGE CUSTOM DOMAINS"** or **"Add Mapping"**
3. Enter: `dreamnet.ink`
4. Google will provide **4 A records** (IP addresses) that look like:
   ```
   A Record 1: 151.101.1.195
   A Record 2: 151.101.65.195
   A Record 3: (another IP)
   A Record 4: (another IP)
   ```

### Step 2: Remove URL Redirect Record in Namecheap

Currently you have:
- **URL Redirect Record** for `@` → `http://www.dreamnet.ink/`

This needs to be **removed** before adding A records.

### Step 3: Add A Records in Namecheap

After Google provides the 4 A records:
1. Go to Namecheap Advanced DNS
2. Click **"Add New Record"**
3. Add **4 separate A records**:
   - **Type:** A Record
   - **Host:** `@` (for all 4)
   - **Value:** (IP address from Google - one per record)
   - **TTL:** Automatic

### Step 4: Wait for Propagation

- DNS changes take 5-30 minutes to propagate
- Google will verify the domain mapping
- Once verified, `dreamnet.ink` will point to your Cloud Run service

---

## Alternative: Quick Test with CNAME (www only)

If you want to test quickly with `www.dreamnet.ink` first:

1. Remove current CNAME for `www` (parkingpage.namecheap.com)
2. Add new CNAME:
   - **Type:** CNAME Record
   - **Host:** `www`
   - **Value:** `dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app`
   - **TTL:** Automatic

**Note:** CNAME doesn't work for root domain (`@`), only subdomains. For `dreamnet.ink` (root), you MUST use A records from Google Cloud domain mapping.

---

## Current DNS Records

- ✅ TXT Record: `@` → `google-site-verification=...` (for Google Search Console)
- ⚠️ URL Redirect: `@` → `http://www.dreamnet.ink/` (needs removal)
- ⚠️ CNAME: `www` → `parkingpage.namecheap.com` (needs update)

---

## Next Steps

1. **Set up domain mapping in Google Cloud Console** (get the 4 A record IPs)
2. **Remove URL Redirect Record** in Namecheap
3. **Add 4 A records** pointing to Google's IPs
4. **Update www CNAME** to point to Cloud Run (optional)

Would you like me to help you navigate to Google Cloud Console to set up the domain mapping?

