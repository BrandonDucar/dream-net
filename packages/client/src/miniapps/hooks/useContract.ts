/**
 * Hook to interact with smart contracts
 */

import { useState, useMemo } from 'react';
import { ethers } from 'ethers';
import { useBase } from '@/providers/BaseProvider';

export function useContract(address: string | null, abi: ethers.InterfaceAbi) {
  const { provider, signer, isConnected } = useBase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contract = useMemo(() => {
    if (!address || !provider) return null;
    
    try {
      // Use signer if available (for write operations), otherwise provider (read-only)
      const contractProvider = signer || provider;
      return new ethers.Contract(address, abi, contractProvider);
    } catch (err) {
      console.error('Error creating contract:', err);
      return null;
    }
  }, [address, abi, provider, signer]);

  const read = async (method: string, ...args: any[]) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await contract[method](...args);
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Contract read failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const write = async (method: string, ...args: any[]) => {
    if (!contract || !signer) {
      throw new Error('Contract not initialized or wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await contract[method](...args);
      const receipt = await tx.wait();
      return receipt;
    } catch (err: any) {
      const errorMsg = err.message || 'Contract write failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    contract,
    read,
    write,
    loading,
    error,
    isConnected,
  };
}

