import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  // Odoo Configuration
  odooUrl: z.string().url().default('http://localhost:8069'),
  odooDatabase: z.string().min(1),
  odooUsername: z.string().min(1),
  odooPassword: z.string().min(1),
  odooApiKey: z.string().optional(),

  // MCP Server Configuration
  mcpServerPort: z.coerce.number().int().positive().default(3000),
  mcpServerHost: z.string().default('0.0.0.0'),

  // Security
  jwtSecret: z.string().min(32),
  apiKeyHashSaltRounds: z.coerce.number().int().positive().default(10),

  // Rate Limiting
  rateLimitEnabled: z.coerce.boolean().default(true),
  rateLimitRequestsPerMinute: z.coerce.number().int().positive().default(300),
  rateLimitTimeoutSeconds: z.coerce.number().int().positive().default(30),

  // Logging
  logEnabled: z.coerce.boolean().default(true),
  logRetentionDays: z.coerce.number().int().positive().default(30),
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  logDir: z.string().default('./logs'),

  // Database
  dbPath: z.string().default('./data/mcp_server.db'),

  // Feature Flags
  mcpAccessEnabled: z.coerce.boolean().default(true),
  requireApiKeys: z.coerce.boolean().default(true),
});

export type Config = z.infer<typeof configSchema>;

let config: Config | null = null;

export function getConfig(): Config {
  if (config) {
    return config;
  }

  try {
    config = configSchema.parse({
      odooUrl: process.env.ODOO_URL,
      odooDatabase: process.env.ODOO_DATABASE,
      odooUsername: process.env.ODOO_USERNAME,
      odooPassword: process.env.ODOO_PASSWORD,
      odooApiKey: process.env.ODOO_API_KEY,
      mcpServerPort: process.env.MCP_SERVER_PORT,
      mcpServerHost: process.env.MCP_SERVER_HOST,
      jwtSecret: process.env.JWT_SECRET,
      apiKeyHashSaltRounds: process.env.API_KEY_HASH_SALT_ROUNDS,
      rateLimitEnabled: process.env.RATE_LIMIT_ENABLED,
      rateLimitRequestsPerMinute: process.env.RATE_LIMIT_REQUESTS_PER_MINUTE,
      rateLimitTimeoutSeconds: process.env.RATE_LIMIT_TIMEOUT_SECONDS,
      logEnabled: process.env.LOG_ENABLED,
      logRetentionDays: process.env.LOG_RETENTION_DAYS,
      logLevel: process.env.LOG_LEVEL,
      logDir: process.env.LOG_DIR,
      dbPath: process.env.DB_PATH,
      mcpAccessEnabled: process.env.MCP_ACCESS_ENABLED,
      requireApiKeys: process.env.REQUIRE_API_KEYS,
    });
    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Configuration validation error:', error.errors);
      throw new Error('Invalid configuration. Please check your environment variables.');
    }
    throw error;
  }
}
