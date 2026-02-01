import { DreamPassport, DreamPassportTier, GovernmentDepartment, DiplomaticRelation, StateSymbol, GovernmentAction, DreamProposal, DreamVote, DDAOAttractor, DreamStateStatus } from '../types.js';
export declare const CitizenshipStore: {
    issuePassport(identityId: string, tier: DreamPassportTier, flags?: string[]): DreamPassport;
    getPassport(identityId: string): DreamPassport | undefined;
    upgradePassport(identityId: string, newTier: DreamPassportTier): DreamPassport | undefined;
    listPassports(): DreamPassport[];
    createProposal(identityId: string, title: string, description: string, meta?: Record<string, any>): DreamProposal;
    getProposal(id: string): DreamProposal | undefined;
    listProposals(): DreamProposal[];
    listOpenProposals(): DreamProposal[];
    updateProposalStatus(id: string, status: DreamProposal["status"]): boolean;
    castVote(identityId: string, proposalId: string, choice: "for" | "against", passportTier: DreamPassportTier): DreamVote;
    getVote(proposalId: string, identityId: string): DreamVote | undefined;
    listVotesForProposal(proposalId: string): DreamVote[];
    tallyProposal(proposalId: string): {
        for: number;
        against: number;
    };
    addDDAOAttractor(attractor: DDAOAttractor): DDAOAttractor;
    getDDAOAttractor(id: string): DDAOAttractor | undefined;
    listDDAOAttractors(): DDAOAttractor[];
    updateDDAOAttractorScore(id: string, score: number): boolean;
    createDepartment(dept: GovernmentDepartment): GovernmentDepartment;
    getDepartment(id: string): GovernmentDepartment | undefined;
    listDepartments(): GovernmentDepartment[];
    establishRelation(relation: DiplomaticRelation): DiplomaticRelation;
    getRelation(id: string): DiplomaticRelation | undefined;
    listRelations(): DiplomaticRelation[];
    updateRelationStatus(id: string, status: DiplomaticRelation["status"]): boolean;
    adoptSymbol(symbol: StateSymbol): StateSymbol;
    getSymbol(id: string): StateSymbol | undefined;
    listSymbols(): StateSymbol[];
    recordAction(action: GovernmentAction): GovernmentAction;
    listRecentActions(limit?: number): GovernmentAction[];
    setLastRunAt(ts: number | null): void;
    status(): DreamStateStatus;
};
//# sourceMappingURL=citizenshipStore.d.ts.map