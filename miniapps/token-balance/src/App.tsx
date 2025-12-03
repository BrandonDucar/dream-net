import React, { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { ethers } from 'ethers';
import './App.css';

// ERC20 ABI (minimal)
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

// DreamNet Token Addresses (Base Mainnet)
const SHEEP_TOKEN_ADDRESS = '0xDA7ec9832268606052003D7257B239C6bEDEfDf8';
const DREAM_TOKEN_ADDRESS = '0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77';

// Use SHEEP token by default, can be overridden via env var
const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS || SHEEP_TOKEN_ADDRESS;

function App() {
  const [isReady, setIsReady] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Base Mini App SDK
    const initSDK = async () => {
      try {
        // Call ready() to hide loading splash screen
        await sdk.actions.ready();
        setIsReady(true);
      } catch (err) {
        console.error('Failed to initialize SDK:', err);
        setIsReady(true); // Still show app even if SDK fails
      }
    };

    initSDK();
  }, []);

  useEffect(() => {
    // Connect to wallet when SDK is ready
    if (isReady && typeof window !== 'undefined' && window.ethereum) {
      const connectWallet = async () => {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });

          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(
              window.ethereum as ethers.Eip1193Provider
            );
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            setProvider(provider);
            setAddress(address);
          }
        } catch (err) {
          console.error('Failed to connect wallet:', err);
        }
      };

      connectWallet();
    }
  }, [isReady]);

  useEffect(() => {
    // Fetch token balance when wallet is connected
    if (provider && address && TOKEN_ADDRESS) {
      const fetchBalance = async () => {
        setLoading(true);
        setError(null);

        try {
          const contract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
          const [balance, decimals, tokenSymbol] = await Promise.all([
            contract.balanceOf(address),
            contract.decimals(),
            contract.symbol(),
          ]);

          const formatted = ethers.formatUnits(balance, decimals);
          setBalance(formatted);
          setSymbol(tokenSymbol);
        } catch (err: any) {
          console.error('Failed to fetch balance:', err);
          setError(err.message || 'Failed to fetch balance');
        } finally {
          setLoading(false);
        }
      };

      fetchBalance();
    }
  }, [provider, address]);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask or compatible wallet not found');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(
          window.ethereum as ethers.Eip1193Provider
        );
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setProvider(provider);
        setAddress(address);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>Token Balance</h1>
          <p className="subtitle">View your token balances on Base L2</p>
        </header>

        {!address ? (
          <div className="card">
            <p>Connect your wallet to view token balances</p>
            <button onClick={connectWallet} className="button">
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="card">
            <div className="wallet-info">
              <p className="label">Connected Wallet</p>
              <p className="address">{formatAddress(address)}</p>
            </div>

            {loading ? (
              <div className="loading">Loading balance...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : balance !== null ? (
              <div className="balance">
                <p className="label">Balance</p>
                <p className="amount">
                  {parseFloat(balance).toFixed(4)} {symbol}
                </p>
              </div>
            ) : (
              <div className="warning">No balance found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

