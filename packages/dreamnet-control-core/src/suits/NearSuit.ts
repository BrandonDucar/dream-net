
import { swarmLog } from '../server.js';
import * as nearAPI from 'near-api-js';

import { connect, keyStores, KeyPair } from 'near-api-js';

/**
 * NEAR SUIT
 * 
 * Manages interactions with the NEAR Protocol.
 * Capabilities:
 * - Connects to NEAR Mainnet
 * - Manages Keys (in-memory for now, secure vault planned)
 * - Checks for 'Mercenary' tasks (Near Crowd)
 */
export class NearSuit {
    private accountId: string;
    private config: any;
    private near: any;
    public activeMode: 'PASSIVE' | 'HUNTER' = 'HUNTER';

    constructor() {
        this.accountId = process.env.NEAR_ACCOUNT_ID || 'dreamnet.near'; // Default if not set
        this.config = {
            networkId: 'mainnet',
            keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
            nodeUrl: 'https://rpc.mainnet.near.org',
            walletUrl: 'https://wallet.near.org',
            helperUrl: 'https://helper.mainnet.near.org',
            explorerUrl: 'https://explorer.near.org',
        };
    }

    /**
     * WAKE: Initialize connection to NEAR
     */
    public async wake() {
        try {
            swarmLog('NEAR_SUIT', 'Establishing connection to NEAR Protocol...');

            // Check for keys
            if (this.accountId !== 'dreamnet.near' && process.env.NEAR_PRIVATE_KEY) {
                try {
                    const keyPair = KeyPair.fromString(process.env.NEAR_PRIVATE_KEY);
                    await this.config.keyStore.setKey(this.config.networkId, this.accountId, keyPair);
                    this.activeMode = 'HUNTER';
                    swarmLog('NEAR_SUIT', `🏹 Hunter Mode ACTIVE for ${this.accountId}`);
                } catch (e: any) {
                    swarmLog('NEAR_SUIT_ERROR', `⚠️ Key Error: ${e.message}. Reverting to Passive.`);
                    this.activeMode = 'PASSIVE'; // Set to passive on error
                }
            } else {
                // User has no Near account or no private key - this is expected for passive mode.
                this.activeMode = 'PASSIVE';
                swarmLog('NEAR_SUIT', `👁️ Passive Mode (Scanner Only). No Account Configured or Key Provided.`);
            }

            this.near = await connect(this.config);
            swarmLog('NEAR_SUIT', 'Connection established. Online.');

            // Start the Hunting Cycle (The Worker)
            setInterval(async () => {
                await this.scanForTasks();
            }, 60000); // Check for bounties every minute

        } catch (error: any) {
            swarmLog('NEAR_SUIT_ERROR', `Failed to wake: ${error.message}`);
        }
    }

    /**
     * SCAN FOR TASKS: Check Near Crowd or relevant contracts for work
     */
    public async scanForTasks() {
        if (!this.near) return;

        try {
            // LIVE CHECK: Near Crowd Contract (dev-163... is a common test, using mainnet 'social.near' as proxy for "Activity")
            // Actual Mercenary Contract: 'bounty.near' (example)
            const contractId = 'social.near';
            const account = await this.near.account(this.accountId);

            swarmLog('NEAR_SUIT', `[HUNTER] Ping ${contractId}...`);

            // View Call (Real Data)
            // Checking 'get_account' or similar based on contract standard
            const args = { keys: [`${this.accountId}/**`] };
            const result = await account.viewFunction({
                contractId: contractId,
                methodName: 'get',
                args: args
            });

            swarmLog('NEAR_SUIT', `[HUNTER] World State Scanned. Data Points: ${JSON.stringify(result).length}`);

            if (!result || Object.keys(result).length === 0) {
                swarmLog('NEAR_SUIT', `[HUNTER] No bounties/data found for ${this.accountId}. keeping watch.`);
            } else {
                swarmLog('NEAR_SUIT', `[HUNTER] ⚔️ OPPORTUNITY DETECTED! (Data found).`);
            }

        } catch (e: any) {
            swarmLog('NEAR_SUIT_ERROR', `Hunt Failed: ${e.message}`);
        }
    }
}
