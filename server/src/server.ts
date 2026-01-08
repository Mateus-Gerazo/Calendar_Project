import app from './app';
import { initializeDatabase } from './config/db';
import pool from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;
const MAX_RETRIES = 10;
const RETRY_DELAY = 3000; // 3 seconds

// Wait for database to be ready
const waitForDatabase = async (retries = 0): Promise<void> => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connection ready');
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.log(`⏳ Waiting for database... (${retries + 1}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return waitForDatabase(retries + 1);
    }
    throw new Error('Database connection failed after maximum retries');
  }
};

const startServer = async (): Promise<void> => {
  try {
    // Wait for database to be ready
    await waitForDatabase();

    // Initialize database tables
    await initializeDatabase();

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
