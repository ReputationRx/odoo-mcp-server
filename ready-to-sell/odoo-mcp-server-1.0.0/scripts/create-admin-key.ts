#!/usr/bin/env tsx

import { createApiKey } from '../src/auth/index.js';
import { initializeDatabase } from '../src/database/index.js';
import { logger } from '../src/logger/index.js';

async function main() {
  try {
    // Initialize database
    initializeDatabase();

    // Create admin API key
    const apiKey = await createApiKey(
      'Admin API Key',
      undefined,
      undefined,
      1000 // Higher rate limit for admin
    );

    console.log('\n✅ Admin API Key Created Successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Key ID: ${apiKey.id}`);
    console.log(`Name: ${apiKey.name}`);
    console.log(`API Key: ${apiKey.key}`);
    console.log(`Rate Limit: ${apiKey.rateLimitPerMinute} requests/minute`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANT: Store this API key securely. It will not be shown again!\n');

    process.exit(0);
  } catch (error) {
    logger.error('Failed to create admin API key', { error });
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main();
