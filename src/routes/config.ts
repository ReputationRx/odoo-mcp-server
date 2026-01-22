import { Router, Request, Response } from 'express';
import { getConfig } from '../config/index.js';

const router = Router();

/**
 * Get server configuration (public settings only)
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const config = getConfig();

    // Only return public configuration
    res.json({
      success: true,
      data: {
        mcpAccessEnabled: config.mcpAccessEnabled,
        requireApiKeys: config.requireApiKeys,
        rateLimitEnabled: config.rateLimitEnabled,
        rateLimitRequestsPerMinute: config.rateLimitRequestsPerMinute,
        rateLimitTimeoutSeconds: config.rateLimitTimeoutSeconds,
        logEnabled: config.logEnabled,
        logRetentionDays: config.logRetentionDays,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get configuration',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
