import React, { useEffect, useState } from 'react';
import { ConnectWallet, Wallet, WalletDropdown } from '@coinbase/onchainkit/wallet';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { getEnvironment } from './utils/environment';
import './App.css';

// ERC20 ABI (minimal)
const ERC20_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// DreamNet Token Addresses (Base Mainnet)
const SHEEP_TOKEN_ADDRESS = '0xDA7ec9832268606052003D7257B239C6bEDEfDf8' as `0x${string}`;
const DREAM_TOKEN_ADDRESS = '0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77' as `0x${string}`;

// Use SHEEP token by default, can be overridden via env var
const TOKEN_ADDRESS = (import.meta.env.VITE_TOKEN_ADDRESS || SHEEP_TOKEN_ADDRESS) as `0x${string}`;

function App() {
  const { address, isConnected } = useAccount();
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const env = getEnvironment();

  // Read token balance
  const { data: balance, isLoading: balanceLoading } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read token decimals
  const { data: decimals } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  // Read token symbol
  const { data: symbol } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'symbol',
  });

  useEffect(() => {
    if (symbol) {
      setTokenSymbol(symbol);
    }
  }, [symbol]);

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = () => {
    if (!balance || !decimals) return '0.0000';
    const formatted = formatUnits(balance, decimals);
    return parseFloat(formatted).toFixed(4);
  };

  return (
    <div className="app" data-environment={env.environment}>
      <div className="container">
        <header>
          <h1>Token Balance</h1>
          <p className="subtitle">
            {env.isBaseApp 
              ? 'View your token balances on Base L2' 
              : 'View your token balances on Base L2 - Works in Base App too!'}
          </p>
          {env.isBaseApp && (
            <div className="badge">Running in Base App</div>
          )}
        </header>

        <div className="wallet-section">
          <Wallet>
            <ConnectWallet />
            <WalletDropdown />
          </Wallet>
        </div>

        {!isConnected ? (
          <div className="card">
            <p>Connect your wallet to view token balances</p>
          </div>
        ) : (
          <div className="card">
            <div className="wallet-info">
              <p className="label">Connected Wallet</p>
              <p className="address">{formatAddress(address)}</p>
            </div>

            {balanceLoading ? (
              <div className="loading">Loading balance...</div>
            ) : balance !== undefined && decimals !== undefined ? (
              <div className="balance">
                <p className="label">Balance</p>
                <p className="amount">
                  {formatBalance()} {tokenSymbol}
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
