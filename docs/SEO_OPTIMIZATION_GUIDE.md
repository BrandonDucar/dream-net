# SEO Optimization Guide for dreamnet.ink

**Status**: 📋 Optimization Guide  
**Priority**: 🟢 LOW  
**Last Updated**: 2025-01-27

---

## Overview

Comprehensive SEO optimization guide for `dreamnet.ink`, including titles, meta descriptions, structured data, and Farcaster/Zora crawlability.

---

## Title & Meta Description Updates

### Homepage

**Current**: Needs optimization  
**Optimized**:
```html
<title>DreamNet - Self-Evolving Multi-Agent Ecosystem | AI + Web3 Platform</title>
<meta name="description" content="DreamNet is a biomimetic, self-healing AI + Web3 ecosystem that transforms ideas into reality through autonomous agent orchestration. Built on Base blockchain.">
```

### Token Page

**Optimized**:
```html
<title>$DREAM Token - DreamNet Ecosystem Token | Buy on Base</title>
<meta name="description" content="$DREAM is the native token of the DreamNet ecosystem. Powering agent orchestration, governance, and rewards. Available on Base blockchain.">
```

### Citadel Hub

**Optimized**:
```html
<title>Citadel Hub - DreamNet Control Center | Agent Orchestration</title>
<meta name="description" content="Citadel Hub is DreamNet's control center for agent orchestration, system monitoring, and governance. Manage your DreamNet ecosystem.">
```

---

## Structured Data

### Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "DreamNet",
  "url": "https://dreamnet.ink",
  "logo": "https://dreamnet.ink/logo.png",
  "description": "Self-evolving multi-agent ecosystem",
  "sameAs": [
    "https://twitter.com/dreamnet",
    "https://warpcast.com/dreamnet",
    "https://github.com/dreamnet"
  ]
}
```

### SoftwareApplication Schema

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "DreamNet",
  "applicationCategory": "Web3Application",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### Dataset/CreativeWork Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "DreamNet Architecture",
  "description": "Complete documentation of DreamNet architecture",
  "creator": {
    "@type": "Organization",
    "name": "DreamNet"
  }
}
```

---

## Farcaster/Zora Crawlability

### Links Page

**Create `/links` page**:
```html
<!DOCTYPE html>
<html>
<head>
  <title>DreamNet Links - Farcaster, Zora, X</title>
</head>
<body>
  <h1>DreamNet Links</h1>
  <ul>
    <li><a href="https://warpcast.com/dreamnet">Farcaster Profile</a></li>
    <li><a href="https://zora.co/dreamnet">Zora Collection</a></li>
    <li><a href="https://x.com/dreamnet">X (Twitter)</a></li>
  </ul>
</body>
</html>
```

### Canonical Links

**Add canonical links to posts**:
```html
<link rel="canonical" href="https://dreamnet.ink/posts/[post-id]">
```

---

## Robots.txt & Sitemap

### robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://dreamnet.ink/sitemap.xml
```

### sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://dreamnet.ink/</loc>
    <lastmod>2025-01-27</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://dreamnet.ink/token</loc>
    <lastmod>2025-01-27</lastmod>
    <priority>0.9</priority>
  </url>
</urlset>
```

---

## OpenGraph & Twitter Cards

### OpenGraph Tags

```html
<meta property="og:title" content="DreamNet - Self-Evolving Multi-Agent Ecosystem">
<meta property="og:description" content="Biomimetic AI + Web3 platform">
<meta property="og:image" content="https://dreamnet.ink/og-image.png">
<meta property="og:url" content="https://dreamnet.ink">
<meta property="og:type" content="website">
```

### Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="DreamNet - Self-Evolving Multi-Agent Ecosystem">
<meta name="twitter:description" content="Biomimetic AI + Web3 platform">
<meta name="twitter:image" content="https://dreamnet.ink/twitter-image.png">
```

---

## FAQ Sections

### Target Keywords

- "What is DreamNet?"
- "How does DreamNet work?"
- "What is $DREAM token?"
- "How to use DreamNet agents?"

### FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is DreamNet?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "DreamNet is a biomimetic, self-healing AI + Web3 ecosystem..."
    }
  }]
}
```

---

## Implementation Checklist

- [ ] Update all page titles
- [ ] Add meta descriptions
- [ ] Implement structured data
- [ ] Create /links page
- [ ] Add canonical links
- [ ] Create robots.txt
- [ ] Generate sitemap.xml
- [ ] Add OpenGraph tags
- [ ] Add Twitter cards
- [ ] Create FAQ sections
- [ ] Submit to Google Search Console
- [ ] Monitor search performance

---

**Status**: 📋 Complete

