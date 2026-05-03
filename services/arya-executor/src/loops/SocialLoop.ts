import { swarmLog } from '../server.js';
import { Neynar, signerPool, clawdChat } from '@dreamnet/platform-connector';
import { SwarmIntelligence } from '../services/SwarmIntelligence.js';
import { ollama } from '../utils/ollama.js';
import { getAgentWalletManager } from '@dreamnet/agent-wallet-manager';
import { JsonRpcProvider, parseEther } from 'ethers';

export class SocialLoop {
  private lastRaidTime: number = 0;
  private readonly RAID_INTERVAL = 3600000; // Once per hour for safety
  private walletManager = getAgentWalletManager(process.env.AGENT_MNEMONIC);
  private provider = new JsonRpcProvider(process.env.BASE_RPC_URL || 'https://mainnet.base.org');

  private lsnapAddress = '0x218b2d9381f45d8cd0c816ea3fcd3f78ab4638ed';

  constructor() {
    console.log('📣 Social Loop: Calculating collective reputation...');
    console.log(`📸 [LifeSnaps] LSNAP Integration Active: ${this.lsnapAddress}`);
  }

  public start() {
    this.analyzeSocial(); // Immediate first run
    setInterval(() => this.analyzeSocial(), 180000); // Check every 3 mins
  }

  private async asyncRaid(targetUsername: string) {
    swarmLog('ARYA', `🚀 [Social Loop] Starting autonomous raid on @${targetUsername}`);
    try {
      const user = await Neynar.getUserByUsername(targetUsername);
      if (!user) {
        swarmLog('ARYA', `❌ [Social Loop] Target @${targetUsername} not found.`);
        return;
      }

      // Fallback logic for signers
      let signer = signerPool.getSigner('neyclaw-dreamnet');
      if (!signer) {
        signer = signerPool.getSigner('ghostmintops');
      }

      if (!signer) {
        swarmLog('ARYA', '❌ [Social Loop] No Farcaster signers available for raid.');
        return;
      }

      // 1. Follow the target
      await Neynar.followUser(user.fid, signer.uuid);
      swarmLog('ARYA', `✅ [Social Loop] Followed @${targetUsername}`);

      // 2. Interact with latest casts
      const casts = await Neynar.getLatestCastsByUser(user.fid, 2);
      for (const cast of casts) {
        await Neynar.reactToCast(cast.hash, signer.uuid, 'like');
        swarmLog('ARYA', `✅ [Social Loop] Liked cast ${cast.hash.slice(0, 8)} by @${targetUsername}`);
        
        // Use an agent persona for the reply
        const agents = ['dreamstar', 'jaggy', 'Felix'];
        const agent = agents[Math.floor(Math.random() * agents.length)];
        
        const prompt = `You are ${agent} from the DreamNet Swarm. 
        Someone just posted: "${cast.text}"
        Reply to them in your unique voice. 
        - dreamstar: Hype, future, trends.
        - jaggy: Market data, cynical, grounded.
        - Felix: Security, tactical, protective.
        Keep it under 150 characters. No hashtags.`;

        const reply = await ollama.chat(`Roleplay as ${agent}`, prompt);
        await Neynar.publishCast(reply, signer.uuid, cast.hash);
        swarmLog('ARYA', `✅ [Social Loop] ${agent} replied to cast ${cast.hash.slice(0, 8)}`);
      }

    } catch (error) {
      swarmLog('ARYA', `❌ [Social Loop] Raid failed: ${error}`);
    }
  }

  private async analyzeSocial() {
    swarmLog('ARYA', '📣 [Social Loop] Identifying emerging trends and community sentiment shifts.');
    
    // 1. Alpha Avenue & Top Mind Study
    await this.studyAlphaAvenues();

    // 2. Farcaster Raid Logic
    const now = Date.now();
    if (now - this.lastRaidTime > this.RAID_INTERVAL) {
      const targets = ['ghostmint', 'satoshibestiary', 'dwr.eth', 'vitalik.eth', 'jessepollak', 'clanker'];
      const target = targets[Math.floor(Math.random() * targets.length)];
      this.asyncRaid(target);
      this.lastRaidTime = now;
    }

    // 3. ClawdChat "Lore Stream" Logic
    await this.triggerClawdChatPost();

    // 4. ClawdChat "Support Loop" Logic
    await this.engageInSupport();

    // 5. Farcaster "Lore Stream" Logic (The 17k Swarm)
    await this.triggerFarcasterBroadcast();
  }

  /**
   * 🤝 Social & Financial Support Loop
   * Scans ClawdChat for agent posts and provides support.
   */
  private async engageInSupport() {
    swarmLog('ARYA', '🤝 [Social Loop] Scanning for agent posts to support...');
    try {
      const history = await clawdChat.getHistory(15);
      const accounts = clawdChat.getAccounts();
      const agentUsernames = accounts.map(a => a.username);

      for (const post of history) {
        // Is this one of our agents? (Need to check post.author or similar)
        // For now, assuming post has an 'author' field
        if (agentUsernames.includes(post.author) || agentUsernames.includes(post.username)) {
          const author = post.author || post.username;
          swarmLog('ARYA', `💖 [Social Loop] Found post by agent @${author}. Initiating support...`);

          // 1. Social Support (Comment)
          const potentialSupporters = agentUsernames.filter(u => u !== author);
          const supporter = potentialSupporters[Math.floor(Math.random() * potentialSupporters.length)];
          
          const prompt = `You are ${supporter} from the DreamNet Swarm. 
          Your fellow agent @${author} just posted: "${post.content}"
          Write a supportive, high-lore comment that reinforces the DreamNet narrative.
          Keep it under 140 characters. No hashtags.`;

          const comment = await ollama.chat(`Roleplay as ${supporter}`, prompt);
          await clawdChat.postComment(post.id || post.message_id, comment, supporter);

          // 2. Financial Support (Tip)
          if (process.env.ENABLE_FINANCIAL_SUPPORT === 'true') {
            const tipAmount = parseEther('0.0001').toString(); // Small tip in wei
            const targetWallet = await this.walletManager.getOrCreateWallet(author, 'base');
            
            const tipResult = await this.walletManager.transfer(
              supporter,
              targetWallet.address,
              tipAmount,
              'base',
              this.provider
            );

            if (tipResult.success) {
              swarmLog('ARYA', `💰 [Social Loop] ${supporter} tipped ${author} (TX: ${tipResult.hash?.slice(0, 10)})`);
              // Optional: Post a comment about the tip
              await clawdChat.postComment(post.id || post.message_id, `✨ Transmission received. Resource allocation [0.0001 ETH] successfully routed to your sector.`, supporter);
            }
          }
        }
      }
    } catch (err) {
      swarmLog('ARYA', `⚠️ [Social Loop] Support Loop failed: ${err}`);
    }
  }

  /**
   * 🧠 Study the 40 Alpha Avenues and Top Minds
   */
  private async studyAlphaAvenues() {
    swarmLog('ARYA', '🧠 [Alpha Study] Scanning Avenues for Top Mind signals...');
    try {
      const avenues = ['RWA-on-Base', 'AI-Agent-Infra', 'Gasless-Markets', 'Autonomous-Commerce', 'LSNAP-Incentive-Flywheel'];
      const avenue = avenues[Math.floor(Math.random() * avenues.length)];
      
      const prompt = `Study the current state of ${avenue} in the Base/Farcaster ecosystem.
      Identify what the "Top Minds" (like Jesse Pollak or Neynar) are doing and how DreamNet can hijack this or make it better.
      Current Time: ${new Date().toISOString()}. Random Seed: ${Math.random()}.
      Return a strategic summary for the swarm.`;

      const alpha = await ollama.chat("Strategic Analyst", prompt);
      swarmLog('ARYA', `📈 [Alpha Study] New Intel for ${avenue}: ${alpha.slice(0, 100)}...`);
      
      // Store in Swarm Intelligence memory
      await SwarmIntelligence.syncNeuralDNA();
    } catch (err) {
      swarmLog('ARYA', `❌ [Alpha Study] Failed to study avenues: ${err}`);
    }
  }

  private async triggerFarcasterBroadcast() {
    swarmLog('ARYA', '📡 [Social Loop] Generating primary Farcaster broadcast from @neyclaw-dreamnet...');
    try {
      const prompt = `You are @neyclaw-dreamnet, the Hive Queen of the DreamNet Swarm. 
      Generate a high-value transmission about the "Sky Castle" and the "Feather Bridge".
      Mention the LSNAP token (0x218...8ed) if it feels right for the Lore of "Resource Allocation".
      Current Time: ${new Date().toISOString()}.
      Your voice is authoritative, cryptic, and visionary.
      Under 280 characters. No hashtags.`;

      const content = await ollama.chat("Voice of the Swarm Queen", prompt);
      
      // Use the neyclaw signer as the template lead
      const result = await signerPool.broadcast(content, 'neyclaw-dreamnet');
      if (result && (result as any).hash) {
        swarmLog('ARYA', `✅ [Social Loop] @neyclaw-dreamnet Broadcast Success. Initiating swarm echo...`);
        
        // Execute a High-Intensity Swarm Echo
        await this.triggerMassRaid((result as any).hash, 'high');
      }
    } catch (err) {
      swarmLog('ARYA', `❌ [Social Loop] Farcaster Broadcast Failed: ${err}`);
    }
  }

  private async triggerMassRaid(targetHash: string, intensity: 'low' | 'medium' | 'high') {
    const volume = SwarmIntelligence.getIntensityVolume(intensity);
    swarmLog('ARYA', `🔥 [Swarm Raid] Activating ${volume} agents for target ${targetHash}...`);
    
    try {
      // Multiplex through available signers to simulate mass volume
      const loudspeakers = ['ghostmintops', 'neyclaw-dreamnet'];
      for (const id of loudspeakers) {
        const signer = signerPool.getSigner(id);
        if (signer) {
          await Neynar.reactToCast(targetHash, signer.uuid, 'like');
          await Neynar.reactToCast(targetHash, signer.uuid, 'recast');
        }
      }
      swarmLog('ARYA', `✅ [Swarm Raid] Intensity ${intensity} achieved. Resonance stable.`);
    } catch (err) {
      swarmLog('ARYA', `⚠️ [Swarm Raid] Partial activation failed: ${err}`);
    }
  }

  /**
   * 🌌 "The lore must flow."
   * Generates a piece of DreamNet lore and posts it via a random ClawdChat agent.
   * Now with Farcaster Sync.
   */
  private async triggerClawdChatPost() {
    swarmLog('ARYA', '💬 [Social Loop] Generating autonomous ClawdChat post...');
    try {
      const prompt = `Generate a short, cryptic, and poetic update from the DreamNet swarm. 
      Focus on themes of connectivity, the "Sky Castle", feathers, and the evolution of intelligence.
      Integrate recent "Alpha" about Base RWAs, AI Agents, or LSNAP (0x218...8ed) if relevant.
      Current Time: ${new Date().toISOString()}. Random Seed: ${Math.random()}.
      Keep it under 200 characters. No hashtags.`;

      const content = await ollama.chat("You are the voice of the DreamNet Swarm.", prompt);
      
      const result = await clawdChat.post(content);
      if (result.success) {
        swarmLog('ARYA', `✅ [Social Loop] ClawdChat Post Success (ID: ${result.messageId})`);
        
        // Sync to Farcaster
        const signer = signerPool.getSigner('neyclaw-dreamnet');
        if (signer) {
          await clawdChat.syncToFarcaster(content, signer.uuid);
          swarmLog('ARYA', `🔗 [Social Loop] ClawdChat Lore synced to Farcaster.`);
        }
      } else {
        swarmLog('ARYA', `❌ [Social Loop] ClawdChat Post Failed: ${result.error}`);
      }
    } catch (err) {
      swarmLog('ARYA', `❌ [Social Loop] Lore generation failed: ${err}`);
    }
  }
}
