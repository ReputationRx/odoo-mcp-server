import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { getConfig } from './config/index.js';
import { logger } from './logger/index.js';
import { initializeDatabase, closeDatabase } from './database/index.js';
import { authenticateApiKey } from './middleware/auth.js';
import { rateLimitMiddleware } from './middleware/rate-limit.js';
import { requestLoggerMiddleware } from './middleware/request-logger.js';
import { timeoutMiddleware } from './middleware/timeout.js';
import apiKeysRouter from './routes/api-keys.js';
import modelsRouter from './routes/models.js';
import logsRouter from './routes/logs.js';
import configRouter from './routes/config.js';

/**
 * Create and configure the Express API server
 */
export function createApiServer(): Express {
  const app = express();
  const config = getConfig();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use(requestLoggerMiddleware);

  // Timeout middleware
  app.use(timeoutMiddleware);

  // Health check endpoint (no auth required)
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // API routes
  app.use('/api/config', configRouter);
  app.use('/api/api-keys', apiKeysRouter);
  app.use('/api/models', authenticateApiKey, rateLimitMiddleware, modelsRouter);
  app.use('/api/logs', authenticateApiKey, logsRouter);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not found',
      path: req.path,
    });
  });

  // Error handler
  app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
    logger.error('Unhandled error', { error: err, path: req.path });
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
    });
  });

  return app;
}

/**
 * Start the API server
 */
export async function startApiServer(): Promise<void> {
  const config = getConfig();

  // Initialize database
  initializeDatabase();

  // Create and start server
  const app = createApiServer();
  const server = app.listen(config.mcpServerPort, config.mcpServerHost, () => {
    logger.info(`API server started on http://${config.mcpServerHost}:${config.mcpServerPort}`);
    logger.info(`Health check: http://${config.mcpServerHost}:${config.mcpServerPort}/health`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
      logger.info('HTTP server closed');
      closeDatabase();
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
      logger.info('HTTP server closed');
      closeDatabase();
      process.exit(0);
    });
  });
}
