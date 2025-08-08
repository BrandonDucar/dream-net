import type { Request, Response, NextFunction } from "express";

export const isAdminWallet = (walletAddress: string): boolean => {
  // Temporary override for testing - remove in production
  if (process.env.NODE_ENV === 'development' && process.env.ADMIN_OVERRIDE === 'true') {
    return true;
  }
  
  const adminWallets = process.env.ADMIN_WALLETS?.split(",") || [
    "0xAbCdEf1234567890abcdef1234567890aBcDeF01",
    "0x1234567890abcdef1234567890abcdef12345678",
    // Add test wallets for development
    "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  ];
  
  return adminWallets.map(wallet => wallet.trim().toLowerCase()).includes(walletAddress.toLowerCase());
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const walletAddress = req.headers['x-wallet-address'] as string;
  
  if (!walletAddress) {
    return res.status(401).json({ message: "Wallet address required" });
  }
  
  if (!isAdminWallet(walletAddress)) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  
  next();
};