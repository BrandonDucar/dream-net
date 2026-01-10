import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface DatabaseFallbackState {
  isDatabaseError: boolean;
  isUsingFallback: boolean;
  errorMessage?: string;
  retryCount: number;
}

export function useDatabaseFallback() {
  const [fallbackState, setFallbackState] = useState<DatabaseFallbackState>({
    isDatabaseError: false,
    isUsingFallback: false,
    retryCount: 0
  });

  // Test database connectivity
  const { data: connectionTest, error, isError } = useQuery({
    queryKey: ['database-health'],
    queryFn: async () => {
      const response = await fetch('/api/garden-feed');
      if (!response.ok) {
        throw new Error(`Database error: ${response.status}`);
      }
      return response.json();
    },
    retry: 2,
    retryDelay: 1000,
    refetchInterval: 30000, // Check every 30 seconds
  });

  useEffect(() => {
    if (isError && error) {
      const errorMessage = error.message;
      const isDatabaseError = errorMessage.includes('endpoint has been disabled') ||
                             errorMessage.includes('database') ||
                             errorMessage.includes('DB');

      setFallbackState(prev => ({
        ...prev,
        isDatabaseError,
        isUsingFallback: isDatabaseError,
        errorMessage,
        retryCount: prev.retryCount + 1
      }));
    } else if (connectionTest) {
      setFallbackState(prev => ({
        ...prev,
        isDatabaseError: false,
        isUsingFallback: false,
        errorMessage: undefined
      }));
    }
  }, [isError, error, connectionTest]);

  const enableFallbackMode = () => {
    setFallbackState(prev => ({
      ...prev,
      isUsingFallback: true
    }));
  };

  const disableFallbackMode = () => {
    setFallbackState(prev => ({
      ...prev,
      isUsingFallback: false,
      retryCount: 0
    }));
  };

  return {
    ...fallbackState,
    enableFallbackMode,
    disableFallbackMode,
    hasConnection: !!connectionTest && !isError
  };
}