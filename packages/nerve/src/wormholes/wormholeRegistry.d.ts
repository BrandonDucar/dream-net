import type { WormholeModel } from './types.js';
export declare function listWormholes(): WormholeModel[];
export declare function getWormholeById(id: string): WormholeModel | null;
export declare function createWormhole(data: Partial<WormholeModel> & {
    name: string;
    from: WormholeModel["from"];
    to: WormholeModel["to"];
}): WormholeModel;
export declare function updateWormhole(id: string, patch: Partial<WormholeModel>): WormholeModel | null;
export declare function deleteWormhole(id: string): boolean;
//# sourceMappingURL=wormholeRegistry.d.ts.map