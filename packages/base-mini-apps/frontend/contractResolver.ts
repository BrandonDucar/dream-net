/**
 * Contract Resolver Helper
 * Maps mini-app IDs to their contract addresses
 */

import { MINI_APPS } from './index';
import { CONTRACT_ADDRESSES } from './config';

/**
 * Get the contract address for a mini-app by its ID
 * @param appId The mini-app ID (e.g., 'passport-mint', 'dream-vault')
 * @returns The contract address if the app has one, undefined otherwise
 */
export function getContractAddress(appId: string): string | undefined {
  const app = MINI_APPS[appId as keyof typeof MINI_APPS];
  if (!app) {
    return undefined;
  }
  return app.contractAddress;
}

/**
 * Get the contract name for a mini-app by its ID
 * @param appId The mini-app ID
 * @returns The contract name if the app has one, undefined otherwise
 */
export function getContractName(appId: string): string | undefined {
  const app = MINI_APPS[appId as keyof typeof MINI_APPS];
  if (!app) {
    return undefined;
  }
  return (app as any).contractName;
}

/**
 * Get contract address by contract name (from CONTRACT_ADDRESSES)
 * @param contractName The contract name (e.g., 'DreamPassport', 'DreamVault')
 * @returns The contract address if found, undefined otherwise
 */
export function getContractAddressByName(contractName: string): string | undefined {
  return (CONTRACT_ADDRESSES as any)[contractName];
}

/**
 * Check if a mini-app has a contract
 * @param appId The mini-app ID
 * @returns true if the app has a contract address, false otherwise
 */
export function hasContract(appId: string): boolean {
  return getContractAddress(appId) !== undefined;
}

/**
 * Get all apps that use a specific contract
 * @param contractAddress The contract address to search for
 * @returns Array of app IDs that use this contract
 */
export function getAppsByContractAddress(contractAddress: string): string[] {
  const apps: string[] = [];
  for (const [appId, app] of Object.entries(MINI_APPS)) {
    if (app.contractAddress === contractAddress) {
      apps.push(appId);
    }
  }
  return apps;
}

/**
 * Get all apps that use a specific contract by name
 * @param contractName The contract name (e.g., 'GameRegistry')
 * @returns Array of app IDs that use this contract
 */
export function getAppsByContractName(contractName: string): string[] {
  const contractAddress = getContractAddressByName(contractName);
  if (!contractAddress) {
    return [];
  }
  return getAppsByContractAddress(contractAddress);
}

/**
 * Get all apps with contracts
 * @returns Array of app IDs that have contracts
 */
export function getAppsWithContracts(): string[] {
  const apps: string[] = [];
  for (const [appId, app] of Object.entries(MINI_APPS)) {
    if (app.contractAddress) {
      apps.push(appId);
    }
  }
  return apps;
}

/**
 * Get all apps without contracts (frontend-only)
 * @returns Array of app IDs that don't have contracts
 */
export function getAppsWithoutContracts(): string[] {
  const apps: string[] = [];
  for (const [appId, app] of Object.entries(MINI_APPS)) {
    if (!app.contractAddress) {
      apps.push(appId);
    }
  }
  return apps;
}

