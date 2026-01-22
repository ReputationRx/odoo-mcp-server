import { Router, Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
  deleteApiKey,
  getApiKeyById,
} from '../auth/index.js';
import { z } from 'zod';

const router = Router();

const createApiKeySchema = z.object({
  name: z.string().min(1).max(255),
  userId: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  rateLimitPerMinute: z.number().int().positive().optional(),
});

/**
 * Create a new API key
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = createApiKeySchema.parse(req.body);
    const expiresAt = body.expiresAt ? new Date(body.expiresAt) : undefined;

    const apiKey = await createApiKey(
      body.name,
      body.userId,
      expiresAt,
      body.rateLimitPerMinute
    );

    res.status(201).json({
      success: true,
      data: {
        id: apiKey.id,
        name: apiKey.name,
        key: apiKey.key, // Only returned on creation
        createdAt: apiKey.createdAt,
        expiresAt: apiKey.expiresAt,
        rateLimitPerMinute: apiKey.rateLimitPerMinute,
      },
      message: 'API key created successfully. Store the key securely as it will not be shown again.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }
    res.status(500).json({
      error: 'Failed to create API key',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * List all API keys
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined;
    const apiKeys = listApiKeys(userId);

    // Don't expose key hashes
    const sanitized = apiKeys.map((key) => ({
      id: key.id,
      name: key.name,
      userId: key.userId,
      createdAt: key.createdAt,
      lastUsedAt: key.lastUsedAt,
      expiresAt: key.expiresAt,
      isActive: key.isActive,
      rateLimitPerMinute: key.rateLimitPerMinute,
    }));

    res.json({
      success: true,
      data: sanitized,
      count: sanitized.length,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to list API keys',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Get API key by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const apiKey = getApiKeyById(req.params.id);
    if (!apiKey) {
      res.status(404).json({
        error: 'API key not found',
      });
      return;
    }

    // Don't expose key hash
    res.json({
      success: true,
      data: {
        id: apiKey.id,
        name: apiKey.name,
        userId: apiKey.userId,
        createdAt: apiKey.createdAt,
        lastUsedAt: apiKey.lastUsedAt,
        expiresAt: apiKey.expiresAt,
        isActive: apiKey.isActive,
        rateLimitPerMinute: apiKey.rateLimitPerMinute,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get API key',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Revoke an API key
 */
router.post('/:id/revoke', (req: Request, res: Response) => {
  try {
    const success = revokeApiKey(req.params.id);
    if (!success) {
      res.status(404).json({
        error: 'API key not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'API key revoked successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to revoke API key',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Delete an API key
 */
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const success = deleteApiKey(req.params.id);
    if (!success) {
      res.status(404).json({
        error: 'API key not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'API key deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete API key',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
