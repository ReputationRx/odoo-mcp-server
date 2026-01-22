import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';
import { getConfig } from '../config/index.js';
import { getApiKeyById } from '../auth/index.js';
import { logger } from '../logger/index.js';

const config = getConfig();

// Create rate limiters for different API keys
const rateLimiters = new Map<string, RateLimiterMemory>();

/**
 * Get or create a rate limiter for an API key
 */
function getRateLimiter(apiKeyId: string, requestsPerMinute: number): RateLimiterMemory {
  if (!rateLimiters.has(apiKeyId)) {
    const limiter = new RateLimiterMemory({
      points: requestsPerMinute,
      duration: 60, // Per minute
    });
    rateLimiters.set(apiKeyId, limiter);
  }
  return rateLimiters.get(apiKeyId)!;
}

/**
 * Check rate limit for a request
 */
export async function checkRateLimit(
  apiKeyId: string,
  identifier: string
): Promise<{ allowed: boolean; remaining: number; resetTime?: Date }> {
  if (!config.rateLimitEnabled) {
    return { allowed: true, remaining: Infinity };
  }

  const apiKey = getApiKeyById(apiKeyId);
  if (!apiKey) {
    return { allowed: false, remaining: 0 };
  }

  const limiter = getRateLimiter(apiKeyId, apiKey.rateLimitPerMinute);

  try {
    const res = await limiter.consume(identifier);
    return {
      allowed: true,
      remaining: res.remainingPoints,
      resetTime: new Date(Date.now() + res.msBeforeNext),
    };
  } catch (rejRes) {
    const rateLimiterRes = rejRes as RateLimiterRes;
    logger.warn(`Rate limit exceeded for API key ${apiKeyId}: ${identifier}`);
    return {
      allowed: false,
      remaining: 0,
      resetTime: new Date(Date.now() + rateLimiterRes.msBeforeNext),
    };
  }
}

/**
 * Reset rate limit for an API key (for testing/admin purposes)
 */
export function resetRateLimit(apiKeyId: string): void {
  rateLimiters.delete(apiKeyId);
  logger.info(`Rate limit reset for API key: ${apiKeyId}`);
}

/**
 * Get rate limit status for an API key
 */
export async function getRateLimitStatus(
  apiKeyId: string,
  identifier: string
): Promise<{ remaining: number; resetTime?: Date }> {
  if (!config.rateLimitEnabled) {
    return { remaining: Infinity };
  }

  const apiKey = getApiKeyById(apiKeyId);
  if (!apiKey) {
    return { remaining: 0 };
  }

  const limiter = getRateLimiter(apiKeyId, apiKey.rateLimitPerMinute);
  const res = await limiter.get(identifier);

  if (res === null) {
    return { remaining: apiKey.rateLimitPerMinute };
  }

  return {
    remaining: res.remainingPoints,
    resetTime: new Date(Date.now() + res.msBeforeNext),
  };
}
