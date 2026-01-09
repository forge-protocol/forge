import { Router, Request, Response } from 'express';
import { Connection, clusterApiUrl } from '@solana/web3.js';

const router = Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // Check Solana connection
    const connection = new Connection(clusterApiUrl('devnet'));
    const slot = await connection.getSlot();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        solana: {
          status: 'connected',
          slot: slot,
          cluster: 'devnet'
        }
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        solana: {
          status: 'disconnected',
          error: 'Failed to connect to Solana'
        }
      }
    });
  }
});

/**
 * GET /api/health/ready
 * Readiness check
 */
router.get('/ready', (req: Request, res: Response) => {
  res.json({
    status: 'ready',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/health/live
 * Liveness check
 */
router.get('/live', (req: Request, res: Response) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

export { router as healthRoutes };