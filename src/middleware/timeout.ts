import { Request, Response, NextFunction } from 'express';
import { getConfig } from '../config/index.js';

const config = getConfig();

/**
 * Middleware to enforce request timeout
 */
export function timeoutMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const timeout = config.rateLimitTimeoutSeconds * 1000; // Convert to milliseconds

  // Set timeout
  const timer = setTimeout(() => {
    if (!res.headersSent) {
      res.status(408).json({
        error: 'Request timeout',
        code: 'REQUEST_TIMEOUT',
        message: `Request exceeded the timeout of ${config.rateLimitTimeoutSeconds} seconds`,
      });
    }
  }, timeout);

  // Clear timeout when response is sent
  res.on('finish', () => {
    clearTimeout(timer);
  });

  res.on('close', () => {
    clearTimeout(timer);
  });

  next();
}
