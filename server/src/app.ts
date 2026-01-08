import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import corsOptions from './config/corsOptions';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import healthRoutes from './routes/healthRoutes';

const app: Application = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
