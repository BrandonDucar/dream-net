import { APIProvider, APICategory } from "../types";
/**
 * Discover and register known API providers
 * In production, this could scrape API directories, read configs, etc.
 */
export declare function discoverAPIs(): APIProvider[];
/**
 * Search for providers by category or feature
 */
export declare function searchProviders(category?: APICategory, feature?: string): APIProvider[];
