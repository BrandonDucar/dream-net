/**
 * DreamState Registry
 * Bootstrap governance state with founder, offices, and cabinets
 *
 * @module @dreamnet/dreamstate/registry
 */
import type { DreamStateSnapshot, DreamPassport, Office, Cabinet, CitizenId } from "./types";
/**
 * Exported DreamState snapshot
 */
export declare const DREAMSTATE: DreamStateSnapshot;
/**
 * Get passport by wallet address
 *
 * @param wallet - Wallet address (will be normalized to lowercase)
 * @returns Passport if found, undefined otherwise
 */
export declare function getPassportByWallet(wallet: string): DreamPassport | undefined;
/**
 * Get passport by citizen ID
 *
 * @param citizenId - Citizen identifier
 * @returns Passport if found, undefined otherwise
 */
export declare function getPassportByCitizenId(citizenId: CitizenId): DreamPassport | undefined;
/**
 * Get offices for a citizen
 *
 * @param citizenId - Citizen identifier
 * @returns Array of offices held by the citizen
 */
export declare function getOfficesForCitizen(citizenId: CitizenId): Office[];
/**
 * Get cabinets for a citizen
 *
 * @param citizenId - Citizen identifier
 * @returns Array of cabinets the citizen belongs to
 */
export declare function getCabinetsForCitizen(citizenId: CitizenId): Cabinet[];
