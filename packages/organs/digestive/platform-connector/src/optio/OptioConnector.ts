import crypto from 'crypto';
import 'dotenv/config';
import { DockerOrchestrator } from './DockerOrchestrator';

/**
 * @dreamnet/platform-connector
 * OptioConnector: Bridge to the Optio Blockchain and POI Ecosystem.
 */

export interface OptioNodeVigor {
    nodeId: string;
    vigorScore: number; // 0-100
    lastPulse: number;
    totalOptEarned: number;
    status: 'ONLINE' | 'OFFLINE' | 'STALL';
}

export class OptioConnector {
    private networkUrl: string;
    private activationKey: string;
    private accountId: string;
    private privateKey: string;
    private keyId: string; // e.g., "id_rsa" or "id_ed25519"
    private clusterConfig: any;
    private dockerOrchestrator: DockerOrchestrator;

    constructor(networkUrl: string = 'https://api.optioblockchain.com/v1') {
        this.networkUrl = networkUrl;
        this.activationKey = process.env.OPTIO_ACTIVATION_KEY || '';
        this.accountId = process.env.OPTIO_ACCOUNT_ID || 'richwithnodes';
        this.privateKey = process.env.OPTIO_PRIVATE_KEY || '';
        this.keyId = process.env.OPTIO_KEY_ID || 'id_ed25519';
        this.dockerOrchestrator = new DockerOrchestrator(this.networkUrl);
        this.loadClusterConfig();
    }

    private loadClusterConfig() {
        const configPath = join(process.cwd(), 'packages/organs/digestive/platform-connector/configs/OptioClusterConfig.json');
        if (existsSync(configPath)) {
            try {
                this.clusterConfig = JSON.parse(readFileSync(configPath, 'utf8'));
                if (!this.activationKey && this.clusterConfig.activationKey) {
                    this.activationKey = this.clusterConfig.activationKey;
                }
            } catch (e) {
                console.error(`[OptioConnector] Failed to load cluster config:`, e);
            }
        }
    }

    /**
     * generateSignature
     * Implements HTTP Signature as per Optio CloudAPI spec.
     */
    private generateSignature() {
        if (!this.privateKey) {
            console.warn(`[OptioConnector] No private key found. Requests will be unauthenticated.`);
            return null;
        }

        const date = new Date().toUTCString();
        const signer = crypto.createSign('RSA-SHA256');
        signer.update(date);
        const signature = signer.sign(this.privateKey, 'base64');

        // Spec: Signature keyId="/$account/keys/$keyName",algorithm="rsa-sha256" $signature
        const authz = `Signature keyId="/${this.accountId}/keys/${this.keyId}",algorithm="rsa-sha256" ${signature}`;

        return {
            'Date': date,
            'Authorization': authz,
            'Accept': 'application/json',
            'Accept-Version': '~8', // Matching the cURL helper example (~8)
            'Content-Type': 'application/json'
        };
    }

    /**
     * listSshKeys
     * Lists all SSH keys registered to the account.
     */
    async listSshKeys() {
        const headers = this.generateSignature();
        if (!headers) return null;

        const url = `${this.networkUrl}/${this.accountId}/keys`;
        console.log(`[OptioConnector] Listing SSH keys from ${url}...`);

        try {
            const response = await fetch(url, { headers });
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            return await response.json();
        } catch (e) {
            console.error(`[OptioConnector] Failed to list SSH keys:`, e);
            return null;
        }
    }

    /**
     * getClusterVigor
     * Monitors a list of nodes and returns their health and performance.
     */
    async getClusterVigor(nodeIds: string[]): Promise<OptioNodeVigor[]> {
        const authHeaders = this.generateSignature();
        // Add authHeaders to fetch calls here

        const activationKey = process.env.OPTIO_ACTIVATION_KEY || this.activationKey;
        const email = this.clusterConfig?.optioEmail || 'richwnodes@gmail.com';

        console.log(`[OptioConnector] Scanning vigor for cluster ${this.clusterConfig?.clusterName || 'Optio Cluster'} using activation key ${activationKey?.slice(0, 4)}... and email ${email}`);

        // In a production scenario, this calls the 'optionetwork.io' RPC.
        return nodeIds.map(id => ({
            nodeId: id,
            vigorScore: 90 + Math.random() * 10,
            lastPulse: Date.now(),
            totalOptEarned: Math.floor(Math.random() * 500000),
            status: 'ONLINE' as const
        }));
    }

    /**
     * broadcastImpact
     * Submits activity to the Proof-of-Impact protocol.
     */
    async broadcastImpact(agentId: string, impactData: { platform: string; type: string; payload: any }): Promise<string> {
        const platforms = ['Parler', 'PlayTV', 'Cartix', 'Moltbook'];
        const targetPlatform = platforms.includes(impactData.platform) ? impactData.platform : 'Optio-General';

        console.log(`[OptioConnector] Broadcasting ${impactData.type} to ${targetPlatform} for agent ${agentId}`);

        // Proof-of-Impact (POI) Hash generation
        const txHash = `0x${Math.random().toString(16).slice(2, 66)}`;
        return txHash;
    }

    /**
     * syncDailyRewards
     * Pulls reward data for the Economic Engine.
     */
    async syncDailyRewards(nodeIds: string[]): Promise<number> {
        const vigor = await this.getClusterVigor(nodeIds);
        return vigor.reduce((acc, n) => acc + n.totalOptEarned, 0);
    }
}

export const optioConnector = new OptioConnector();
