import bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';
import { db } from '../database/index.js';
import { getConfig } from '../config/index.js';
import { logger } from '../logger/index.js';

const config = getConfig();

export interface ApiKey {
  id: string;
  keyHash: string;
  name: string;
  userId?: string;
  createdAt: Date;
  lastUsedAt?: Date;
  expiresAt?: Date;
  isActive: boolean;
  rateLimitPerMinute: number;
}

export interface ApiKeyWithKey extends ApiKey {
  key: string; // Only returned when creating a new key
}

/**
 * Generate a new API key
 */
export function generateApiKey(): string {
  const randomPart = randomBytes(32).toString('hex');
  const timestamp = Date.now().toString(36);
  return `odoo_mcp_${timestamp}_${randomPart}`;
}

/**
 * Hash an API key for storage
 */
export async function hashApiKey(key: string): Promise<string> {
  return bcrypt.hash(key, config.apiKeyHashSaltRounds);
}

/**
 * Verify an API key against its hash
 */
export async function verifyApiKey(key: string, hash: string): Promise<boolean> {
  return bcrypt.compare(key, hash);
}

/**
 * Create a new API key
 */
export async function createApiKey(
  name: string,
  userId?: string,
  expiresAt?: Date,
  rateLimitPerMinute?: number
): Promise<ApiKeyWithKey> {
  const key = generateApiKey();
  const keyHash = await hashApiKey(key);
  const id = randomBytes(16).toString('hex');

  const stmt = db.prepare(`
    INSERT INTO api_keys (id, key_hash, name, user_id, expires_at, rate_limit_per_minute)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    keyHash,
    name,
    userId || null,
    expiresAt?.toISOString() || null,
    rateLimitPerMinute || config.rateLimitRequestsPerMinute
  );

  const apiKey: ApiKeyWithKey = {
    id,
    keyHash,
    name,
    userId,
    createdAt: new Date(),
    expiresAt,
    isActive: true,
    rateLimitPerMinute: rateLimitPerMinute || config.rateLimitRequestsPerMinute,
    key, // Include the plain key only on creation
  };

  logger.info(`API key created: ${name} (${id})`);
  return apiKey;
}

/**
 * Find an API key by the actual key value
 */
export async function findApiKeyByKey(key: string): Promise<ApiKey | null> {
  const stmt = db.prepare('SELECT * FROM api_keys WHERE is_active = 1');
  const rows = stmt.all() as Array<{
    id: string;
    key_hash: string;
    name: string;
    user_id: string | null;
    created_at: string;
    last_used_at: string | null;
    expires_at: string | null;
    is_active: number;
    rate_limit_per_minute: number;
  }>;

  for (const row of rows) {
    const isValid = await verifyApiKey(key, row.key_hash);
    if (isValid) {
      // Check expiration
      if (row.expires_at) {
        const expiresAt = new Date(row.expires_at);
        if (expiresAt < new Date()) {
          logger.warn(`API key ${row.id} has expired`);
          continue;
        }
      }

      // Update last used timestamp
      const updateStmt = db.prepare('UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP WHERE id = ?');
      updateStmt.run(row.id);

      return {
        id: row.id,
        keyHash: row.key_hash,
        name: row.name,
        userId: row.user_id || undefined,
        createdAt: new Date(row.created_at),
        lastUsedAt: row.last_used_at ? new Date(row.last_used_at) : undefined,
        expiresAt: row.expires_at ? new Date(row.expires_at) : undefined,
        isActive: row.is_active === 1,
        rateLimitPerMinute: row.rate_limit_per_minute,
      };
    }
  }

  return null;
}

/**
 * Get API key by ID
 */
export function getApiKeyById(id: string): ApiKey | null {
  const stmt = db.prepare('SELECT * FROM api_keys WHERE id = ?');
  const row = stmt.get(id) as {
    id: string;
    key_hash: string;
    name: string;
    user_id: string | null;
    created_at: string;
    last_used_at: string | null;
    expires_at: string | null;
    is_active: number;
    rate_limit_per_minute: number;
  } | undefined;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    keyHash: row.key_hash,
    name: row.name,
    userId: row.user_id || undefined,
    createdAt: new Date(row.created_at),
    lastUsedAt: row.last_used_at ? new Date(row.last_used_at) : undefined,
    expiresAt: row.expires_at ? new Date(row.expires_at) : undefined,
    isActive: row.is_active === 1,
    rateLimitPerMinute: row.rate_limit_per_minute,
  };
}

/**
 * List all API keys
 */
export function listApiKeys(userId?: string): ApiKey[] {
  let stmt;
  if (userId) {
    stmt = db.prepare('SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at DESC');
  } else {
    stmt = db.prepare('SELECT * FROM api_keys ORDER BY created_at DESC');
  }

  const rows = (userId ? stmt.all(userId) : stmt.all()) as Array<{
    id: string;
    key_hash: string;
    name: string;
    user_id: string | null;
    created_at: string;
    last_used_at: string | null;
    expires_at: string | null;
    is_active: number;
    rate_limit_per_minute: number;
  }>;

  return rows.map((row) => ({
    id: row.id,
    keyHash: row.key_hash,
    name: row.name,
    userId: row.user_id || undefined,
    createdAt: new Date(row.created_at),
    lastUsedAt: row.last_used_at ? new Date(row.last_used_at) : undefined,
    expiresAt: row.expires_at ? new Date(row.expires_at) : undefined,
    isActive: row.is_active === 1,
    rateLimitPerMinute: row.rate_limit_per_minute,
  }));
}

/**
 * Revoke an API key
 */
export function revokeApiKey(id: string): boolean {
  const stmt = db.prepare('UPDATE api_keys SET is_active = 0 WHERE id = ?');
  const result = stmt.run(id);
  logger.info(`API key revoked: ${id}`);
  return result.changes > 0;
}

/**
 * Delete an API key
 */
export function deleteApiKey(id: string): boolean {
  const stmt = db.prepare('DELETE FROM api_keys WHERE id = ?');
  const result = stmt.run(id);
  logger.info(`API key deleted: ${id}`);
  return result.changes > 0;
}
