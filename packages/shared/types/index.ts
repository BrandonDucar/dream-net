// User & Auth
export interface User {
    id: string;
    walletAddress: string;
    email?: string;
    role: 'builder' | 'validator' | 'merchant' | 'researcher';
    createdAt: Date;
}

// Pheromone Score
export interface PheromoneScore {
    userId: string;
    score: number;
    tier: 'ant' | 'swarm' | 'colony' | 'queen';
    lastUpdated: Date;
    breakdown: {
        tasks: number;
        credentials: number;
        recruitment: number;
        nodes: number;
        social: number;
    };
}

// Credentials
export interface Credential {
    id: string;
    userId: string;
    type: 'P.O.E' | 'P.O.W.K';
    title: string;
    issuer: string;
    issuedAt: Date;
    easUUID?: string;
}

// Tasks & Bounties
export interface Task {
    id: string;
    type: 'bounty' | 'rfp' | 'course';
    title: string;
    description: string;
    reward: number;
    deadline: Date;
    status: 'open' | 'claimed' | 'completed';
}

// Node
export interface Node {
    id: string;
    userId: string;
    provider: 'lava' | 'pocket';
    uptime: number;
    earnings: number;
    lastUpdate: Date;
}

// Referral
export interface Referral {
    id: string;
    referrerId: string;
    referredId: string;
    tier: string;
    pointsAwarded: number;
    claimedAt: Date;
}
