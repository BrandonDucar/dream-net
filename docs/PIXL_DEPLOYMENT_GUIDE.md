# PIXL Deployment Guide for DreamNet Token Website

## What is PIXL?

PIXL is OpenAI's hosting/CDN layer that comes with the Website Generator GPT. When you publish a site from ChatGPT's Website Generator, it automatically hosts it on PIXL and gives you a `*.pixl.site` URL.

**Key Benefits:**
- ✅ Instant hosting (no build process)
- ✅ Automatic SSL certificates
- ✅ Global CDN
- ✅ Custom domain support
- ✅ Free hosting
- ✅ No DevOps complexity

---

## Step-by-Step: Deploy DreamNet Token Site to PIXL

### Step 1: Generate Site in ChatGPT

1. Open ChatGPT
2. Select **"Website Generator"** GPT
3. Use the prompt from `CHATGPT_WEBSITE_GENERATOR_PROMPT.md`
4. Let ChatGPT generate the site
5. Review and request adjustments if needed

### Step 2: Publish to PIXL

1. Click **"Publish"** button in ChatGPT
2. Wait for generation (30-60 seconds)
3. You'll get a URL like: `https://dreamnet-token.pixl.site`
4. **Test it immediately** - it should work right away!

### Step 3: Buy Domain (Optional but Recommended)

**Recommended domains:**
- `dreamnettoken.xyz` (~$1-2/year)
- `dreamtoken.xyz` (~$1-2/year)
- `dreamsheep.xyz` (~$1-2/year)
- `dreamnet.app` (~$5-10/year)

**Where to buy:**
- Namecheap (recommended)
- GoDaddy
- Google Domains
- Cloudflare Registrar

### Step 4: Point Domain to PIXL

**DNS Configuration:**

In your domain registrar's DNS settings, add:

```
Type: CNAME
Name: @ (or www)
Value: your-site-name.pixl.site
TTL: 3600 (or Auto)
```

**Example:**
- Domain: `dreamnettoken.xyz`
- CNAME: `@` → `dreamnet-token.pixl.site`

**Wait for propagation:**
- DNS: 1-30 minutes
- SSL: Automatic (usually 1-30 minutes after DNS)

### Step 5: Verify

1. Visit your custom domain
2. Check SSL certificate (should be automatic)
3. Test all links
4. Test mobile responsiveness

---

## Why PIXL > Vercel (For This Use Case)

| Feature | PIXL | Vercel |
|---------|------|--------|
| Setup | Click "Publish" | Configure build, env vars, DNS |
| Build Failures | None (static files) | Common (build errors) |
| SSL | Automatic | Manual configuration |
| DNS | Simple CNAME | Complex routing |
| Speed | Instant | Build time + deploy |
| Complexity | Zero | High |

---

## Integration with DreamNet

### What Lives on PIXL

✅ **Static frontend:**
- Token landing page
- DreamHub app directory
- Token docs
- FAQ

### What Stays Elsewhere

✅ **Backend/Agents:**
- Agents run in Cursor/Replit/GCP
- API endpoints stay on Railway/your backend
- Database stays on Neon/Postgres

✅ **Smart Contracts:**
- All contracts on Base mainnet
- PIXL site just links to them

### How They Connect

**Option 1: External Links**
- DreamHub tiles link to external URLs
- Each mini-app hosted separately
- Simple, clean separation

**Example:**
```
/dreamhub → Links to:
  - Prediction Kernel → https://prediction.dreamnet.ink
  - DreamScope → https://dreamscope.dreamnet.ink
```

**Option 2: Embedded iframes**
- Embed mini-apps directly in PIXL site
- Requires CORS configuration
- More integrated feel

**Option 3: Hybrid**
- Some apps embedded
- Some apps external links
- Best of both worlds

---

## Updating Your PIXL Site

**Method 1: Regenerate in ChatGPT**
- Use Website Generator GPT again
- Request specific changes
- Republish (gets new URL or updates existing)

**Method 2: Download and Edit**
- Download HTML/CSS/JS files
- Edit locally
- Re-upload to PIXL (if supported)

**Method 3: Version Control**
- Download generated files
- Commit to Git
- Track changes over time

---

## Troubleshooting

### DNS Not Working

**Check:**
1. CNAME record is correct
2. TTL has propagated (use `dig` or online DNS checker)
3. No conflicting A records

**Fix:**
- Remove any A records pointing to IPs
- Use only CNAME

### SSL Not Provisioning

**Check:**
1. DNS is correct
2. Waited 30+ minutes
3. Domain is accessible

**Fix:**
- Wait longer (can take up to 24 hours)
- Contact PIXL support (if available)

### Site Not Loading

**Check:**
1. PIXL URL works (`*.pixl.site`)
2. Custom domain DNS is correct
3. Browser cache cleared

**Fix:**
- Test PIXL URL directly first
- Verify DNS with `nslookup`

---

## Next Steps After PIXL Site is Live

1. **Update BaseScan Token Profile**
   - Add your website URL
   - Makes token look official

2. **Add to Token Lists**
   - CoinGecko (if eligible)
   - CoinMarketCap (if eligible)
   - Base ecosystem lists

3. **Link from Existing Sites**
   - Update `dreamnet.ink` to link to token site
   - Add to social media profiles

4. **SEO Optimization**
   - Add meta tags (ChatGPT should include these)
   - Submit to Google Search Console
   - Add sitemap.xml

5. **Analytics** (Optional)
   - Add Google Analytics
   - Or Plausible Analytics
   - Track visitor behavior

---

## Cost Breakdown

**PIXL Hosting:** FREE
**Domain:** $1-10/year (depending on TLD)
**Total:** ~$1-10/year

Compare to:
- Vercel: Free tier (but build failures)
- Netlify: Free tier (but configuration)
- Google Cloud: $5-20/month minimum

**PIXL wins on simplicity and cost.**

---

## FAQ

**Q: Can I use my existing `dreamnet.ink` domain?**
A: Yes, but you'd need to point it to PIXL. Consider keeping `dreamnet.ink` for main site and using new domain for token site.

**Q: Can I have multiple PIXL sites?**
A: Yes, each publish creates a new site. You can have multiple `*.pixl.site` URLs.

**Q: What if I need backend features?**
A: Keep backend on Railway/GCP. PIXL site just links to your APIs.

**Q: Can I add custom JavaScript?**
A: Yes, ChatGPT generates JS. You can add more in the generated files.

**Q: How do I update the site later?**
A: Regenerate in ChatGPT with updates, or download/edit files manually.

---

## Success Checklist

- [ ] Site generated in ChatGPT Website Generator
- [ ] Published to PIXL (got `*.pixl.site` URL)
- [ ] Tested PIXL URL (works in browser)
- [ ] Bought domain (optional)
- [ ] Configured DNS CNAME
- [ ] Waited for SSL (automatic)
- [ ] Tested custom domain
- [ ] Updated BaseScan token profile
- [ ] Added to social media profiles
- [ ] Linked from existing sites

---

## You're Done!

Your DreamNet Token website is now:
- ✅ Live on PIXL
- ✅ Accessible globally
- ✅ SSL secured
- ✅ Custom domain (if configured)
- ✅ Ready for users

No Vercel drama. No build failures. Just works.


