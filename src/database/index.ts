import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { getConfig } from '../config/index.js';
import { logger } from '../logger/index.js';

const config = getConfig();

// Ensure data directory exists
const dataDir = path.dirname(config.dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
export const db = new Database(config.dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
export function initializeDatabase(): void {
  logger.info('Initializing database...');

  // API Keys table
  db.exec(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      key_hash TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      user_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_used_at DATETIME,
      expires_at DATETIME,
      is_active INTEGER DEFAULT 1,
      rate_limit_per_minute INTEGER DEFAULT 300
    )
  `);

  // Request logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS request_logs (
      id TEXT PRIMARY KEY,
      request_id TEXT NOT NULL,
      method TEXT NOT NULL,
      user_id TEXT,
      api_key_id TEXT,
      ip TEXT,
      user_agent TEXT,
      request_body TEXT,
      response_status INTEGER,
      response_time INTEGER,
      error TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (api_key_id) REFERENCES api_keys(id)
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_request_logs_timestamp ON request_logs(timestamp);
    CREATE INDEX IF NOT EXISTS idx_request_logs_api_key ON request_logs(api_key_id);
    CREATE INDEX IF NOT EXISTS idx_request_logs_user ON request_logs(user_id);
  `);

  // Available models table (for Odoo model management)
  db.exec(`
    CREATE TABLE IF NOT EXISTS available_models (
      id TEXT PRIMARY KEY,
      model_name TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      description TEXT,
      is_enabled INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Cleanup old logs based on retention policy
  const retentionDays = config.logRetentionDays;
  db.exec(`
    DELETE FROM request_logs 
    WHERE timestamp < datetime('now', '-' || ${retentionDays} || ' days')
  `);

  logger.info('Database initialized successfully');
}

// Cleanup function
export function closeDatabase(): void {
  db.close();
  logger.info('Database connection closed');
}
