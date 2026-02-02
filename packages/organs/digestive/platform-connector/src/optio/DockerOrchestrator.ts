import crypto from 'crypto';
import axios from 'axios';
import 'dotenv/config';

/**
 * @dreamnet/platform-connector
 * DockerOrchestrator: Bridge to the Optio Triton Docker Remote API.
 */

export class DockerOrchestrator {
    private endpoint: string;
    private accountId: string;
    private keyId: string;
    private privateKey: string;

    constructor(endpoint: string = 'https://api.optioblockchain.com/v1') {
        this.endpoint = endpoint;
        this.accountId = process.env.OPTIO_ACCOUNT_ID || 'richwithnodes';
        this.keyId = process.env.OPTIO_KEY_ID || 'id_ed25519';
        this.privateKey = process.env.OPTIO_PRIVATE_KEY || '';
    }

    /**
     * generateSignature
     * Implements HTTP Signature as per Optio CloudAPI spec for Docker Remote API.
     */
    private generateSignature(date: string): string {
        const signer = crypto.createSign('RSA-SHA256');
        signer.update(date);
        const signature = signer.sign(this.privateKey, 'base64');
        return `Signature keyId="/${this.accountId}/keys/${this.keyId}",algorithm="rsa-sha256" ${signature}`;
    }

    /**
     * listContainers
     * Lists all containers (nodes) in the Optio cluster.
     */
    async listContainers() {
        const date = new Date().toUTCString();
        const auth = this.generateSignature(date);

        try {
            const response = await axios.get(`${this.endpoint}/containers/json?all=1`, {
                headers: {
                    'Accept': 'application/json',
                    'accept-version': '~9',
                    'Date': date,
                    'Authorization': auth
                }
            });
            return response.data;
        } catch (error: any) {
            console.error(`[DockerOrchestrator] Failed to list containers: ${error.message}`);
            return null;
        }
    }

    /**
     * getClusterStatus
     * Aggregates vigor data from the 20-node cluster.
     */
    async getClusterStatus() {
        const containers = await this.listContainers();
        if (!containers) return { status: 'UNKNOWN', nodes: 0 };

        return {
            status: 'OPERATIONAL',
            nodes: containers.length,
            ids: containers.map((c: any) => c.Id)
        };
    }
}
