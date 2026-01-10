# Railway Custom Domain Setup for dreamnet.ink

## How Railway Knows About dreamnet.ink

**Railway doesn't automatically know** - you need to configure it manually!

## Step-by-Step Setup

### 1. Add Custom Domain in Railway

1. Go to Railway Dashboard
2. Click on your service (`@dreamnet/server`)
3. Go to **Settings** tab
4. Scroll to **Domains** section
5. Click **+ Add Domain**
6. Enter: `dreamnet.ink`
7. Railway will show you DNS records to configure

### 2. Configure DNS at Your Domain Registrar

Railway will show you DNS records like:

**Option A: CNAME (Recommended)**
```
Type: CNAME
Name: @
Value: your-app.up.railway.app
```

**Option B: A Record**
```
Type: A
Name: @
Value: [Railway's IP address]
```

### 3. Update DNS Records

Go to your domain registrar (where you bought dreamnet.ink):
1. Find DNS management
2. Add the DNS record Railway provided
3. Save changes
4. Wait for DNS propagation (5 minutes to 24 hours)

### 4. SSL Certificate

Railway automatically:
- Issues SSL certificate for dreamnet.ink
- Enables HTTPS
- Handles certificate renewal

## Result

After DNS propagates:
- `dreamnet.ink` → Points to your Railway service
- `www.dreamnet.ink` → Can also be configured (add another domain)

## Important Notes

- **Railway doesn't auto-detect** your domain - you must add it manually
- **DNS propagation** can take time (usually 5-30 minutes)
- **SSL is automatic** - Railway handles certificates
- **Default domain still works** - `your-app.up.railway.app` continues to work

## Troubleshooting

**Domain not working?**
- Check DNS records are correct
- Wait for DNS propagation
- Check Railway logs for domain status
- Verify domain is added in Railway dashboard

**SSL not working?**
- Wait for Railway to issue certificate (usually automatic)
- Check Railway domain status shows "Valid" or "Pending"
- Can take up to 24 hours for SSL

