# Odoo MCP Server - Installation Guide

This guide will help you install and configure the Odoo MCP Server for production use.

## System Requirements

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Odoo**: Version 17, 18, or 19+ (local or remote instance)
- **Operating System**: Windows, macOS, or Linux

## Quick Installation

### Option 1: Automated Installation (Recommended)

#### Linux/macOS:
```bash
chmod +x install.sh
./install.sh
```

#### Windows:
```batch
install.bat
```

### Option 2: Manual Installation

1. **Extract the package** to your desired location
2. **Install dependencies**:
   ```bash
   npm install --production
   ```
3. **Build the project**:
   ```bash
   npm run build
   ```
4. **Create necessary directories**:
   ```bash
   mkdir -p logs data
   ```
5. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

## Configuration

### 1. Environment Variables

Edit the `.env` file with your Odoo configuration:

```env
# Odoo Configuration (Required)
ODOO_URL=http://localhost:8069
ODOO_DATABASE=odoo
ODOO_USERNAME=admin
ODOO_PASSWORD=admin

# Security (Required)
JWT_SECRET=your-secret-key-change-in-production

# Server Configuration
MCP_SERVER_PORT=3000
MCP_SERVER_HOST=0.0.0.0
MCP_MODE=both

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=300
RATE_LIMIT_TIMEOUT_SECONDS=30

# Logging
LOG_ENABLED=true
LOG_RETENTION_DAYS=30
LOG_LEVEL=info
```

### 2. Odoo Connection

Ensure your Odoo instance is:
- Accessible from the server (check firewall rules)
- Using the correct URL (http:// or https://)
- Has the database name, username, and password configured correctly

### 3. Security Settings

**Important**: Change the following in production:

- `JWT_SECRET`: Use a strong, random secret key
- `ODOO_PASSWORD`: Use a secure password
- Consider using environment variables or a secrets manager

## Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Docker

```bash
docker-compose up -d
```

## Verification

### 1. Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-20T..."
}
```

### 2. Create an API Key

```bash
curl -X POST http://localhost:3000/api/api-keys \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My API Key",
    "rateLimitPerMinute": 300
  }'
```

### 3. Test Odoo Connection

```bash
curl http://localhost:3000/api/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## MCP Client Configuration

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "odoo": {
      "command": "node",
      "args": ["/path/to/odoo-mcp-server/dist/index.js"],
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

### Cursor IDE

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "odoo": {
      "command": "node",
      "args": ["/path/to/odoo-mcp-server/dist/index.js"],
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

## Troubleshooting

### Connection Issues

**Problem**: Cannot connect to Odoo

**Solutions**:
1. Verify `ODOO_URL` is correct and accessible
2. Check Odoo is running: `curl http://localhost:8069`
3. Verify credentials in `.env`
4. Check firewall/network settings
5. For remote Odoo, ensure it's accessible from your network

### Port Already in Use

**Problem**: Port 3000 is already in use

**Solution**: Change `MCP_SERVER_PORT` in `.env` to a different port

### Permission Errors

**Problem**: Cannot write to logs/ or data/ directories

**Solution**: 
```bash
chmod -R 755 logs data
# Or on Windows, ensure the user has write permissions
```

### Build Errors

**Problem**: `npm run build` fails

**Solutions**:
1. Ensure Node.js 18+ is installed: `node -v`
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check TypeScript version: `npm list typescript`

### API Key Issues

**Problem**: API key authentication fails

**Solutions**:
1. Verify the API key is correct
2. Check the Authorization header format: `Bearer YOUR_API_KEY`
3. Ensure the API key hasn't been revoked
4. Check server logs for detailed error messages

## Production Deployment

### 1. Use a Process Manager

**PM2** (Recommended):
```bash
npm install -g pm2
pm2 start dist/index.js --name odoo-mcp-server
pm2 save
pm2 startup
```

### 2. Use a Reverse Proxy

**Nginx example**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Enable HTTPS

Use Let's Encrypt with Certbot or your preferred SSL certificate provider.

### 4. Set Up Monitoring

- Monitor the `/health` endpoint
- Set up log rotation
- Monitor disk space for logs
- Set up alerts for errors

## Support

For additional help:
- Check the [README.md](./README.md) for detailed documentation
- Review [MCP_CONFIG.md](./MCP_CONFIG.md) for MCP client setup
- See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for integration examples

## License

This software is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
