import { Express } from 'express';
import jwt from 'jsonwebtoken';
import { verifyJWT, AuthRequest } from '../middleware/auth.js';
import { verifyStackAuth, verifyAnyAuth, StackAuthRequest } from '../middleware/stack-auth.js';

export function registerAuthRoutes(app: Express) {
  // Auth selftest endpoint (accepts both local JWT and Stack Auth tokens)
  app.get('/auth/selftest', verifyAnyAuth, (req: any, res) => {
    const user = req.user!;
    res.json({
      ok: true,
      userId: user.userId,
      email: user.email,
      roles: user.roles || [],
      provider: user.provider || 'unknown'
    });
  });
  
  // Stack Auth specific selftest endpoint
  app.get('/auth/stack-selftest', verifyStackAuth, (req: StackAuthRequest, res) => {
    const user = req.stackUser!;
    res.json({
      ok: true,
      sub: user.sub,
      email: user.email,
      roles: user.roles || [],
      provider: 'stack-auth'
    });
  });
  
  // Mock auth endpoint for testing (remove in production)
  app.post('/auth/token', (req, res) => {
    const { userId, roles } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }
    
    const token = jwt.sign(
      { userId, roles: roles || ['creator'] },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  });
}