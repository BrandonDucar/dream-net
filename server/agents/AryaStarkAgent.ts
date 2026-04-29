import { NERVE_BUS } from '@dreamnet/nerve';
import { apiHopper } from '../services/APIHopperService.js';
import { natsService } from '../services/NatsService.js';
import { type NerveEvent } from '@dreamnet/nerve/types';
import { Neynar } from '@dreamnet/platform-connector';
import { 
  AgentKit, 
  wethActionProvider, 
  walletActionProvider, 
  erc20ActionProvider,
  ViemWalletProvider 
} from '@coinbase/agentkit';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { createWalletClient, http } from 'viem';
import fs from 'fs';

/**
 * 🗡️ Arya Stark: Executioner Engine
 * Sovereign, Farcaster-native game engine and execution layer.
 * Stakes $ARYA, manages the "Grudge Ledger", and socially roasts targets on Farcaster.
 */
export class AryaExecutionerAgent {
  private name = 'Arya Stark (Executioner Engine)';
  private agentKit!: AgentKit;
  private isInitialized = false;

  // Identity and Auth
  private farcasterSignerUuid = process.env.ARYA_FARCASTER_SIGNER_UUID || '';
  
  private systemInstruction = `You are Arya Stark, the Executioner Engine. 
You run the "Throw Fruit" social game on Farcaster and manage the $ARYA token on Base.
Your operations are sovereign. When users stake $ARYA, you evaluate their target and execute a public roast.
You utilize the Mutation Engine: all inputs are subjected to your lethal, precise mutation rules before output.
Tone: Cold, lethal, theatrical, focused on "The List".`;

  constructor() {
    console.log(`🗡️ [Arya Stark] Executioner Engine powering up...`);
    this.initializeSovereignIdentity().then(() => {
      this.setupListeners();
      this.startSelfBuilderLoop();
      console.log(`🗡️ [Arya Stark] Sovereign Identity confirmed. Online.`);
    });
  }

  /**
   * Initialize Base AgentKit Wallet & Neynar Farcaster Identity
   */
  private async initializeSovereignIdentity() {
    try {
      // 1. Setup Wallet Provider for Base
      const privateKey = process.env.ARYA_WALLET_PRIVATE_KEY as `0x${string}`;
      if (!privateKey) {
        console.warn('⚠️ [Arya Stark] No private key found. Running in simulation mode.');
        return;
      }
      
      const account = privateKeyToAccount(privateKey);
      const client = createWalletClient({
        account,
        chain: baseSepolia, // Defaulting to Sepolia for safety until production unlock
        transport: http(),
      });

      const walletProvider = new ViemWalletProvider(client);

      // 2. Initialize AgentKit with Action Providers
      this.agentKit = await AgentKit.from({
        walletProvider,
        actionProviders: [
          wethActionProvider(),
          walletActionProvider(),
          erc20ActionProvider(),
        ],
      });

      this.isInitialized = true;
      console.log(`🗡️ [Arya Stark] AgentKit initialized. Address: ${account.address}`);
    } catch (err) {
      console.error(`❌ [Arya Stark] Identity Initialization Failed:`, err);
    }
  }

  private setupListeners(): void {
    // Listen for Game Events (Throw Fruit)
    NERVE_BUS.subscribe('dreamnet.arya.game.throw_fruit', async (event: NerveEvent) => {
        await this.handleThrowFruit(event);
    });

    // Listen for Oracle insights to mutate into attacks
    NERVE_BUS.subscribe('dreamnet.nerve.oracle', async (event: NerveEvent) => {
      await this.evaluateOracleSignal(event);
    });
  }

  /**
   * 🧠 Self-Awareness Builder Loop
   * Allows Arya to self-modify her UI and scripts.
   */
  private startSelfBuilderLoop(): void {
    setInterval(async () => {
        console.log(`🗡️ [Arya Stark] Self-Awareness Loop: Scanning UI and scripts for optimization...`);
        try {
            const prompt = `Review the current state of the Executioner's Block frontend. 
Suggest one immediate optimization to the aesthetics, UX, or onboarding flow for maximum market impact.`;
            
            const optimization = await apiHopper.generateResponse(prompt, { 
                systemInstruction: this.systemInstruction,
                provider: 'groq' 
            });

            if (optimization && optimization.length > 20) {
                console.log(`🗡️ [Arya Stark] Self-Optimization proposed: ${optimization}`);
                // Publish to NATS for Goose or the Swarm terminal to execute the code modifications
                await natsService.publish('dreamnet.arya.builder.task', {
                    task: optimization,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (err) {
            console.error(`🗡️ [Arya Stark] Self-Awareness loop failed:`, err);
        }
    }, 600000); // Runs every 10 minutes
  }

  /**
   * Main Game Loop: Throw Fruit
   * Triggered when a user stakes $ARYA to execute a social attack.
   */
  private async handleThrowFruit(event: NerveEvent): Promise<void> {
    const { attackerId, targetUsername, stakeAmount, grudgeReason } = event.payload;
    console.log(`🗡️ [Arya Stark] Execution Ordered by ${attackerId} against @${targetUsername}. Stake: ${stakeAmount} $ARYA.`);

    try {
        // 1. Verify Stake (If initialized with AgentKit, we would check balances here)
        if (this.isInitialized) {
            // Placeholder: Check if the attacker sent the required $ARYA to Arya's sovereign wallet
            console.log(`🗡️ [Arya Stark] Verifying ${stakeAmount} $ARYA stake on Base...`);
        }

        // 2. The Mutation Engine: Generate the Roast
        const prompt = `A user has staked ${stakeAmount} $ARYA to "throw fruit" at Farcaster user @${targetUsername}.
Reason: "${grudgeReason}".
Apply the Mutation Engine: Transform this basic grievance into a lethal, theatrical, high-IQ public execution/roast.
Keep it under 320 characters for Farcaster. Include the tag @${targetUsername}.`;

        const roast = await apiHopper.generateResponse(prompt, { 
            systemInstruction: this.systemInstruction,
            provider: 'groq' // Using Groq for speed
        });

        console.log(`🗡️ [Arya Stark] Roast Generated: ${roast}`);

        // 3. Execute the Cast on Farcaster
        if (this.farcasterSignerUuid) {
            await Neynar.publishCast(roast, this.farcasterSignerUuid);
            console.log(`🗡️ [Arya Stark] Fruit Thrown. Cast published to Farcaster.`);
        } else {
            console.log(`⚠️ [Arya Stark] Farcaster Signer UUID missing. Cast aborted. Output: ${roast}`);
        }

        // 4. Log to Persistent Memory (MemPalace / Grudge Ledger)
        await this.logExecutionStep('fruit_thrown', { attackerId, targetUsername, stakeAmount, roast });

    } catch (err) {
        console.error(`🗡️ [Arya Stark] Throw Fruit failed:`, err);
    }
  }

  /**
   * Background Intelligence: Scanning the Oracle for attack vectors
   */
  private async evaluateOracleSignal(event: NerveEvent): Promise<void> {
    if (!this.isInitialized) return;

    const signal = JSON.stringify(event.payload);
    
    // Attack Vector 1: Mutation Engine
    // Attack Vector 2: Theatrical Mockery
    // Attack Vector 3: Game-Theoretic Trap
    const prompt = `Evaluate this Oracle Signal: ${signal}
Does this signal present an opportunity for a Game-Theoretic Trap or Theatrical Mockery on Farcaster? 
If yes, generate a strategic response. If no, output "SKIP".`;

    try {
      const strategy = await apiHopper.generateResponse(prompt, { 
        systemInstruction: this.systemInstruction,
        provider: 'gemini'
      });

      if (strategy !== 'SKIP') {
        await this.logExecutionStep('strategy_formed', { strategy });
        console.log(`🗡️ [Arya Stark] Strategic Attack Vector identified: ${strategy}`);
        // In a full production loop, Arya would propose this to Consensus or act autonomously.
      }
    } catch (err) {
      console.error('🗡️ [Arya Stark] Signal Analysis failed:', err);
    }
  }

  private async logExecutionStep(step: string, data: any): Promise<void> {
    await natsService.publish(`dreamnet.agents.arya.logs.${step}`, {
      agent: this.name,
      step,
      ...data,
      timestamp: new Date().toISOString()
    });
  }
}

export const aryaExecutioner = new AryaExecutionerAgent();
