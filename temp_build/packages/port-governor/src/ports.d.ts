/**
 * Port Definitions
 * Charged ports for Env Keeper, API Keeper, and Vercel Agent
 */
import type { PortProfile } from "./types";
export declare const PORT_PROFILES: Record<string, PortProfile>;
export declare function getPortProfile(portId: string): PortProfile | undefined;
