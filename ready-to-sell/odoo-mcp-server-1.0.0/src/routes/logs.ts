import { Router, Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../database/index.js';
import { z } from 'zod';

const router = Router();

const querySchema = z.object({
  limit: z.coerce.number().int().positive().max(1000).optional().default(100),
  offset: z.coerce.number().int().nonnegative().optional().default(0),
  apiKeyId: z.string().optional(),
  userId: z.string().optional(),
  method: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

/**
 * Get request logs
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const query = querySchema.parse(req.query);

    let sql = 'SELECT * FROM request_logs WHERE 1=1';
    const params: unknown[] = [];

    if (query.apiKeyId) {
      sql += ' AND api_key_id = ?';
      params.push(query.apiKeyId);
    }

    if (query.userId) {
      sql += ' AND user_id = ?';
      params.push(query.userId);
    }

    if (query.method) {
      sql += ' AND method LIKE ?';
      params.push(`%${query.method}%`);
    }

    if (query.startDate) {
      sql += ' AND timestamp >= ?';
      params.push(query.startDate);
    }

    if (query.endDate) {
      sql += ' AND timestamp <= ?';
      params.push(query.endDate);
    }

    sql += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
    params.push(query.limit, query.offset);

    const stmt = db.prepare(sql);
    const logs = stmt.all(...params) as Array<{
      id: string;
      request_id: string;
      method: string;
      user_id: string | null;
      api_key_id: string | null;
      ip: string | null;
      user_agent: string | null;
      request_body: string | null;
      response_status: number | null;
      response_time: number | null;
      error: string | null;
      timestamp: string;
    }>;

    // Get total count
    let countSql = 'SELECT COUNT(*) as count FROM request_logs WHERE 1=1';
    const countParams: unknown[] = [];

    if (query.apiKeyId) {
      countSql += ' AND api_key_id = ?';
      countParams.push(query.apiKeyId);
    }

    if (query.userId) {
      countSql += ' AND user_id = ?';
      countParams.push(query.userId);
    }

    if (query.method) {
      countSql += ' AND method LIKE ?';
      countParams.push(`%${query.method}%`);
    }

    if (query.startDate) {
      countSql += ' AND timestamp >= ?';
      countParams.push(query.startDate);
    }

    if (query.endDate) {
      countSql += ' AND timestamp <= ?';
      countParams.push(query.endDate);
    }

    const countStmt = db.prepare(countSql);
    const countResult = countStmt.get(...countParams) as { count: number };

    res.json({
      success: true,
      data: logs.map((log) => ({
        id: log.id,
        requestId: log.request_id,
        method: log.method,
        userId: log.user_id,
        apiKeyId: log.api_key_id,
        ip: log.ip,
        userAgent: log.user_agent,
        requestBody: log.request_body ? JSON.parse(log.request_body) : null,
        responseStatus: log.response_status,
        responseTime: log.response_time,
        error: log.error,
        timestamp: log.timestamp,
      })),
      pagination: {
        limit: query.limit,
        offset: query.offset,
        total: countResult.count,
      },
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
      error: 'Failed to get logs',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Get log statistics
 */
router.get('/stats', (req: Request, res: Response) => {
  try {
    // Total requests
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM request_logs');
    const total = (totalStmt.get() as { count: number }).count;

    // Requests by status
    const statusStmt = db.prepare(`
      SELECT 
        CASE 
          WHEN response_status >= 200 AND response_status < 300 THEN 'success'
          WHEN response_status >= 400 AND response_status < 500 THEN 'client_error'
          WHEN response_status >= 500 THEN 'server_error'
          ELSE 'unknown'
        END as status,
        COUNT(*) as count
      FROM request_logs
      WHERE response_status IS NOT NULL
      GROUP BY status
    `);
    const statusStats = statusStmt.all() as Array<{ status: string; count: number }>;

    // Average response time
    const avgTimeStmt = db.prepare(`
      SELECT AVG(response_time) as avg_time
      FROM request_logs
      WHERE response_time IS NOT NULL
    `);
    const avgTime = (avgTimeStmt.get() as { avg_time: number | null })?.avg_time || 0;

    // Requests in last 24 hours
    const last24hStmt = db.prepare(`
      SELECT COUNT(*) as count
      FROM request_logs
      WHERE timestamp >= datetime('now', '-1 day')
    `);
    const last24h = (last24hStmt.get() as { count: number }).count;

    res.json({
      success: true,
      data: {
        total,
        last24h,
        averageResponseTime: Math.round(avgTime),
        byStatus: statusStats.reduce((acc, stat) => {
          acc[stat.status] = stat.count;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get log statistics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
