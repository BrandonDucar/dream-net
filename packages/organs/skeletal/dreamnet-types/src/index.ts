export type Brand<K, T> = K & { __brand: T };

export type TierId = 'FREE_TIER' | 'VERCEL_PRO' | 'GOD_MODE' | 'OPERATOR' | 'SEED' | 'BUILDER';
export type OfficeId = string; // Placeholder for now
export type CabinetId = string; // Placeholder for now
export type PortId = string;
export type ClusterId = string;


export type CitizenId = string;

export interface DreamPassport {
    citizenId: CitizenId;
    tierId: TierId;
    officeIds: OfficeId[];
    cabinetIds: CabinetId[];
}

export interface CallerIdentity {
    source: 'apiKey' | 'wallet' | 'unknown';
    tierId: TierId;
    tier?: any;
    isGodVault: boolean;
    apiKeyId?: string;
    walletAddress?: string;
    passport?: DreamPassport;
    officeIds?: OfficeId[];
    cabinetIds?: CabinetId[];
}
