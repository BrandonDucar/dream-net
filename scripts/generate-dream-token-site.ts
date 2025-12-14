#!/usr/bin/env tsx
/**
 * Generate DreamNet Token Website Locally
 * 
 * Uses Website AI Designer to generate the site from spec,
 * saves files, and opens in browser automatically.
 */

import { getWebsiteDesigner } from '../packages/website-ai-designer/src/index';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Website spec from user requirements
const WEBSITE_SPEC = {
  description: `DreamNet Token (DREAM) - Official front door for the DREAM token and DreamNet network on Base mainnet. 
  
This is a production-ready, static website that serves as the official landing page for:
- DREAM token (contract: 0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77)
- DreamNet multi-agent AI network
- Base mainnet ecosystem

The site must look clean, modern, and credible to both degen users and serious builders. Dark theme with subtle neon accents (cyan, purple, teal). Mobile-first layout.`,
  
  pages: [
    'Home',
    'DreamHub',
    'Token & Docs',
    'FAQ'
  ],
  
  style: `Dark theme with subtle neon accents (cyan #00ffff, purple #a855f7, teal #14b8a6). 
Modern, clean, AI/on-chain network aesthetic (not cartoon meme). 
Mobile-first responsive design. Cards with soft shadows and rounded corners. 
Highly readable text (no ultra-low-contrast). Smooth but minimal animations.`,
  
  features: [
    'Multi-page navigation',
    'Token contract info with copy button',
    'App directory/grid layout',
    'FAQ accordion',
    'Mobile-responsive',
    'BaseScan integration links',
    'DEX trading links (placeholders)',
    'Wallet connection CTAs',
    'Social media links (placeholders)'
  ],
  
  targetAudience: 'Web3 degens and serious builders interested in Base mainnet, AI agents, and prediction markets'
};

async function generateSite() {
  console.log('🎨 Generating DreamNet Token Website...\n');
  
  // Check OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable not set');
    console.log('\n💡 Set it with: export OPENAI_API_KEY=your_key_here');
    process.exit(1);
  }
  
  try {
    const designer = getWebsiteDesigner();
    
    console.log('📝 Building website spec...');
    console.log(`   Pages: ${WEBSITE_SPEC.pages.join(', ')}`);
    console.log(`   Style: ${WEBSITE_SPEC.style.substring(0, 50)}...\n`);
    
    console.log('🤖 Calling Website AI Designer...');
    const code = await designer.generateWebsiteCode(WEBSITE_SPEC);
    
    console.log('✅ Website generated!\n');
    
    // Create output directory
    const outputDir = path.join(process.cwd(), 'dream-token-site');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Save files
    console.log('💾 Saving files...');
    fs.writeFileSync(path.join(outputDir, 'index.html'), code.html);
    fs.writeFileSync(path.join(outputDir, 'styles.css'), code.css);
    fs.writeFileSync(path.join(outputDir, 'script.js'), code.js);
    fs.writeFileSync(path.join(outputDir, 'DEPLOYMENT.md'), code.instructions);
    
    console.log(`✅ Files saved to: ${outputDir}\n`);
    console.log('📄 Files created:');
    console.log('   - index.html');
    console.log('   - styles.css');
    console.log('   - script.js');
    console.log('   - DEPLOYMENT.md\n');
    
    // Open in browser
    const htmlPath = path.join(outputDir, 'index.html');
    const absolutePath = path.resolve(htmlPath);
    
    console.log('🌐 Opening in browser...');
    
    // Detect OS and open browser
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
    console.log('   1. Review the generated site');
    console.log('   2. Customize content as needed');
    console.log('   3. Deploy to Vercel or your preferred hosting');
    console.log(`\n📁 Files location: ${outputDir}`);
    
  } catch (error: any) {
    console.error('\n❌ Error generating website:', error.message);
    if (error.message.includes('OpenAI')) {
      console.log('\n💡 Make sure OPENAI_API_KEY is set correctly');
    }
    process.exit(1);
  }
}

generateSite().catch(console.error);


