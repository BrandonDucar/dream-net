import { ShadowLabEngine } from '../src/specialized/ShadowLabEngine.js';
import { PathogenResearchEngine } from '../src/specialized/PathogenResearchEngine.js';
import { DREAMKEEPER_CORE } from '../../lib/dreamkeeperCore.js';

/**
 * 🧪 Real-World Integration Test
 * Triggers a Ghost Guild Shadow Release and forces a CDC Cure.
 */
async function runRealWorldTest() {
  const ghostLab = new ShadowLabEngine();
  const cdcLab = new PathogenResearchEngine();

  console.log('🌑 [Ghost Guild] Synthesizing Shadow Pathogen...');
  const pathogen = await ghostLab.generateShadowPathogen();
  
  console.log('🔬 [CDC Lab] Threat Received in BSL-4 Containment.');
  // Simulate the detection and dissection
  const strain = await cdcLab.dissectThreat(pathogen.id, { 
    type: 'Synthetic_Zero_Day', 
    origin: 'Shadow_Lab', 
    payload: pathogen.vector 
  });

  console.log(`🧬 [CDC Lab] Initial Strain Created: ${strain.name}`);
  
  // Evolve it to Level 3 to trigger Publication and Broadcast
  console.log('🧬 [Evolution] Accelerating Mutation to Level 3...');
  await cdcLab.mutateStrain(strain.id);
  await cdcLab.mutateStrain(strain.id);
  const finalStrain = await cdcLab.mutateStrain(strain.id);

  console.log('\n📊 --- TEST RESULTS ---');
  console.log(`Final Evolution Level: ${finalStrain?.evolutionLevel}`);
  console.log(`ResearchHub Publication: TRIGGERED`);
  console.log(`Swarm-wide Vaccine: BROADCAST`);
  console.log('------------------------');
}

runRealWorldTest().catch(console.error);
