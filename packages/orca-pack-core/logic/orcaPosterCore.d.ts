import { OrcaPackContext, OrcaChannel } from '../types.js';
export interface OrcaOutputAdapter {
    post(channel: OrcaChannel, content: string, meta?: any): Promise<string | undefined>;
}
export declare function setOrcaOutputAdapter(adapter: OrcaOutputAdapter): void;
export declare function simulateOrcaPosting(ctx: OrcaPackContext): Promise<void>;
//# sourceMappingURL=orcaPosterCore.d.ts.map