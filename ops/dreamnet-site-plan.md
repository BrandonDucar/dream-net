# DreamNet.Ink Marketing Experience Plan

**Author:** DreamOps Head of State  
**Date:** 2025-11-08  
**Purpose:** Blueprint for replacing legacy static site at `dreamnet.ink` with a production-grade marketing experience showcasing DreamNet, DreamStar, and DreamSnail.

---

## 1. Objectives
- Communicate DreamNet’s autonomous capabilities, governance maturity, and creative ecosystem.
- Highlight three launch verticals: **DreamStar** (AI music engine), **DreamSnail** (privacy NFTs), **Precious Metals Intelligence** (core revenue vertical).
- Drive conversions via contact/demo requests and newsletter sign-ups.
- Reflect real-time system vitality (agents, compute budgets) without exposing sensitive data.
- Seamlessly integrate with existing Next.js app under `app/`.

---

## 2. Site Architecture
```
app/
└─ (marketing)/
   ├─ layout.tsx              # shared nav/footer
   ├─ page.tsx                # homepage
   ├─ dreamstar/page.tsx      # DreamStar vertical
   ├─ dreamsnail/page.tsx     # DreamSnail vertical
   └─ metals/page.tsx         # Precious Metals Intelligence
components/
└─ marketing/
   ├─ Hero.tsx
   ├─ StatGrid.tsx
   ├─ VerticalShowcase.tsx
   ├─ Testimonial.tsx
   ├─ CTASection.tsx
   ├─ LogoTicker.tsx
   └─ Footer.tsx
lib/
└─ marketing/
   ├─ copy.ts                 # shared messaging strings
   ├─ metrics.ts              # API helpers for health/agents/governor
   └─ contact.ts              # CTA endpoint helper
public/og/
└─ marketing-*                # OG images per page
```

---

## 3. Page Flows

### 3.1 Homepage (`/(marketing)/page.tsx`)
- **Hero:** “DreamNet — Autonomous Intelligence Platform” with animated biomimetic gradient, “Schedule a Mission Briefing” CTA.
- **Live Status Band:** Pull data from `/api/health` and `/api/changelog` (sanitized) to show uptime, agents active, latest ops milestone.
- **Vertical Highlights:** Three cards linking to DreamStar, DreamSnail, and Metals pages; include iconography + key metrics.
- **Governance Showcase:** Explain Compute Governor, Daemon, StarBridge with simple illustrations and bullet stats.
- **Proof Section:** Embed DreamNet Live Proof snapshot excerpts, testimonials from early adopters.
- **CTA Footer:** Contact form (Netlify-style fallback or API route) + Subscribe button (hooks into existing email provider).

### 3.2 DreamStar Page
- **Narrative:** Artist + AI co-creation story; highlight ingestion → synthesis → release cycle.
- **Feature Tabs:** Influence modeling, DreamForge orchestration, Royalty Flow Nexus integration.
- **Demo Carousel:** Video or animated mockups of DreamStar Studio UI (placeholder until build complete).
- **CTA:** “Request a Studio Session” linking to contact flow.

### 3.3 DreamSnail Page
- **Hero:** Triple helix visualization (canvas shader) with privacy narrative.
- **Sections:** Fibonacci rarity tiers, zk slime trails, unlockable perks.
- **Proof Badges:** Diagram of Poseidon commitments → Merkle root → zk proof → badge.
- **CTA:** “Join the Trailblazer List” form with optional zk preview invite.

### 3.4 Precious Metals Intelligence Page
- **Overview:** Real-time metals market intelligence, proprietary data edge, compliance readiness.
- **Feature Blocks:** Live pricing, AI signal engine, regulatory guardrails.
- **Case Study:** Example ROI scenario (80% cost reduction vs manual).
- **CTA:** “Book a Treasury Review”.

---

## 4. Visual & UX System
- **Typography:** Primary — “Neuzeit Grotesk” style (fallback: `Inter`), Title accent with high-contrast display font.
- **Color Palette:**  
  - Night Sky #040714  
  - Bio Lumen Cyan #36F3FF  
  - Gold Alloy #E0B857 (Metals vertical)  
  - Helix Magenta #F73D9B (DreamSnail)  
  - Aurora Violet #7755FF (DreamStar)
- **Motifs:** Triple helix grid, mycelium lines, radial glows synced to scroll.
- **Interactions:** Subtle parallax on hero, reveal animations on scrolled sections, CTA hover glows.

---

## 5. Data & Integrations
- `lib/marketing/metrics.ts` fetches:
  - `/api/health` (status, uptime).
  - `/api/agents` (count + highlight roles).
  - `/api/runs/recent` (to show recent autonomous actions).
- Sanitize to avoid leaking secrets; fallback to curated snapshot if API unavailable.
- Contact form posts to `/api/contact` (new route) that forwards to Slack/email or stores in Neon `leads` table.

---

## 6. Content Roadmap
- **Copy Sources:** `replit.md`, `DreamNet_Live_Proof_Snapshot.txt`, `ops/dreamstar.md`, `ops/dreamsnail.md`, `GO_TO_MARKET_PLAN.md`.
- **Media:**  
  - Generate hero illustrations (can be static for launch).  
  - Record short screen capture of DreamOps dashboard for proof section.  
  - Build placeholder looping animation for DreamSnail helix (GLSL shader or Lottie).

---

## 7. Launch Checklist
1. Implement components and pages per architecture.
2. Update navigation to include vertical links.
3. Test responsive layouts (mobile, tablet, desktop).
4. Configure SEO (title, meta description, JSON-LD where useful).
5. Create OG images per page.
6. Set Vercel environment variables for Neon DBs and contact endpoint.
7. Deploy to preview → QA → promote to production (dreamnet.ink).
8. Post-launch: monitor metrics, ensure contact leads captured, run accessibility audit.

---

## 8. Future Enhancements
- Integrate live StarBridge heartbeat visualization.
- Embed DreamStar audio samples once generation pipeline goes live.
- Add DreamSnail mint tracker and zk badge verification widget.
- Launch blog/mission updates under `/(marketing)/intel` for ongoing announcements.

---

*Keep this plan updated as implementation progresses. Reference in README and assistant memory for continuity.*
