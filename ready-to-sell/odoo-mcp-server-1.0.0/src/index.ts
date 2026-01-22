#!/usr/bin/env node

import { startMcpServer } from './mcp-server.js';
import { startApiServer } from './api-server.js';
import { getConfig } from './config/index.js';
import { logger } from './logger/index.js';

const config = getConfig();

async function main() {
  try {
    logger.info('Starting Odoo MCP Server...');
    logger.info(`Configuration: MCP Access=${config.mcpAccessEnabled}, API Keys=${config.requireApiKeys}`);

    // Determine which server to start based on how it's invoked
    const mode = process.env.MCP_MODE || 'api'; // 'api' or 'mcp' or 'both'

    if (mode === 'mcp' || mode === 'both') {
      await startMcpServer();
    }

    if (mode === 'api' || mode === 'both') {
      await startApiServer();
    }

    if (mode !== 'api' && mode !== 'mcp' && mode !== 'both') {
      logger.error(`Invalid MCP_MODE: ${mode}. Use 'api', 'mcp', or 'both'`);
      process.exit(1);
    }
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

main();
