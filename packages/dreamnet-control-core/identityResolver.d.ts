/**
 * Identity Resolver
 * Resolves caller identity and tier from API keys and wallet signatures
 *
 * Supports:
 * - x-dreamnet-api-key (internal/external keys)
 * - x-dreamnet-wallet-address + x-dreamnet-wallet-signature (EVM wallets)
 *
 * @module @dreamnet/dreamnet-control-core/identityResolver
 */
import type { Request, Response, NextFunction } from "express";
import { type TierConfig, type TierId } from "./tierConfig";
import type { DreamPassport, OfficeId, CabinetId } from "../dream-state-core/types";
export type IdentitySource = "apiKey" | "wallet" | "unknown";
export interface CallerIdentity {
    source: IdentitySource;
    tierId: TierId;
    tier: TierConfig;
    isGodVault: boolean;
    apiKeyId?: string;
    walletAddress?: string;
    /** DreamState passport (if citizen) */
    passport?: DreamPassport;
    /** Office IDs held by this citizen */
    officeIds?: OfficeId[];
    /** Cabinet IDs this citizen belongs to */
    cabinetIds?: CabinetId[];
}
export interface RequestWithIdentity extends Request {
    callerIdentity?: CallerIdentity;
    traceId?: string;
    /** DreamState passport (convenience mirror of callerIdentity.passport) */
    dreamPassport?: DreamPassport;
}
/**
 * Resolve a caller's identity and tier from:
 * - x-dreamnet-api-key (internal/external keys)
 * - x-dreamnet-wallet-address + x-dreamnet-wallet-signature (EVM wallets)
 *
 * Attach a CallerIdentity object to req.callerIdentity.
 * Defaults to SEED when unknown.
 */
export declare function identityAndTierResolver(req: RequestWithIdentity, _res: Response, next: NextFunction): Promise<void>;
