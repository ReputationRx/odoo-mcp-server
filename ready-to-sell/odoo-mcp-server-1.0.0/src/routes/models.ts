import { Router, Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getOdooClient } from '../odoo/client.js';
import { db } from '../database/index.js';
import { logger } from '../logger/index.js';

const router = Router();

/**
 * Get all available Odoo models
 */
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const client = getOdooClient();
    const models = await client.getAvailableModels();

    // Also get from database (for managed models)
    const stmt = db.prepare('SELECT * FROM available_models WHERE is_enabled = 1');
    const managedModels = stmt.all() as Array<{
      id: string;
      model_name: string;
      display_name: string;
      description: string | null;
      is_enabled: number;
    }>;

    // Merge Odoo models with managed models
    const modelMap = new Map(models.map((m) => [m.model, m]));
    managedModels.forEach((m) => {
      if (!modelMap.has(m.model_name)) {
        modelMap.set(m.model_name, {
          model: m.model_name,
          name: m.display_name,
        });
      }
    });

    res.json({
      success: true,
      data: Array.from(modelMap.values()),
      count: modelMap.size,
    });
  } catch (error) {
    logger.error('Failed to get available models', { error });
    res.status(500).json({
      error: 'Failed to get available models',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Get model fields
 */
router.get('/:model/fields', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { model } = req.params;
    const client = getOdooClient();
    const fields = await client.getModelFields(model);

    res.json({
      success: true,
      data: fields,
    });
  } catch (error) {
    logger.error(`Failed to get fields for model ${req.params.model}`, { error });
    res.status(500).json({
      error: 'Failed to get model fields',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Search records in a model
 */
router.post('/:model/search', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { model } = req.params;
    const { domain, fields, limit, offset, order } = req.body;

    const client = getOdooClient();
    const records = await client.searchRead(model, {
      domain: domain || [],
      fields,
      limit,
      offset,
      order,
    });

    res.json({
      success: true,
      data: records,
      count: records.length,
    });
  } catch (error) {
    logger.error(`Failed to search records in model ${req.params.model}`, { error });
    res.status(500).json({
      error: 'Failed to search records',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Create a record
 */
router.post('/:model/create', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { model } = req.params;
    const values = req.body;

    const client = getOdooClient();
    const id = await client.create(model, values);

    res.status(201).json({
      success: true,
      data: { id },
    });
  } catch (error) {
    logger.error(`Failed to create record in model ${req.params.model}`, { error });
    res.status(500).json({
      error: 'Failed to create record',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Update records
 */
router.put('/:model/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { model, id } = req.params;
    const values = req.body;

    const client = getOdooClient();
    const success = await client.write(model, [parseInt(id)], values);

    res.json({
      success,
      message: success ? 'Record updated successfully' : 'Failed to update record',
    });
  } catch (error) {
    logger.error(`Failed to update record in model ${req.params.model}`, { error });
    res.status(500).json({
      error: 'Failed to update record',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Delete records
 */
router.delete('/:model/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { model, id } = req.params;

    const client = getOdooClient();
    const success = await client.delete(model, [parseInt(id)]);

    res.json({
      success,
      message: success ? 'Record deleted successfully' : 'Failed to delete record',
    });
  } catch (error) {
    logger.error(`Failed to delete record in model ${req.params.model}`, { error });
    res.status(500).json({
      error: 'Failed to delete record',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
