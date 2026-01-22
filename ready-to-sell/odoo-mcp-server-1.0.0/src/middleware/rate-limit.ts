import { Request, Response, NextFunction } from 'express';
import { checkRateLimit } from '../rate-limiter/index.js';
import { AuthenticatedRequest } from './auth.js';
import { logger } from '../logger/index.js';
import { getConfig } from '../config/index.js';

const config = getConfig();

/**
 * Middleware to enforce rate limiting
 */
export async function rateLimitMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!config.rateLimitEnabled) {
    next();
    return;
  }

  const apiKeyId = req.apiKeyId;
  if (!apiKeyId) {
    // If no API key, use IP address as identifier
    const identifier = req.ip || req.socket.remoteAddress || 'unknown';
    const result = await checkRateLimit('anonymous', identifier);
    
    if (!result.allowed) {
      res.status(429).json({
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
        resetTime: result.resetTime?.toISOString(),
      });
      return;
    }

    // Add rate limit headers
    res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
    if (result.resetTime) {
      res.setHeader('X-RateLimit-Reset', result.resetTime.toISOString());
    }

    next();
    return;
  }

  // Use API key ID as identifier
  const identifier = apiKeyId;
  const result = await checkRateLimit(apiKeyId, identifier);

  if (!result.allowed) {
    logger.warn(`Rate limit exceeded for API key: ${apiKeyId}`);
    res.status(429).json({
      error: 'Rate limit exceeded',
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
      resetTime: result.resetTime?.toISOString(),
    });
    return;
  }

  // Add rate limit headers
  res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
  if (result.resetTime) {
    res.setHeader('X-RateLimit-Reset', result.resetTime.toISOString());
  }

  next();
}
