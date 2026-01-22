# MCP Client Configuration

This document explains how to configure the Odoo MCP Server with various MCP clients.

## Claude Desktop Configuration

Add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "odoo": {
      "command": "node",
      "args": [
        "/path/to/odoo-mcp-server/dist/index.js"
      ],
      "env": {
        "MCP_MODE": "mcp",
        "ODOO_URL": "http://localhost:8069",
        "ODOO_DATABASE": "odoo",
        "ODOO_USERNAME": "admin",
        "ODOO_PASSWORD": "admin",
        "JWT_SECRET": "your-secret-key"
      }
    }
  }
}
```

## Cursor IDE Configuration

Add to your Cursor settings or `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "odoo": {
      "command": "node",
      "args": [
        "/path/to/odoo-mcp-server/dist/index.js"
      ],
      "env": {
        "MCP_MODE": "mcp",
        "ODOO_URL": "http://localhost:8069",
        "ODOO_DATABASE": "odoo",
        "ODOO_USERNAME": "admin",
        "ODOO_PASSWORD": "admin"
      }
    }
  }
}
```

## Using with HTTP Transport

For remote access, you can use the HTTP API server:

```bash
# Start the API server
MCP_MODE=api npm start

# Then use HTTP endpoints
curl http://localhost:3000/api/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Environment Variables

All configuration can be provided via environment variables. See `.env.example` for the full list.

## Testing the Connection

After configuring, test the connection:

```bash
# Test MCP server (stdio)
MCP_MODE=mcp node dist/index.js

# Test API server
MCP_MODE=api node dist/index.js

# Test health endpoint
curl http://localhost:3000/health
```
