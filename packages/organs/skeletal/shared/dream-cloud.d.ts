export interface DreamCloud {
    id: string;
    name: string;
    description: string;
    themeColor: string;
    icon: string;
    dreams: string[];
    remixXP: number;
    nodeAffinity?: string[];
    activeAgents: string[];
    trustRequired: number;
    createdBy: string;
    createdAt: number;
}
export interface DreamCloudStats {
    totalClouds: number;
    totalDreams: number;
    topPerformingCloud: string;
    averageRemixXP: number;
    activeNodes: string[];
}
export interface CloudActivity {
    cloudId: string;
    action: 'dream_added' | 'remix_submitted' | 'agent_activated' | 'node_connected';
    details: string;
    timestamp: number;
    actor: string;
}
export interface CloudDream {
    id: string;
    title: string;
    cloudId: string;
    tags: string[];
    remixXP: number;
    creator: string;
    status: 'active' | 'infected' | 'purified' | 'quarantined';
    trustLevel: string;
    nightmare: boolean;
    claimedBy: string | null;
    remix: {
        initiated: boolean;
        result: any;
        score: number | null;
        remixes?: RemixSubmission[];
    };
    bounty: {
        token: string;
        amount: number;
        expires: number;
        claimed: boolean;
        claimedBy: string | null;
        bountyId?: string;
        claimer?: string;
        submission?: string;
        proof?: string;
        claimSubmission?: string;
        claimProof?: string;
        claimDate?: number;
        hiddenBonus?: boolean;
    } | null;
    createdAt: number;
}
export interface RemixSubmission {
    remixId: string;
    claimer: string;
    submission: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: number;
    proof?: string;
    score?: number;
    remixThread?: string[];
}
export interface DreamTeam {
    id: string;
    name: string;
    leader: string;
    members: string[];
    cloudId: string;
    xp: number;
    badge: string;
    public: boolean;
    logoUrl?: string;
    createdAt: number;
}
export interface TeamActivity {
    teamId: string;
    action: 'member_joined' | 'member_left' | 'xp_earned' | 'badge_awarded' | 'dream_completed';
    details: string;
    timestamp: number;
    actor: string;
}
