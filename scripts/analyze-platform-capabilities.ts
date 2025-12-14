/**
 * Analyze Ohara & Remix.gg Platform Capabilities
 * Scans top games/apps to understand graphics depth and limitations
 */

import { config } from 'dotenv';
import { oharaClient } from '../server/integrations/oharaClient.js';

config({ path: '.env' });
config({ path: '.env.local' });

interface PlatformCapabilities {
  platform: 'ohara' | 'remix';
  graphics: {
    canvas: boolean;
    webgl: boolean;
    webgpu: boolean;
    svg: boolean;
    css3d: boolean;
    libraries: string[];
  };
  limitations: {
    fileSize: string;
    runtime: string;
    apis: string[];
    restrictions: string[];
  };
  examples: Array<{
    name: string;
    type: string;
    complexity: 'simple' | 'medium' | 'complex';
    graphics: string[];
  }>;
}

async function analyzeOhara(): Promise<PlatformCapabilities> {
  console.log('🔍 Analyzing Ohara.ai capabilities...\n');

  const capabilities: PlatformCapabilities = {
    platform: 'ohara',
    graphics: {
      canvas: true, // Standard HTML5 Canvas
      webgl: true, // WebGL should be supported
      webgpu: false, // Likely not supported yet
      svg: true, // SVG is standard
      css3d: true, // CSS 3D transforms
      libraries: ['React', 'Vue', 'Vanilla JS', 'Canvas API', 'WebGL'],
    },
    limitations: {
      fileSize: 'Unknown - check API limits',
      runtime: 'Browser-based (no Node.js)',
      apis: [
        'Standard browser APIs',
        'Canvas API',
        'WebGL API',
        'Fetch API',
        'LocalStorage',
        'IndexedDB',
      ],
      restrictions: [
        'No server-side code',
        'No file system access',
        'No native modules',
        'CORS restrictions apply',
      ],
    },
    examples: [],
  };

  try {
    // Try to fetch apps from Ohara
    if (process.env.OHARA_API_KEY) {
      console.log('📡 Fetching apps from Ohara API...');
      const apps = await oharaClient.listApps();
      console.log(`✅ Found ${apps.length} apps\n`);

      // Analyze first 50 apps
      const topApps = apps.slice(0, Math.min(50, apps.length));
      
      console.log('📊 Analyzing app capabilities...\n');
      
      for (const app of topApps) {
        try {
          const appDetails = await oharaClient.getApp(app.id);
          if (appDetails?.code) {
            const code = appDetails.code.toLowerCase();
            
            // Detect graphics libraries
            const hasCanvas = code.includes('<canvas') || code.includes('canvas.getcontext');
            const hasWebGL = code.includes('webgl') || code.includes('getcontext("webgl"');
            const hasThree = code.includes('three.js') || code.includes('three/');
            const hasPixi = code.includes('pixi') || code.includes('pixijs');
            const hasPhaser = code.includes('phaser');
            const hasReact = code.includes('react') || code.includes('react-dom');
            
            capabilities.examples.push({
              name: app.name,
              type: app.description || 'app',
              complexity: hasWebGL || hasThree || hasPixi ? 'complex' : hasCanvas ? 'medium' : 'simple',
              graphics: [
                ...(hasCanvas ? ['Canvas'] : []),
                ...(hasWebGL ? ['WebGL'] : []),
                ...(hasThree ? ['Three.js'] : []),
                ...(hasPixi ? ['PixiJS'] : []),
                ...(hasPhaser ? ['Phaser'] : []),
                ...(hasReact ? ['React'] : []),
              ],
            });
          }
        } catch (error) {
          // Skip apps we can't analyze
        }
      }
    } else {
      console.log('⚠️  OHARA_API_KEY not set - using default capabilities\n');
    }
  } catch (error: any) {
    console.warn(`⚠️  Could not fetch Ohara apps: ${error.message}\n`);
  }

  return capabilities;
}

async function analyzeRemix(): Promise<PlatformCapabilities> {
  console.log('🔍 Analyzing Remix.gg capabilities...\n');

  const capabilities: PlatformCapabilities = {
    platform: 'remix',
    graphics: {
      canvas: true,
      webgl: true,
      webgpu: false,
      svg: true,
      css3d: true,
      libraries: ['React', 'Canvas API', 'WebGL', 'Game engines'],
    },
    limitations: {
      fileSize: 'Unknown - check API limits',
      runtime: 'Browser-based',
      apis: [
        'Standard browser APIs',
        'Canvas API',
        'WebGL API',
        'Gamepad API',
        'Web Audio API',
      ],
      restrictions: [
        'No server-side code',
        'No file system access',
        'Game-focused platform',
      ],
    },
    examples: [],
  };

  try {
    // Try to fetch games from Remix API
    const remixApiKey = process.env.REMIX_API_KEY;
    const remixApiUrl = process.env.REMIX_API_URL || 'https://api.remix.gg/v1';

    if (remixApiKey) {
      console.log('📡 Fetching games from Remix API...');
      const response = await fetch(`${remixApiUrl}/games?limit=50`, {
        headers: {
          'Authorization': `Bearer ${remixApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const games = data.data || data.games || [];
        console.log(`✅ Found ${games.length} games\n`);

        // Analyze games
        for (const game of games.slice(0, 50)) {
          if (game.code) {
            const code = game.code.toLowerCase();
            
            const hasCanvas = code.includes('<canvas') || code.includes('canvas.getcontext');
            const hasWebGL = code.includes('webgl') || code.includes('getcontext("webgl"');
            const hasThree = code.includes('three.js');
            const hasPixi = code.includes('pixi');
            const hasPhaser = code.includes('phaser');
            
            capabilities.examples.push({
              name: game.name || 'Unknown',
              type: 'game',
              complexity: hasWebGL || hasThree || hasPixi ? 'complex' : hasCanvas ? 'medium' : 'simple',
              graphics: [
                ...(hasCanvas ? ['Canvas'] : []),
                ...(hasWebGL ? ['WebGL'] : []),
                ...(hasThree ? ['Three.js'] : []),
                ...(hasPixi ? ['PixiJS'] : []),
                ...(hasPhaser ? ['Phaser'] : []),
              ],
            });
          }
        }
      } else {
        console.log('⚠️  Remix API not accessible - using default capabilities\n');
      }
    } else {
      console.log('⚠️  REMIX_API_KEY not set - using default capabilities\n');
    }
  } catch (error: any) {
    console.warn(`⚠️  Could not fetch Remix games: ${error.message}\n`);
  }

  return capabilities;
}

async function generateReport() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 PLATFORM CAPABILITIES ANALYSIS\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const oharaCapabilities = await analyzeOhara();
  const remixCapabilities = await analyzeRemix();

  // Ohara Analysis
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🎨 OHARA.AI CAPABILITIES\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('✅ Graphics Support:');
  console.log(`   Canvas: ${oharaCapabilities.graphics.canvas ? '✅' : '❌'}`);
  console.log(`   WebGL: ${oharaCapabilities.graphics.webgl ? '✅' : '❌'}`);
  console.log(`   WebGPU: ${oharaCapabilities.graphics.webgpu ? '✅' : '❌'}`);
  console.log(`   SVG: ${oharaCapabilities.graphics.svg ? '✅' : '❌'}`);
  console.log(`   CSS 3D: ${oharaCapabilities.graphics.css3d ? '✅' : '❌'}`);
  console.log(`\n   Supported Libraries: ${oharaCapabilities.graphics.libraries.join(', ')}\n`);

  console.log('⚠️  Limitations:');
  oharaCapabilities.limitations.restrictions.forEach(r => console.log(`   - ${r}`));
  console.log('');

  console.log(`📱 Analyzed ${oharaCapabilities.examples.length} apps:\n`);
  const oharaComplex = oharaCapabilities.examples.filter(e => e.complexity === 'complex').length;
  const oharaMedium = oharaCapabilities.examples.filter(e => e.complexity === 'medium').length;
  const oharaSimple = oharaCapabilities.examples.filter(e => e.complexity === 'simple').length;
  
  console.log(`   Complex (WebGL/3D): ${oharaComplex}`);
  console.log(`   Medium (Canvas): ${oharaMedium}`);
  console.log(`   Simple (DOM/SVG): ${oharaSimple}\n`);

  if (oharaCapabilities.examples.length > 0) {
    console.log('   Top Examples:');
    oharaCapabilities.examples.slice(0, 10).forEach((ex, i) => {
      console.log(`   ${i + 1}. ${ex.name} (${ex.complexity}) - ${ex.graphics.join(', ') || 'DOM-based'}`);
    });
    console.log('');
  }

  // Remix Analysis
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🎮 REMIX.GG CAPABILITIES\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('✅ Graphics Support:');
  console.log(`   Canvas: ${remixCapabilities.graphics.canvas ? '✅' : '❌'}`);
  console.log(`   WebGL: ${remixCapabilities.graphics.webgl ? '✅' : '❌'}`);
  console.log(`   WebGPU: ${remixCapabilities.graphics.webgpu ? '✅' : '❌'}`);
  console.log(`   SVG: ${remixCapabilities.graphics.svg ? '✅' : '❌'}`);
  console.log(`   CSS 3D: ${remixCapabilities.graphics.css3d ? '✅' : '❌'}`);
  console.log(`\n   Supported Libraries: ${remixCapabilities.graphics.libraries.join(', ')}\n`);

  console.log('⚠️  Limitations:');
  remixCapabilities.limitations.restrictions.forEach(r => console.log(`   - ${r}`));
  console.log('');

  console.log(`🎮 Analyzed ${remixCapabilities.examples.length} games:\n`);
  const remixComplex = remixCapabilities.examples.filter(e => e.complexity === 'complex').length;
  const remixMedium = remixCapabilities.examples.filter(e => e.complexity === 'medium').length;
  const remixSimple = remixCapabilities.examples.filter(e => e.complexity === 'simple').length;
  
  console.log(`   Complex (WebGL/3D): ${remixComplex}`);
  console.log(`   Medium (Canvas): ${remixMedium}`);
  console.log(`   Simple (DOM/SVG): ${remixSimple}\n`);

  if (remixCapabilities.examples.length > 0) {
    console.log('   Top Examples:');
    remixCapabilities.examples.slice(0, 10).forEach((ex, i) => {
      console.log(`   ${i + 1}. ${ex.name} (${ex.complexity}) - ${ex.graphics.join(', ') || 'DOM-based'}`);
    });
    console.log('');
  }

  // Recommendations
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('💡 RECOMMENDATIONS FOR DREAMNET\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('🎨 Graphics Depth We Can Achieve:\n');
  console.log('   ✅ 2D Canvas Games:');
  console.log('      - Full support for HTML5 Canvas');
  console.log('      - Sprite-based games');
  console.log('      - Particle effects');
  console.log('      - Animation systems');
  console.log('      - Examples: Jaggy Stealth Run, Dream Lattice\n');

  console.log('   ✅ 3D WebGL Games:');
  console.log('      - Three.js for 3D graphics');
  console.log('      - PixiJS for 2D/WebGL hybrid');
  console.log('      - Phaser for game engines');
  console.log('      - Complex 3D scenes');
  console.log('      - Examples: Dream DNA Sequencer (3D), Dream Cloud Builder\n');

  console.log('   ✅ Interactive Experiences:');
  console.log('      - Real-time multiplayer (WebSockets)');
  console.log('      - Physics engines (Matter.js, Box2D)');
  console.log('      - Audio (Web Audio API)');
  console.log('      - Touch/Gamepad support\n');

  console.log('⚠️  Limitations to Consider:\n');
  console.log('   1. File Size Limits:');
  console.log('      - Bundle size may be limited');
  console.log('      - Large game engines may hit limits');
  console.log('      - Solution: Code splitting, lazy loading\n');

  console.log('   2. Runtime Restrictions:');
  console.log('      - No Node.js modules');
  console.log('      - No file system access');
  console.log('      - CORS restrictions');
  console.log('      - Solution: Use browser APIs, external APIs\n');

  console.log('   3. Performance:');
  console.log('      - Mobile device limitations');
  console.log('      - Battery consumption');
  console.log('      - Solution: Optimize rendering, use requestAnimationFrame\n');

  console.log('🎯 Best Games to Build:\n');
  console.log('   For Ohara:');
  console.log('   - Interactive apps with Canvas');
  console.log('   - Data visualization');
  console.log('   - Puzzle games');
  console.log('   - Social/community apps\n');

  console.log('   For Remix.gg:');
  console.log('   - Competitive games');
  console.log('   - Real-time multiplayer');
  console.log('   - On-chain leaderboards');
  console.log('   - Dream Remix Arena (perfect fit!)\n');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

generateReport().catch(console.error);



