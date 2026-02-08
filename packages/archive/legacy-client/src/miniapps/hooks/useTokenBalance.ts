/**
 * Hook to fetch ERC20 token balance
 */

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getTokenBalance, TokenBalance } from '@dreamnet/utils';

export function useTokenBalance(
  provider: ethers.BrowserProvider | null,
  tokenAddress: string | null,
  userAddress: string | null
) {
  const [balance, setBalance] = useState<TokenBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!provider || !tokenAddress || !userAddress) {
      setBalance(null);
      return;
    }

    setLoading(true);
    setError(null);

    getTokenBalance(provider, tokenAddress, userAddress)
      .then(setBalance)
      .catch((err) => {
        console.error('Error fetching token balance:', err);
        setError(err.message || 'Failed to fetch balance');
      })
      .finally(() => setLoading(false));
  }, [provider, tokenAddress, userAddress]);

  return { balance, loading, error };
}

