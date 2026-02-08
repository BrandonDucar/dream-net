import { Request, Response, NextFunction } from 'express';

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header' });
    }

    // Basic stub: check if header exists
    // In production: verify JWT or EIP-4361 signature
    req.user = { id: 'mock-user-id', wallet: '0x123...abc' };
    next();
}
