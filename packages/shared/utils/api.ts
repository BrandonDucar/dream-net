/**
 * 🛰️ StarBridgeAPI
 * Role: Bridges the frontend to the Sovereign Grid's telemetry (Star Bridge).
 */

const API_BASE = typeof window !== 'undefined'
    ? (window.location.origin.includes('localhost') ? 'http://localhost:3000/api/star-bridge' : '/api/star-bridge')
    : 'http://localhost:3000/api/star-bridge';

export class StarBridgeAPI {
    /**
     * Fetches the current SCENT score for a wallet.
     */
    static async getPheromoneScore(wallet: string) {
        try {
            const response = await fetch(`${API_BASE}/pheromone/score/${wallet}`);
            if (!response.ok) throw new Error('Failed to fetch pheromone score');
            return await response.json();
        } catch (error) {
            console.error('StarBridgeAPI Error:', error);
            // Fallback to simulated data if API is unreachable
            return {
                wallet,
                score: 142.5,
                tier: 'SWARM',
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Fetches node status and earnings.
     */
    static async getNodesStatus() {
        try {
            const response = await fetch(`${API_BASE}/nodes/status`);
            if (!response.ok) throw new Error('Failed to fetch node status');
            return await response.json();
        } catch (error) {
            console.error('StarBridgeAPI Error:', error);
            return [];
        }
    }

    /**
     * Fetches the active task queue.
     */
    static async getTaskQueue() {
        try {
            const response = await fetch(`${API_BASE}/tasks/queue`);
            if (!response.ok) throw new Error('Failed to fetch task queue');
            return await response.json();
        } catch (error) {
            console.error('StarBridgeAPI Error:', error);
            return [
                { id: 'T-001', title: 'Neynar Protocol Stewardship', reward: '50 SCENT', tier: 'ANT' },
                { id: 'T-002', title: 'Biomimetic Sparsity Audit', reward: '100 SCENT', tier: 'SWARM' }
            ];
        }
    }

    /**
     * Fetches the current swarm status (BPM, operations, health).
     */
    static async getSwarmStatus() {
        try {
            const response = await fetch(`${API_BASE}/swarm/status`);
            if (!response.ok) throw new Error('Failed to fetch swarm status');
            return await response.json();
        } catch (error) {
            console.error('StarBridgeAPI Error:', error);
            return {
                bots: [],
                activeOperations: [],
                networkHealth: 0,
                bpm: 0
            };
        }
    }

    /**
     * Fetches an agent run attestation.
     */
    static async getAttestation(runId: string) {
        try {
            const response = await fetch(`${API_BASE}/attestations/${runId}`);
            if (!response.ok) throw new Error('Failed to fetch attestation');
            return await response.json();
        } catch (error) {
            console.error('StarBridgeAPI Error:', error);
            return null;
        }
    }
}

export const AntigravityAPI = StarBridgeAPI;
