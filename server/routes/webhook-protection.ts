import { Router } from 'express';
import { idempotencyMiddleware, checkIdempotency } from '../middleware/idempotency';

const router: Router = Router();

// Universal webhook protection wrapper
// Applies idempotency protection to any webhook endpoint
export const protectWebhook: (path: string, handler: (req: any, res: any, next?: any) => Promise<void> | void) => any = (
  path: string,
  handler: (req: any, res: any, next?: any) => Promise<void> | void
) => {
  return router.post(path, idempotencyMiddleware, async (req, res, next) => {
    try {
      // Log the protected request
      const idemKey = req.headers['x-idempotency-key'] as string;
      console.log(`🔄 [WebhookProtection] Protected request to ${path} with key: ${idemKey || 'none'}`);
      
      // Call the original handler
      await handler(req, res, next);
      
    } catch (error: any) {
      console.error(`🔄 [WebhookProtection] Error in protected handler for ${path}:`, error);
      res.status(500).json({
        success: false,
        error: 'Internal server error in protected webhook',
        protected: true
      });
    }
  });
};

// Manual idempotency check for custom use cases
export const manualIdempotencyCheck = async (req: any, res: any): Promise<boolean> => {
  const idemKey = req.headers['x-idempotency-key'] as string;
  
  if (!idemKey) {
    return false; // No protection requested
  }
  
  const isReplay = await checkIdempotency(idemKey);
  
  if (isReplay) {
    res.status(409).json({
      ok: false,
      error: 'replay_or_duplicate',
      message: 'Request already processed within TTL window',
      ttl_seconds: 600 // 10 minutes
    });
    return true; // Request was blocked
  }
  
  return false; // Request should proceed
};

export default router;