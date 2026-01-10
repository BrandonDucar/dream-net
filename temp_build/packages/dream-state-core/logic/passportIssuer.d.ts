import { DreamPassport, DreamPassportTier } from "../types";
/**
 * Issue a passport to an IdentityGrid node
 */
export declare function issuePassport(identityId: string, tier: DreamPassportTier, flags?: string[]): DreamPassport;
/**
 * Get passport for an IdentityGrid node
 */
export declare function getPassport(identityId: string): DreamPassport | undefined;
/**
 * Upgrade passport tier
 */
export declare function upgradePassport(identityId: string, newTier: DreamPassportTier): DreamPassport | undefined;
