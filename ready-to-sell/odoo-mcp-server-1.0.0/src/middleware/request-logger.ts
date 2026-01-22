import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import { AuthenticatedRequest } from './auth.js';
import { logRequest, RequestLog } from '../logger/index.js';
import { db } from '../database/index.js';
import { getConfig } from '../config/index.js';

const config = getConfig();

/**
 * Middleware to log all requests
 */
export function requestLoggerMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!config.logEnabled) {
    next();
    return;
  }

  const requestId = randomBytes(16).toString('hex');
  const startTime = Date.now();

  // Store request ID for use in response
  (req as Request & { requestId: string }).requestId = requestId;

  // Log request start
  const requestLog: RequestLog = {
    requestId,
    method: `${req.method} ${req.path}`,
    userId: req.userId,
    apiKeyId: req.apiKeyId,
    ip: req.ip || req.socket.remoteAddress || undefined,
    userAgent: req.headers['user-agent'] || undefined,
    requestBody: req.body ? JSON.stringify(req.body).substring(0, 1000) : undefined,
    timestamp: new Date(),
  };

  // Override res.json to capture response
  const originalJson = res.json.bind(res);
  res.json = function (body: unknown) {
    const responseTime = Date.now() - startTime;
    const logEntry: RequestLog = {
      ...requestLog,
      responseStatus: res.statusCode,
      responseTime,
    };

    // Log to database
    try {
      const stmt = db.prepare(`
        INSERT INTO request_logs (
          id, request_id, method, user_id, api_key_id, ip, user_agent,
          request_body, response_status, response_time, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        randomBytes(16).toString('hex'),
        logEntry.requestId,
        logEntry.method,
        logEntry.userId || null,
        logEntry.apiKeyId || null,
        logEntry.ip || null,
        logEntry.userAgent || null,
        logEntry.requestBody || null,
        logEntry.responseStatus || null,
        logEntry.responseTime || null,
        logEntry.timestamp.toISOString()
      );
    } catch (error) {
      console.error('Failed to log request to database:', error);
    }

    // Log to winston
    logRequest(logEntry);

    return originalJson(body);
  };

  // Handle errors
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      const responseTime = Date.now() - startTime;
      const logEntry: RequestLog = {
        ...requestLog,
        responseStatus: res.statusCode,
        responseTime,
        error: `HTTP ${res.statusCode}`,
      };

      try {
        const stmt = db.prepare(`
          INSERT INTO request_logs (
            id, request_id, method, user_id, api_key_id, ip, user_agent,
            request_body, response_status, response_time, error, timestamp
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
          randomBytes(16).toString('hex'),
          logEntry.requestId,
          logEntry.method,
          logEntry.userId || null,
          logEntry.apiKeyId || null,
          logEntry.ip || null,
          logEntry.userAgent || null,
          logEntry.requestBody || null,
          logEntry.responseStatus || null,
          logEntry.responseTime || null,
          logEntry.error || null,
          logEntry.timestamp.toISOString()
        );
      } catch (error) {
        console.error('Failed to log error to database:', error);
      }

      logRequest(logEntry);
    }
  });

  next();
}
