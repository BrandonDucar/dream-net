// @ts-ignore
export * from '@noble/hashes/utils.js';

export function ahash(h: any) {
    if (!h || (typeof h !== 'function' && typeof h.create !== 'function')) throw new Error('Hash instance expected');
    return h;
}
