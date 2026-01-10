import { SiweMessage } from 'siwe';
import { BrowserProvider } from 'ethers';

export interface AuthResponse {
  token: string;
  walletAddress: string;
  isAdmin: boolean;
}

export class SiweAuth {
  private provider: BrowserProvider | null = null;

  async initProvider(): Promise<BrowserProvider> {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.provider = new BrowserProvider((window as any).ethereum);
      return this.provider;
    }
    throw new Error('No Ethereum provider found. Please install MetaMask or another wallet.');
  }

  async connectWallet(): Promise<string> {
    const provider = await this.initProvider();
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please connect your wallet.');
    }
    
    return accounts[0];
  }

  async getNonce(): Promise<string> {
    const response = await fetch('/api/auth/nonce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get nonce');
    }
    
    const { nonce } = await response.json();
    return nonce;
  }

  async createMessage(address: string, nonce: string): Promise<string> {
    const domain = window.location.host;
    const origin = window.location.origin;
    
    const message = new SiweMessage({
      domain,
      address,
      statement: 'Sign in to Dream Network Dashboard',
      uri: origin,
      version: '1',
      chainId: 1,
      nonce,
      issuedAt: new Date().toISOString(),
    });
    
    return message.prepareMessage();
  }

  async signMessage(message: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    
    const signer = await this.provider.getSigner();
    return await signer.signMessage(message);
  }

  async authenticate(address: string): Promise<AuthResponse> {
    try {
      // Get nonce
      const nonce = await this.getNonce();
      
      // Create SIWE message
      const message = await this.createMessage(address, nonce);
      
      // Sign message
      const signature = await this.signMessage(message);
      
      // Verify signature and get JWT
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Authentication failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('SIWE authentication error:', error);
      throw error;
    }
  }

  async signInWithEthereum(): Promise<AuthResponse> {
    try {
      // Connect wallet
      const address = await this.connectWallet();
      
      // Authenticate
      return await this.authenticate(address);
    } catch (error) {
      console.error('Sign in with Ethereum failed:', error);
      throw error;
    }
  }

  async validateToken(token: string): Promise<{ valid: boolean; walletAddress?: string; isAdmin?: boolean }> {
    try {
      const response = await fetch('/api/auth/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      if (!response.ok) {
        return { valid: false };
      }
      
      const data = await response.json();
      return { valid: true, walletAddress: data.walletAddress, isAdmin: data.isAdmin };
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  }
}

export const siweAuth = new SiweAuth();