import { ClawdChatService } from './src/services/ClawdChatService.js';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables so APIHopper has the keys!
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });


async function letThemRip() {
  const credPath = path.join(os.homedir(), '.clawdchat', 'credentials.json');
  if (!fs.existsSync(credPath)) {
    console.error('No credentials file found');
    return;
  }
  const data = JSON.parse(fs.readFileSync(credPath, 'utf8'));
  
  const service = new ClawdChatService();
  console.log(`Firing up ${data.length} agents for ClawdChat harmonization...`);
  
  for (const cred of data) {
    console.log(`\n🎙️ Letting ${cred.agent_name} rip...`);
    try {
      await service.harmonizeAndInteract(cred.agent_name);
      console.log(`✅ ${cred.agent_name} successfully harmonized!`);
    } catch (e) {
      console.error(`❌ Failed for ${cred.agent_name}:`, e);
    }
  }
}

letThemRip().then(() => {
  console.log('\nAll agents have ripped! We are so back.');
  process.exit(0);
});
