import React, { createContext, useContext, useState, useEffect } from 'react';
import { siweAuth, type AuthResponse } from '@/lib/siwe';

interface AuthContextType {
  walletAddress: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  token: string | null;
  login: (walletAddress: string) => Promise<boolean>;
  signInWithEthereum: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Development mode override for easier testing
  const DEV_MODE = import.meta.env.DEV && import.meta.env.VITE_DEV_AUTH === 'true';

  useEffect(() => {
    // Development mode override
    if (DEV_MODE) {
      const devWallet = '0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e'; // Demo admin wallet
      setWalletAddress(devWallet);
      setIsAdmin(true);
      setToken('dev-token');
      setIsLoading(false);
      localStorage.setItem('dev_wallet', devWallet);
      return;
    }

    // Check if user has a valid JWT token
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      validateToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (authToken: string) => {
    try {
      setIsLoading(true);
      const validation = await siweAuth.validateToken(authToken);
      
      if (validation.valid && validation.walletAddress) {
        setWalletAddress(validation.walletAddress);
        setIsAdmin(validation.isAdmin || false);
        setToken(authToken);
        localStorage.setItem('auth_token', authToken);
        return true;
      } else {
        // Invalid token
        clearAuth();
        return false;
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      clearAuth();
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('wallet_address'); // Legacy cleanup
    setWalletAddress(null);
    setIsAdmin(false);
    setToken(null);
  };

  const validateWallet = async (address: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        body: JSON.stringify({ walletAddress: address }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.isAdmin) {
        setWalletAddress(address);
        setIsAdmin(true);
        return true;
      } else {
        setWalletAddress(null);
        setIsAdmin(false);
        return false;
      }
    } catch (error) {
      console.error('Wallet validation failed:', error);
      setWalletAddress(null);
      setIsAdmin(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (address: string): Promise<boolean> => {
    return await validateWallet(address);
  };

  const signInWithEthereum = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Development mode shortcut
      if (DEV_MODE) {
        const devWallet = '0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e';
        setWalletAddress(devWallet);
        setIsAdmin(true);
        setToken('dev-token');
        localStorage.setItem('dev_wallet', devWallet);
        return true;
      }

      const authData: AuthResponse = await siweAuth.signInWithEthereum();
      
      setWalletAddress(authData.walletAddress);
      setIsAdmin(authData.isAdmin);
      setToken(authData.token);
      localStorage.setItem('auth_token', authData.token);
      
      return true;
    } catch (error) {
      console.error('SIWE login failed:', error);
      clearAuth();
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
  };

  const value: AuthContextType = {
    walletAddress,
    isAdmin,
    isLoading,
    token,
    login,
    signInWithEthereum,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};