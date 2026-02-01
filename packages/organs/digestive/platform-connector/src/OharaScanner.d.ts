export interface DiscoveredApp {
    uuid: string;
    url: string;
    name?: string;
    foundInCast: string;
}
export declare class OharaScanner {
    scan(): Promise<DiscoveredApp[]>;
}
//# sourceMappingURL=OharaScanner.d.ts.map