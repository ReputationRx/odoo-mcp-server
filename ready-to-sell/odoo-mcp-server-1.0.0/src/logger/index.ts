import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import { getConfig } from '../config/index.js';

const config = getConfig();

// Ensure log directory exists
const logDir = config.logDir;
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Custom format for logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Create transports
const transports: winston.transport[] = [];

// File transport with daily rotation
if (config.logEnabled) {
  transports.push(
    new DailyRotateFile({
      filename: path.join(logDir, 'mcp-server-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: `${config.logRetentionDays}d`,
      format: logFormat,
      level: config.logLevel,
    })
  );

  // Error log file
  transports.push(
    new DailyRotateFile({
      filename: path.join(logDir, 'mcp-server-error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: `${config.logRetentionDays}d`,
      format: logFormat,
      level: 'error',
    })
  );
}

// Console transport
transports.push(
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
    level: config.logLevel,
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: config.logLevel,
  format: logFormat,
  transports,
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, 'mcp-server-exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: `${config.logRetentionDays}d`,
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, 'mcp-server-rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: `${config.logRetentionDays}d`,
    }),
  ],
});

// Helper function to log MCP requests
export interface RequestLog {
  requestId: string;
  method: string;
  userId?: string;
  apiKeyId?: string;
  ip?: string;
  userAgent?: string;
  requestBody?: unknown;
  responseStatus?: number;
  responseTime?: number;
  error?: string;
  timestamp: Date;
}

export function logRequest(log: RequestLog): void {
  if (!config.logEnabled) {
    return;
  }

  const level = log.error ? 'error' : 'info';
  logger[level]('MCP Request', {
    requestId: log.requestId,
    method: log.method,
    userId: log.userId,
    apiKeyId: log.apiKeyId,
    ip: log.ip,
    userAgent: log.userAgent,
    responseStatus: log.responseStatus,
    responseTime: log.responseTime,
    error: log.error,
    timestamp: log.timestamp.toISOString(),
  });
}
