import { DreamStateContext, DiplomaticRelation } from '../types.js';
/**
 * Establish diplomatic relations with another protocol/chain/DAO
 * Uses Wolf Pack to initiate outreach
 */
export declare function establishDiplomaticRelation(ctx: DreamStateContext, protocolName: string, protocolType: DiplomaticRelation["protocolType"], contactEmail?: string, notes?: string): DiplomaticRelation;
/**
 * Upgrade diplomatic status (neutral → embassy → treaty → alliance)
 */
export declare function upgradeDiplomaticStatus(relationId: string, newStatus: DiplomaticRelation["status"]): boolean;
/**
 * Initialize default diplomatic relations
 */
export declare function ensureDefaultDiplomaticRelations(ctx: DreamStateContext): DiplomaticRelation[];
//# sourceMappingURL=diplomacy.d.ts.map