#!/bin/bash
# Configure domains for DreamNet platform

set -e

echo "🌐 DreamNet Domain Configuration Helper"
echo "======================================="
echo ""

# Check if we're in the DreamNet root
if [ ! -f "package.json" ]; then
  echo "❌ Error: Must run from DreamNet root directory"
  exit 1
fi

echo "Available domains to configure:"
echo "1. dreamnet.ink (Vercel/Railway)"
echo "2. dreamnet.live (Firebase)"
echo "3. dadf.org (Namecheap - not configured)"
echo "4. Custom domain"
echo ""
read -p "Choose domain (1-4): " domain_choice

case $domain_choice in
  1)
    domain="dreamnet.ink"
    echo ""
    echo "📋 Configuring $domain"
    echo ""
    echo "Current setup:"
    echo "  - DomainKeeper configured for Vercel"
    echo "  - DNS should point to Vercel"
    echo ""
    echo "To check DNS:"
    echo "  nslookup $domain"
    echo ""
    echo "To sync domain via DomainKeeper:"
    echo "  curl -X POST https://api.dreamnet.ink/api/deployment/sync-domains"
    echo ""
    echo "Or manually in Vercel Dashboard:"
    echo "  1. Go to Vercel → Your Project → Settings → Domains"
    echo "  2. Add: $domain"
    echo "  3. Follow DNS instructions"
    ;;
    
  2)
    domain="dreamnet.live"
    echo ""
    echo "📋 Configuring $domain"
    echo ""
    echo "Current setup:"
    echo "  - Already pointing to Firebase"
    echo "  - firebase.json configured"
    echo ""
    echo "To deploy:"
    echo "  cd client && pnpm build && cd .. && firebase deploy --only hosting"
    echo ""
    echo "To check Firebase project:"
    echo "  firebase projects:list"
    echo ""
    echo "To add domain in Firebase Console:"
    echo "  1. Go to Firebase Console → Hosting"
    echo "  2. Add custom domain: $domain"
    echo "  3. Follow DNS instructions"
    ;;
    
  3)
    domain="dadf.org"
    echo ""
    echo "📋 Configuring $domain"
    echo ""
    read -p "Where do you want to point $domain? (vercel/railway/firebase/custom): " platform
    
    case $platform in
      vercel)
        echo ""
        echo "📝 Steps to configure $domain for Vercel:"
        echo ""
        echo "1. In Namecheap DNS:"
        echo "   Type: CNAME"
        echo "   Name: @"
        echo "   Value: cname.vercel-dns.com"
        echo ""
        echo "2. In Vercel Dashboard:"
        echo "   - Go to Project → Settings → Domains"
        echo "   - Add: $domain"
        echo "   - Wait for SSL certificate"
        ;;
        
      railway)
        echo ""
        echo "📝 Steps to configure $domain for Railway:"
        echo ""
        echo "1. Get your Railway domain:"
        echo "   - Go to Railway Dashboard → Your Service → Settings → Domains"
        echo "   - Copy the Railway domain (e.g., your-app.up.railway.app)"
        echo ""
        echo "2. In Namecheap DNS:"
        echo "   Type: CNAME"
        echo "   Name: @"
        echo "   Value: [your-railway-domain].up.railway.app"
        echo ""
        echo "3. In Railway Dashboard:"
        echo "   - Go to Your Service → Settings → Domains"
        echo "   - Add: $domain"
        echo "   - Wait for SSL certificate"
        ;;
        
      firebase)
        echo ""
        echo "📝 Steps to configure $domain for Firebase:"
        echo ""
        echo "1. In Firebase Console:"
        echo "   - Go to Hosting → Add custom domain"
        echo "   - Enter: $domain"
        echo "   - Follow DNS instructions"
        echo ""
        echo "2. In Namecheap DNS:"
        echo "   - Add the DNS records Firebase provides"
        echo ""
        echo "3. Deploy:"
        echo "   firebase deploy --only hosting"
        ;;
        
      custom)
        echo ""
        read -p "Enter the target URL or IP: " target
        echo ""
        echo "📝 Configure DNS at Namecheap:"
        echo ""
        if [[ $target =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
          echo "Type: A"
          echo "Name: @"
          echo "Value: $target"
        else
          echo "Type: CNAME"
          echo "Name: @"
          echo "Value: $target"
        fi
        ;;
        
      *)
        echo "❌ Invalid platform"
        exit 1
        ;;
    esac
    ;;
    
  4)
    echo ""
    read -p "Enter domain name: " domain
    read -p "Where to point? (vercel/railway/firebase/custom): " platform
    
    echo ""
    echo "📋 Configuring $domain for $platform"
    echo ""
    
    case $platform in
      vercel)
        echo "DNS Configuration:"
        echo "  Type: CNAME"
        echo "  Name: @"
        echo "  Value: cname.vercel-dns.com"
        echo ""
        echo "Then add domain in Vercel Dashboard → Project → Settings → Domains"
        ;;
        
      railway)
        echo "1. Get Railway domain from Railway Dashboard"
        echo "2. DNS Configuration:"
        echo "   Type: CNAME"
        echo "   Name: @"
        echo "   Value: [railway-domain].up.railway.app"
        echo "3. Add domain in Railway Dashboard"
        ;;
        
      firebase)
        echo "1. Add domain in Firebase Console → Hosting"
        echo "2. Follow DNS instructions provided by Firebase"
        ;;
        
      custom)
        read -p "Enter target URL/IP: " target
        if [[ $target =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
          echo "DNS: A record @ → $target"
        else
          echo "DNS: CNAME @ → $target"
        fi
        ;;
    esac
    ;;
    
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "✅ Domain configuration guide complete!"
echo "💡 Check docs/DOMAIN_MIGRATION_GUIDE.md for more details"

