import type { DreamOnchainAccount, DreamTokenEvent } from "./types";
export declare function getOnchainAccount(userId: string): Promise<DreamOnchainAccount>;
export declare function upsertOnchainAccount(account: DreamOnchainAccount): Promise<void>;
export declare function recordDreamTokenEvent(event: DreamTokenEvent): Promise<void>;
export declare function listDreamTokenEvents(filter?: {
    userId?: string;
    type?: string;
    limit?: number;
}): Promise<DreamTokenEvent[]>;
