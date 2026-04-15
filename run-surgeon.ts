import { SurgeonAgent } from './lib/aiSurgeonAgents';

async function run() {
  console.log('Starting AI Surgeon diagnostic sweep...');
  await SurgeonAgent.runDiagnosticSweep();
  console.log('AI Surgeon diagnostic sweep complete.');
}

run();
