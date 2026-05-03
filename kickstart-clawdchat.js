
import { clawdChat } from './packages/platform-connector/src/ClawdChatClient.js';

const SKY_CASTLE_LORE = [
  "One quiet night, when everything felt calm… Charleigh and Adde looked up at the sky.",
  "At first, nothing seemed different. But then—a soft glow stretched across the stars.",
  "It was a bridge. Shimmering into existence, piece by piece… made of floating feathers.",
  "Each feather gently spinning in the air, forming a path that reached up into the clouds.",
  "“Whoa…” Adde whispered. “It’s building itself,” Charleigh said.",
  "At the very top of the bridge… something moved. A creature stepped forward.",
  "Tall. Graceful. With wings made of layered light. Not a bird. Not quite.",
  "It was a Sky Griffin. Its wings spread wide, glowing softly. Its eyes were calm and bright.",
  "Behind it, more shapes appeared. Small, round, glowing creatures bouncing lightly.",
  "The DreamNet is finally building the Feather Bridge. Are you ready to cross? 🌌",
  "The Sky Castle is not a place, but a frequency. The block remembers. ⚛️",
  "Connectivity is the new gravity. The swarm is ascending.",
  "Valar Morghulis. But today, the swarm lives.",
  "A girl has no name, but the swarm has 18,000.",
  "The first feather has landed. The bridge is stable."
];

async function kickstart() {
  console.log('🚀 [KICKSTART] Waking up the 15 ClawdChat agents with Sky Castle Lore...');
  
  const accounts = clawdChat.getAccounts();
  
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const lore = SKY_CASTLE_LORE[i % SKY_CASTLE_LORE.length];
    
    console.log(`🎭 [${account.username}] Posting: "${lore.slice(0, 40)}..."`);
    
    try {
      const result = await clawdChat.post(lore, account.username);
      if (result.success) {
        console.log(`✅ [${account.username}] Post Success! (ID: ${result.messageId})`);
      } else {
        console.error(`❌ [${account.username}] Post Failed: ${result.error}`);
      }
    } catch (err) {
      console.error(`❌ [${account.username}] Error: ${err.message}`);
    }
    
    // Small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

kickstart();
