import { useBase } from '../../../client/src/providers/BaseProvider.js';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../config.js';

/**
 * Hook to get contract instance using ethers.js
 * Works with BaseProvider from client app
 */
export function useContract(contractAddress: string, abi: any[]) {
  const { signer, isConnected } = useBase();

  const getContract = () => {
    if (!signer || !isConnected) {
      throw new Error('Wallet not connected');
    }
    return new ethers.Contract(contractAddress, abi, signer);
  };

  return {
    contract: signer && isConnected ? getContract() : null,
    isConnected,
    signer,
  };
}

/**
 * Helper to create contract ABI from function signatures
 */
export function createABI(functions: Array<{
  name: string;
  type: 'function';
  stateMutability: 'nonpayable' | 'payable' | 'view';
  inputs: Array<{ name: string; type: string }>;
  outputs?: Array<{ name: string; type: string }>;
}>) {
  return functions;
}

