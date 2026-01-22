# Odoo MCP Server

A fully production-ready Model Context Protocol (MCP) server for Odoo integration. This server provides secure, rate-limited, and logged access to Odoo's XML-RPC/JSON-RPC API through the MCP protocol.

## Features

- ✅ **MCP Protocol Support**: Full implementation of the Model Context Protocol
- ✅ **API Key Authentication**: Secure API key-based authentication with bcrypt hashing
- ✅ **Rate Limiting**: Configurable rate limiting per API key (default: 300 requests/minute)
- ✅ **Request Logging**: Comprehensive request/response logging with configurable retention (default: 30 days)
- ✅ **Request Timeout**: Configurable timeout protection (default: 30 seconds)
- ✅ **Odoo Integration**: Full CRUD operations on Odoo models via XML-RPC/JSON-RPC
- ✅ **Odoo 19 Support**: Automatic detection and use of Odoo 19's new JSON-RPC API
- ✅ **Backward Compatible**: Works with Odoo 17, 18, 19+ (auto-detects version)
- ✅ **Model Management**: List and manage available Odoo models
- ✅ **Production Ready**: Docker support, health checks, graceful shutdown, error handling
- ✅ **TypeScript**: Fully typed with TypeScript for better developer experience

## Quick Start

### Prerequisites

- Node.js 18+ or Docker
- Odoo instance (local or remote)

### Installation

```bash
# Navigate to the project directory
cd odoo-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Copy environment file
cp .env.example .env

# Edit .env with your Odoo credentials
nano .env
```

**See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed integration instructions.**

### Configuration

Edit `.env` file with your settings:

```env
# Odoo Configuration
ODOO_URL=http://localhost:8069
ODOO_DATABASE=odoo
ODOO_USERNAME=admin
ODOO_PASSWORD=admin

# Security
JWT_SECRET=your-secret-key-change-in-production

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=300
RATE_LIMIT_TIMEOUT_SECONDS=30

# Logging
LOG_RETENTION_DAYS=30
```

### Running the Server

#### Development Mode

```bash
# Start API server (for HTTP endpoints)
npm run dev

# Or start MCP server (for stdio transport)
MCP_MODE=mcp npm run dev

# Or start both
MCP_MODE=both npm run dev
```

#### Production Mode

```bash
# Build
npm run build

# Start
npm start
```

#### Docker

```bash
# Build and start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f odoo-mcp-server
```

## Usage

### Creating an API Key

```bash
curl -X POST http://localhost:3000/api/api-keys \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My API Key",
    "rateLimitPerMinute": 300
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "My API Key",
    "key": "odoo_mcp_...",  // Store this securely!
    "createdAt": "2025-01-20T...",
    "rateLimitPerMinute": 300
  }
}
```

### Using the API

All API endpoints (except `/health` and `/api/config`) require authentication:

```bash
curl http://localhost:3000/api/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### MCP Tools

The server provides the following MCP tools:

1. **odoo_search_records**: Search and retrieve records from an Odoo model
2. **odoo_create_record**: Create a new record
3. **odoo_update_record**: Update existing records
4. **odoo_delete_record**: Delete records
5. **odoo_get_model_fields**: Get field definitions for a model
6. **odoo_list_models**: List all available Odoo models

### Example: Search Partners

```bash
curl -X POST http://localhost:3000/api/models/res.partner/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": [["name", "ilike", "test"]],
    "fields": ["name", "email", "phone"],
    "limit": 10
  }'
```

## API Endpoints

### Configuration
- `GET /api/config` - Get server configuration (public)

### API Keys
- `POST /api/api-keys` - Create a new API key
- `GET /api/api-keys` - List all API keys
- `GET /api/api-keys/:id` - Get API key details
- `POST /api/api-keys/:id/revoke` - Revoke an API key
- `DELETE /api/api-keys/:id` - Delete an API key

### Models
- `GET /api/models` - List all available Odoo models
- `GET /api/models/:model/fields` - Get model field definitions
- `POST /api/models/:model/search` - Search records
- `POST /api/models/:model/create` - Create a record
- `PUT /api/models/:model/:id` - Update a record
- `DELETE /api/models/:model/:id` - Delete a record

### Logs
- `GET /api/logs` - Get request logs (with filters)
- `GET /api/logs/stats` - Get log statistics

### Health
- `GET /health` - Health check endpoint

## Configuration Options

All configuration is done via environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `ODOO_URL` | Odoo server URL | `http://localhost:8069` |
| `ODOO_DATABASE` | Odoo database name | Required |
| `ODOO_USERNAME` | Odoo username | Required |
| `ODOO_PASSWORD` | Odoo password | Required |
| `ODOO_API_KEY` | Odoo API key (optional) | - |
| `MCP_SERVER_PORT` | API server port | `3000` |
| `MCP_SERVER_HOST` | API server host | `0.0.0.0` |
| `MCP_MODE` | Server mode: `api`, `mcp`, or `both` | `api` |
| `JWT_SECRET` | Secret for JWT tokens | Required |
| `RATE_LIMIT_ENABLED` | Enable rate limiting | `true` |
| `RATE_LIMIT_REQUESTS_PER_MINUTE` | Requests per minute limit | `300` |
| `RATE_LIMIT_TIMEOUT_SECONDS` | Request timeout in seconds | `30` |
| `LOG_ENABLED` | Enable request logging | `true` |
| `LOG_RETENTION_DAYS` | Log retention period | `30` |
| `LOG_LEVEL` | Logging level | `info` |
| `MCP_ACCESS_ENABLED` | Enable MCP access globally | `true` |
| `REQUIRE_API_KEYS` | Require API keys for requests | `true` |

## Security Best Practices

1. **Change Default Secrets**: Always change `JWT_SECRET` in production
2. **Use API Keys**: Keep `REQUIRE_API_KEYS=true` in production
3. **Rate Limiting**: Adjust `RATE_LIMIT_REQUESTS_PER_MINUTE` based on your needs
4. **HTTPS**: Use a reverse proxy (nginx, Traefik) for HTTPS in production
5. **Network Security**: Restrict access to the server using firewall rules
6. **Log Retention**: Set appropriate `LOG_RETENTION_DAYS` for compliance

## Monitoring

### Health Check

```bash
curl http://localhost:3000/health
```

### Log Statistics

```bash
curl http://localhost:3000/api/logs/stats \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### View Logs

Logs are stored in the `logs/` directory with daily rotation. They can also be accessed via the API:

```bash
curl "http://localhost:3000/api/logs?limit=100" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Development

### Project Structure

```
odoo-mcp-server/
├── src/
│   ├── config/          # Configuration management
│   ├── database/        # SQLite database setup
│   ├── auth/            # API key authentication
│   ├── rate-limiter/    # Rate limiting logic
│   ├── logger/          # Logging setup
│   ├── odoo/            # Odoo client
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── mcp-server.ts    # MCP server implementation
│   ├── api-server.ts    # Express API server
│   └── index.ts         # Entry point
├── dist/                # Compiled JavaScript
├── logs/                # Log files
├── data/                # SQLite database
└── package.json
```

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Troubleshooting

### Connection to Odoo Fails

1. Verify `ODOO_URL` is correct
2. Check Odoo is running and accessible
3. Verify credentials are correct
4. Check network/firewall settings

### Rate Limit Errors

- Check your API key's rate limit setting
- Review logs to see request patterns
- Adjust `RATE_LIMIT_REQUESTS_PER_MINUTE` if needed

### Database Errors

- Ensure `data/` directory is writable
- Check disk space
- Review database file permissions

## License

MIT License - See [LICENSE](./LICENSE) file for details.

This software is provided as-is. For commercial licensing or support options, please contact the vendor.

## Support

For issues and questions:
- Check [INSTALLATION.md](./INSTALLATION.md) for installation help
- Review [MCP_CONFIG.md](./MCP_CONFIG.md) for MCP client configuration
- See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for integration examples
- For commercial support, contact your vendor
