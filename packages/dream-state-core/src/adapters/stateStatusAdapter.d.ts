export interface DreamStateDashboardView {
    citizenCount: number;
    passportCount: number;
    departmentCount: number;
    diplomaticRelationsCount: number;
    headOfState: string;
    citizens: {
        identityId: string;
        passportNumber?: string;
        tier: string;
        joinedAt: number;
        contributions: number;
    }[];
    passports: {
        passportNumber?: string;
        identityId: string;
        tier: string;
        transferable?: boolean;
        currentOwner?: string;
    }[];
    departments: {
        id: string;
        name: string;
        packId: string;
        responsibilities: string[];
    }[];
    diplomaticRelations: {
        id: string;
        protocolName: string;
        protocolType: string;
        status: string;
    }[];
    stateSymbols: {
        type: string;
        name: string;
        content: string;
        description: string;
    }[];
    recentActions: {
        type: string;
        department: string;
        action: string;
        timestamp: number;
    }[];
}
/**
 * Get Dream State dashboard view model
 */
export declare function getDreamStateDashboardView(): DreamStateDashboardView;
//# sourceMappingURL=stateStatusAdapter.d.ts.map