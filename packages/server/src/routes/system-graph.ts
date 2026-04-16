/**
 * System Graph API Route
 * 
 * Provides read-only access to DreamNet internal system topology:
 * ports, routes, and wormholes.
 */

import { Router, type Request, type Response } from 'express';
import { getSystemSnapshot } from '../system/graph';
import { getRequestLogger } from '../utils/logger';

const router = Router();

/**
 * GET /api/system/graph
 * 
 * Returns a complete snapshot of the DreamNet internal system topology.
 * Includes ports, routes, and wormholes with their current state.
 * 
 * No authentication required (for now).
 * Read-only endpoint.
 */
router.get('/graph', async (req: Request, res: Response) => {
  const log = getRequestLogger(req);
  
  try {
    log.info('Fetching system graph snapshot');
    
    const snapshot = await getSystemSnapshot();
    
    res.json({
      ports: snapshot.ports,
      routes: snapshot.routes,
      wormholes: snapshot.wormholes
    });
  } catch (error) {
    log.error('Failed to build system graph', error instanceof Error ? error : new Error(String(error)), {
      route: '/api/system/graph',
      method: 'GET'
    });
    
    res.status(500).json({
      message: 'Failed to build system graph'
    });
  }
});

export default router;

