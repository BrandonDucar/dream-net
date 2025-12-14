#!/usr/bin/env tsx
/**
 * Generate DreamNet Token Website Using AI
 * 
 * Uses OpenAI to generate a complete website from the spec,
 * saves files, and opens in browser automatically.
 */

import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const execAsync = promisify(exec);

// Full website spec - BEAUTIFUL DESIGN FOCUSED
const FULL_SPEC = `
Create a production-ready, multi-page website for DreamNet Token (DREAM) on Base mainnet. Make this BEAUTIFUL - this is the official front door for DreamNet.

PROJECT DETAILS:
- Token Name: DreamNet Token
- Token Symbol: DREAM
- Chain: Base mainnet
- Contract Address: 0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77
- Purpose: Official front door for DREAM token and DreamNet multi-agent AI network

DESIGN REQUIREMENTS (CRITICAL - Make this BEAUTIFUL):

VISUAL AESTHETIC:
- Dark theme foundation: Deep black (#000000) or very dark gray (#0a0a0a) background
- Subtle neon accents: Use sparingly but effectively:
  * Cyan: #00ffff (primary accent, use for highlights, buttons, links)
  * Purple: #a855f7 (secondary accent, use for gradients, hover states)
  * Teal: #14b8a6 (tertiary accent, use for badges, status indicators)
- Gradient overlays: Subtle dark-to-darker gradients (e.g., #0a0a0a → #000000)
- Neon glow effects: Soft, subtle glows on buttons, cards, and interactive elements (not overpowering)
- Glassmorphism: Subtle frosted glass effects on cards (backdrop-blur with semi-transparent backgrounds)

TYPOGRAPHY:
- Headings: Bold, modern sans-serif (Inter, Poppins, or similar). Large, impactful sizes.
- Body text: Highly readable, high contrast (white #ffffff or light gray #e5e5e5 on dark background)
- Font sizes: Generous spacing, never cramped. Mobile: 16px minimum for body text.
- Line height: Comfortable (1.6-1.8 for body text)
- NO ultra-low-contrast fonts - ensure text is always readable

LAYOUT & SPACING:
- Mobile-first: Design for mobile, then scale up beautifully
- Generous whitespace: Don't cram elements together. Let content breathe.
- Card design: 
  * Rounded corners (12-16px border-radius)
  * Soft shadows (subtle, not harsh)
  * Semi-transparent backgrounds with backdrop blur
  * Subtle border (1px solid rgba(255,255,255,0.1))
  * Hover effects: slight lift, glow, or color shift
- Section spacing: Large gaps between sections (80-120px on desktop, 60px on mobile)

ANIMATIONS & INTERACTIONS:
- Smooth transitions: All hover states, button clicks, and interactions should be smooth (200-300ms ease)
- Subtle scroll animations: Fade-in on scroll (not jarring, very subtle)
- Button interactions: 
  * Hover: slight scale (1.02-1.05), glow increase, color shift
  * Active: slight scale down (0.98)
  * Smooth transitions between states
- Minimal but polished: Animations should feel premium, not distracting

COLOR PALETTE DETAILS:
- Background: #000000 (pure black) or #0a0a0a (very dark gray)
- Cards: rgba(255,255,255,0.05) with backdrop-blur
- Borders: rgba(255,255,255,0.1) - very subtle
- Text primary: #ffffff (white)
- Text secondary: #a0a0a0 (light gray)
- Accent cyan: #00ffff (use for primary CTAs, highlights)
- Accent purple: #a855f7 (use for secondary elements, gradients)
- Accent teal: #14b8a6 (use for badges, status)
- Hover states: Slight brightness increase, subtle glow

SPECIFIC VISUAL ELEMENTS:
- Hero section: Large, impactful. Consider subtle animated background (particles, gradient shift, or static gradient)
- Buttons: 
  * Primary: Cyan (#00ffff) with subtle glow, rounded (8-12px)
  * Secondary: Transparent with border, hover fills with color
  * Text should be bold, readable
- Cards: 
  * Glassmorphism effect (backdrop-blur + transparency)
  * Subtle border
  * Soft shadow
  * Hover: slight lift + glow
- Badges: Small, rounded, colored backgrounds (teal/purple/cyan)
- Links: Cyan color (#00ffff), underline on hover (subtle)

OVERALL FEEL:
- Credible & professional: Should look like a serious Web3 project, not a meme coin
- Modern & cutting-edge: AI/on-chain network vibe, futuristic but not sci-fi cartoon
- Clean & minimal: Don't over-design. Let the content shine.
- Beautiful & polished: Every element should feel intentional and well-crafted
- Accessible: High contrast, readable fonts, clear hierarchy

INSPIRATION NOTES:
- Think: Base ecosystem sites, Uniswap, Aave (clean, professional)
- NOT: Pepe memes, cartoon graphics, low-effort designs
- Vibe: "This is a serious AI network with beautiful UX"

PAGE STRUCTURE (4 pages):

PAGE 1: HOME

Hero Section (MAKE THIS STUNNING):
- Full viewport height on desktop (or at least 80vh)
- Large, bold headline: "DreamNet — Agent-Powered Network on Base"
  * Font size: 48-64px on desktop, 32-40px on mobile
  * Weight: Bold (700-800)
  * Color: White (#ffffff) with subtle cyan glow on hover
- Subheadline (2 sentences): "DreamNet = multi-agent AI + on-chain network. DREAM token powers access, coordination, and experiments on Base."
  * Font size: 20-24px on desktop, 18px on mobile
  * Color: Light gray (#e5e5e5)
  * Line height: 1.6
- Background: 
  * Subtle animated gradient (very slow, barely noticeable) OR
  * Static dark gradient with subtle texture OR
  * Dark with subtle particle effect (if possible)
- Three prominent CTA buttons (large, beautiful, with hover effects):
  * "Launch DreamHub" (primary - cyan #00ffff with glow)
  * "View DREAM on BaseScan" (secondary - transparent with border, fills on hover)
  * "Trade DREAM on DEX" (secondary - transparent with border, fills on hover)
- Token info card (floating overlay, glassmorphism style):
  * Position: Top-right or below hero text
  * Background: rgba(255,255,255,0.05) with backdrop-blur
  * Border: 1px solid rgba(255,255,255,0.1)
  * Content:
    * Name: DreamNet Token
    * Symbol: DREAM (with subtle badge)
    * Chain: Base (with Base logo/icon if possible)
    * Contract: 0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77 (with copy button - make this prominent)
  * Hover: Subtle lift and glow

"What is DreamNet?" Section:
- Short paragraph explaining:
  * Multi-agent AI orchestration
  * On-chain actions on Base
  * Focus on prediction, scoring, and agent collaboration
- Three feature cards:
  * "Agents & Wallets" — Agents with their own wallets on Base
  * "Latent Network" — Latent memory and collaboration layer
  * "DreamHub" — Mini apps + tools for users and builders

"What is the DREAM token?" Section:
- Explain that DREAM:
  * Lives on Base
  * Used for access, experiments, agent rewards, and network incentives
- Include a "Token Stats" box with placeholders:
  * Total Supply: [Coming Soon]
  * Decimals: 18
  * Initial Liquidity: [Coming Soon]
- Two buttons:
  * "Add DREAM to Wallet" (placeholder: #)
  * "Token Details →" (links to #token-docs)

"Why Base?" Section:
- 2-3 bullet points:
  * Low fees
  * High throughput
  * Strong ecosystem
- CTA button: "View DreamNet on BaseScan"

"Get Started" Section:
- Three steps:
  1) Connect your wallet to Base
  2) Get DREAM from the DEX link
  3) Explore DreamHub and tools

PAGE 2: DREAMHUB

Intro:
- Title: "DreamHub — Mini Apps & Tools"
- Subtitle: "Explore experimental agents, dashboards, and on-chain tools powered by DREAM and DreamNet."

App Grid (responsive card layout):
Each card has:
- App name
- Short description/tagline
- Status badge: "Online", "In Development", or "Coming Soon"
- "Open" button/link (use placeholder # links)

Include these apps:

1. "DreamScope"
   - Tagline: "Live view into DreamNet's latent sessions and agent activity."
   - Status: In Development
   - Button: "Open DreamScope" (#)

2. "Prediction Kernel"
   - Tagline: "Base-native prediction experiments and agent-driven markets."
   - Status: Coming Soon
   - Button: "Open Prediction Kernel" (#)

3. "Wallet Score Engine"
   - Tagline: "Exploratory wallet scoring and reputation experiments."
   - Status: Coming Soon
   - Button: "Open Wallet Scores" (#)

4. "Agent Directory"
   - Tagline: "Overview of Citadel agents, field agents, and other roles."
   - Status: In Development
   - Button: "View Agents" (#)

- Add a section: "More mini apps coming soon..." with empty card placeholders

Notice Section:
- Callout box that says:
  * Everything here is experimental
  * Not financial advice
  * Features may come online in phases

PAGE 3: TOKEN & DOCS

Token Overview Panel:
- Highlighted panel with:
  * Token name: DreamNet Token
  * Symbol: DREAM
  * Chain: Base
  * Contract address: 0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77
  * Copy button for contract address
  * "View on BaseScan" link (https://basescan.org/token/0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77)
- Buttons:
  * "View on BaseScan"
  * "Open DEX Pool" (placeholder: #)
  * "Add to Wallet" (placeholder: #)

Token Utility Section:
- Bulleted list describing planned utilities (label as "Planned Utility"):
  * Access to certain mini apps or agent tools
  * Agent rewards and incentives
  * Participation in experiments (prediction, scoring, etc.)
  * Future governance / signaling

Tokenomics Section:
- Clean, non-meme layout
- Include placeholders:
  * Allocation categories: e.g. liquidity, community, agents, development
  * Supply distribution (simple text chart or card layout)
- Clearly mark as "Draft / Subject to change"

Docs / Links Section:
- List of links (placeholders):
  * "Litepaper / Manifesto (PDF)" (#)
  * "GitHub: DreamNet repo" (https://github.com/BrandonDucar/dream-net)
  * "Explorer: BaseScan token page" (https://basescan.org/token/0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77)
  * "Community: X / Farcaster / Telegram" (placeholders: #)

PAGE 4: FAQ

Clean accordion or Q&A list with these questions:

Q: "What is DreamNet?"
A: Explain multi-agent AI orchestration, on-chain network, Base integration

Q: "What is the DREAM token used for?"
A: Access, experiments, agent rewards, network incentives

Q: "On which chain does DREAM live?"
A: Base mainnet (Chain ID: 8453)

Q: "Is this an investment?"
A: Answer clearly: experimental, no guarantees, not financial advice

Q: "How do I get DREAM?"
A: High-level: connect wallet to Base, use DEX link, check slippage, etc.

Q: "How do I use DreamHub?"
A: High-level: use your wallet, browse mini apps, some may be read-only or gated

GLOBAL ELEMENTS:

Header (sticky):
- Logo/text: "DreamNet"
- Nav links: Home, DreamHub, Token & Docs, FAQ
- Right-side button: "Launch DreamHub" (links to #dreamhub)

Footer:
- Small description: "DreamNet is a multi-agent AI network on Base. DREAM token powers access and coordination."
- Important links:
  * BaseScan token (https://basescan.org/token/0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77)
  * DEX link (placeholder: #)
  * GitHub (https://github.com/BrandonDucar/dream-net)
  * Socials: X, Farcaster, Telegram (placeholders: #)
- Disclaimer text: "DREAM and DreamNet are experimental. Nothing on this site is financial advice."

TECHNICAL REQUIREMENTS:
- Static site (HTML/CSS/JS)
- No backend required
- All placeholder links can be # for now
- Mobile-responsive (mobile-first)
- SEO-optimized meta tags
- Smooth scrolling navigation
- Copy-to-clipboard for contract address
- Clean, production-ready code

BEAUTY CHECKLIST (Before generating, ensure):
- ✅ Dark, rich background (not flat gray)
- ✅ Subtle neon glows on interactive elements
- ✅ Generous whitespace (content breathes)
- ✅ High contrast text (always readable)
- ✅ Smooth animations (200-300ms transitions)
- ✅ Glassmorphism cards (backdrop-blur + transparency)
- ✅ Professional typography (modern, bold headings)
- ✅ Polished buttons (hover effects, glows)
- ✅ Mobile-first responsive (looks perfect on phone)
- ✅ Overall feel: "This is a serious, beautiful Web3 project"

Generate complete, production-ready code that I can publish directly to PIXL. Make it BEAUTIFUL - this is the official front door for DreamNet and needs to impress both degens and serious builders.
`;

async function generateSite() {
  console.log('🎨 Generating DreamNet Token Website with AI...\n');
  
  // Check OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable not set');
    console.log('\n💡 Set it with: export OPENAI_API_KEY=your_key_here');
    process.exit(1);
  }
  
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  try {
    console.log('🤖 Calling OpenAI to generate website...');
    console.log('   This may take 30-60 seconds...\n');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an elite Web3 website designer and developer. Your specialty is creating BEAUTIFUL, production-ready websites that combine stunning visual design with flawless code.

CRITICAL DESIGN PRINCIPLES:
- Make it BEAUTIFUL - every element should be polished and intentional
- Dark themes with subtle neon accents (cyan #00ffff, purple #a855f7, teal #14b8a6)
- Glassmorphism effects (backdrop-blur + semi-transparent backgrounds)
- Generous whitespace - let content breathe
- High contrast text - always readable
- Smooth animations (200-300ms transitions)
- Professional Web3 aesthetic (like Uniswap, Aave, Base ecosystem sites)
- NOT meme coin style - this is serious and credible

Your code must be:
- Complete and ready to run immediately
- Well-structured, commented, and maintainable
- Mobile-first responsive (perfect on phone, scales beautifully to desktop)
- Modern CSS (use backdrop-filter, CSS Grid, Flexbox, custom properties)
- Smooth animations and interactions
- Accessible (semantic HTML, ARIA labels where needed)
- SEO-optimized (meta tags, proper heading hierarchy)
- Include all requested features exactly as specified

Return the code in this format:
\`\`\`html
[complete HTML file with embedded CSS and JS]
\`\`\`

OR if separate files are better:
\`\`\`html
[HTML file]
\`\`\`

\`\`\`css
[CSS file - make it beautiful with glassmorphism, neon glows, smooth animations]
\`\`\`

\`\`\`javascript
[JS file - smooth interactions, copy-to-clipboard, scroll animations]
\`\`\`

Remember: This is the official front door for a serious Web3 project. Make it stunning.`
        },
        {
          role: 'user',
          content: FULL_SPEC
        }
      ],
      temperature: 0.8, // Slightly higher for more creative/beautiful output
      max_tokens: 20000, // Increased for full beautiful website with all details
    });
    
    const content = response.choices[0]?.message?.content || '';
    
    if (!content) {
      throw new Error('No content generated');
    }
    
    console.log('✅ Website generated!\n');
    
    // Parse HTML, CSS, JS from response
    const htmlMatch = content.match(/```html\n([\s\S]*?)```/);
    const cssMatch = content.match(/```css\n([\s\S]*?)```/);
    const jsMatch = content.match(/```javascript\n([\s\S]*?)```/);
    const jsMatch2 = content.match(/```js\n([\s\S]*?)```/);
    
    const html = htmlMatch ? htmlMatch[1].trim() : '';
    const css = cssMatch ? cssMatch[1].trim() : '';
    const js = (jsMatch || jsMatch2) ? (jsMatch?.[1] || jsMatch2?.[1]).trim() : '';
    
    if (!html) {
      console.error('❌ Could not extract HTML from response');
      console.log('Response preview:', content.substring(0, 500));
      process.exit(1);
    }
    
    // Create output directory
    const outputDir = path.join(process.cwd(), 'dream-token-site');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // If HTML has embedded CSS/JS, save as single file
    // Otherwise, save separate files
    if (html.includes('<style>') || html.includes('<script>')) {
      // Single file with embedded CSS/JS
      console.log('💾 Saving single HTML file...');
      fs.writeFileSync(path.join(outputDir, 'index.html'), html);
    } else {
      // Separate files
      console.log('💾 Saving files...');
      
      // Inject CSS and JS into HTML if they exist
      let finalHtml = html;
      
      if (css && !html.includes('<link rel="stylesheet"')) {
        finalHtml = html.replace('</head>', `    <style>${css}</style>\n</head>`);
      } else if (css) {
        fs.writeFileSync(path.join(outputDir, 'styles.css'), css);
        finalHtml = html.replace('styles.css', 'styles.css');
      }
      
      if (js && !html.includes('<script')) {
        finalHtml = finalHtml.replace('</body>', `    <script>${js}</script>\n</body>`);
      } else if (js) {
        fs.writeFileSync(path.join(outputDir, 'script.js'), js);
      }
      
      fs.writeFileSync(path.join(outputDir, 'index.html'), finalHtml);
      
      if (css && !html.includes('<style>')) {
        fs.writeFileSync(path.join(outputDir, 'styles.css'), css);
      }
      if (js && !html.includes('<script>')) {
        fs.writeFileSync(path.join(outputDir, 'script.js'), js);
      }
    }
    
    // Save full response for reference
    fs.writeFileSync(path.join(outputDir, 'generation-response.txt'), content);
    
    console.log(`✅ Files saved to: ${outputDir}\n`);
    console.log('📄 Files created:');
    console.log('   - index.html');
    if (css && !html.includes('<style>')) console.log('   - styles.css');
    if (js && !html.includes('<script>')) console.log('   - script.js');
    console.log('   - generation-response.txt\n');
    
    // Open in browser
    const htmlPath = path.join(outputDir, 'index.html');
    const absolutePath = path.resolve(htmlPath);
    
    console.log('🌐 Opening in browser...');
    
    const platform = process.platform;
    let command: string;
    
    if (platform === 'win32') {
      command = `start "" "${absolutePath}"`;
    } else if (platform === 'darwin') {
      command = `open "${absolutePath}"`;
    } else {
      command = `xdg-open "${absolutePath}"`;
    }
    
    await execAsync(command);
    
    console.log('✅ Website opened in browser!\n');
    console.log('📋 Next steps:');
    console.log('   1. Review the generated site in your browser');
    console.log('   2. Customize content as needed');
    console.log('   3. Deploy to Vercel or your preferred hosting');
    console.log(`\n📁 Files location: ${outputDir}`);
    console.log(`\n💡 To regenerate, run: npx tsx scripts/generate-dream-token-site-ai.ts`);
    
  } catch (error: any) {
    console.error('\n❌ Error generating website:', error.message);
    if (error.message.includes('API key')) {
      console.log('\n💡 Make sure OPENAI_API_KEY is set correctly');
    }
    process.exit(1);
  }
}

generateSite().catch(console.error);

