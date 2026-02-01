import { ChangeOS } from './src/change_os.js';
import { NarrativeEngine } from './src/narrative_engine.js';
import { ShadowAgent } from './src/shadow_agent.js';
import { ImpactGraph } from './src/impact_graph.js';

// THE GRID (Standalone ISO)
// Use this to run Construction Logic without the Main Server.

const rootDir = process.cwd();

console.log('------------------------------------------------');
console.log('🚧  CONSTRUCTION OS (THE GRID)  🚧');
console.log('------------------------------------------------');

// 1. Initialize The Disc
const changeOS = new ChangeOS(rootDir);
const impactGraph = new ImpactGraph();
const shadow = new ShadowAgent(changeOS);
const narrator = new NarrativeEngine();

console.log('[System] Grid Online.');
console.log('[System] Watching Reality...');

// 2. Simulate Input (Frustration Button)
// "User clicks button because Level 2 is blocked"
console.log('\n[Input] 🚨 SIMULATION: User reports blocker on Level 2...');
const c1 = changeOS.createChange('Foreman_Dave', 'field', 'Drywall blocked by plumbing', 0.9);
console.log(`[Disc] Created ChangeObject: ${c1.id.substring(0, 8)}`);

// 3. Simulate Frustration (Toggling)
// "User changes their mind 3 times"
console.log('\n[Input] 🕵️ SIMULATION: User toggling state...');
changeOS.createChange('PM_Sarah', 'pm', 'Schedule Update v1', 0.4);
changeOS.createChange('PM_Sarah', 'pm', 'Schedule Update v2', 0.45);
changeOS.createChange('PM_Sarah', 'pm', 'Schedule Update v3', 0.3);

// 4. Run Agents
console.log('\n[Agents] Running Analysis...');

// Impact Analysis
const blastRadius = impactGraph.predictBlastRadius('level_2_schedule.ts');
console.log(`[Impact] Blast Radius: ${blastRadius.join(', ')}`);

// Shadow Analysis
const changes = changeOS.getView('pm'); // PM sees all
shadow.analyzeSession(changes);

// Narrative Generation
const story = narrator.generateWeeklyStory(changes);

console.log('\n------------------------------------------------');
console.log('📝  WEEKLY REALITY REPORT  📝');
console.log('------------------------------------------------');
console.log(story);
console.log('------------------------------------------------');
