import { Request, Response, NextFunction } from 'express';
import { findApiKeyByKey } from '../auth/index.js';
import { getConfig } from '../config/index.js';
import { logger } from '../logger/index.js';

const config = getConfig();

export interface AuthenticatedRequest extends Request {
  apiKeyId?: string;
  userId?: string;
}

/**
 * Middleware to authenticate requests using API keys
 */
export async function authenticateApiKey(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Check if MCP access is enabled
  if (!config.mcpAccessEnabled) {
    res.status(503).json({
      error: 'MCP access is currently disabled',
      code: 'MCP_DISABLED',
    });
    return;
  }

  // Check if API keys are required
  if (!config.requireApiKeys) {
    next();
    return;
  }

  // Extract API key from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'API key required',
      code: 'API_KEY_REQUIRED',
      message: 'Please provide an API key in the Authorization header: Bearer <api_key>',
    });
    return;
  }

  const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const apiKeyRecord = await findApiKeyByKey(apiKey);
    if (!apiKeyRecord) {
      res.status(401).json({
        error: 'Invalid API key',
        code: 'INVALID_API_KEY',
      });
      return;
    }

    // Attach API key info to request
    req.apiKeyId = apiKeyRecord.id;
    req.userId = apiKeyRecord.userId;

    next();
  } catch (error) {
    logger.error('Authentication error', { error });
    res.status(500).json({
      error: 'Authentication failed',
      code: 'AUTH_ERROR',
    });
  }
}
