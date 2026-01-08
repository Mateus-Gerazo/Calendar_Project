import { Router, Request, Response } from 'express';
import pool from '../config/db';

const router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    // Test database connection
    await pool.query('SELECT 1');
    
    res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Server is running but database connection failed',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
