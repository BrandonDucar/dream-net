import { SiweMessage } from 'siwe';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  walletAddress: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

export const isAdminWallet = (walletAddress: string): boolean => {
  const adminWallets = process.env.ADMIN_WALLETS?.split(",") || [
    "0xAbCdEf1234567890abcdef1234567890aBcDeF01",
    "0x1234567890abcdef1234567890abcdef12345678",
    "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  ];
  
  return adminWallets.map(wallet => wallet.trim().toLowerCase()).includes(walletAddress.toLowerCase());
};

export const generateNonce = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const createSiweMessage = (address: string, domain: string, uri: string, nonce: string): SiweMessage => {
  return new SiweMessage({
    domain,
    address,
    statement: 'Sign in to Dream Network Dashboard',
    uri,
    version: '1',
    chainId: 1, // Ethereum mainnet
    nonce,
    issuedAt: new Date().toISOString(),
  });
};

export const verifySignature = async (message: string, signature: string): Promise<{ success: boolean; address?: string; error?: string }> => {
  try {
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.verify({ signature });
    
    if (fields.success) {
      return { success: true, address: siweMessage.address };
    } else {
      return { success: false, error: 'Invalid signature' };
    }
  } catch (error) {
    console.error('SIWE verification error:', error);
    return { success: false, error: 'Signature verification failed' };
  }
};

export const generateJWT = (walletAddress: string): string => {
  const isAdmin = isAdminWallet(walletAddress);
  
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    walletAddress,
    isAdmin
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyJWT = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }
  
  const payload = verifyJWT(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  req.user = payload;
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
};

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}