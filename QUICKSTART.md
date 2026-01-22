# Quick Start Guide

Get your Odoo MCP Server up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd odoo-mcp-server
npm install
```

## Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Odoo credentials:

```env
ODOO_URL=http://localhost:8069
ODOO_DATABASE=odoo
ODOO_USERNAME=admin
ODOO_PASSWORD=admin
JWT_SECRET=change-this-to-a-random-secret-key
```

## Step 3: Build

```bash
npm run build
```

## Step 4: Create Your First API Key

```bash
npm run create-admin-key
```

**Important**: Save the API key shown - you'll need it to authenticate!

## Step 5: Start the Server

### Option A: API Server (HTTP endpoints)

```bash
npm run dev:api
# or
MCP_MODE=api npm start
```

### Option B: MCP Server (stdio transport)

```bash
npm run dev:mcp
# or
MCP_MODE=mcp npm start
```

### Option C: Both

```bash
npm run dev
# or
MCP_MODE=both npm start
```

## Step 6: Test the Server

### Health Check

```bash
curl http://localhost:3000/health
```

### Create an API Key

```bash
curl -X POST http://localhost:3000/api/api-keys \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Key"}'
```

### List Odoo Models

```bash
curl http://localhost:3000/api/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Search Partners

```bash
curl -X POST http://localhost:3000/api/models/res.partner/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": [["name", "ilike", "test"]],
    "fields": ["name", "email"],
    "limit": 10
  }'
```

## Docker Quick Start

```bash
# Edit docker-compose.yml with your Odoo credentials
# Then:
docker-compose up -d

# View logs
docker-compose logs -f odoo-mcp-server

# Create API key
docker-compose exec odoo-mcp-server npm run create-admin-key
```

## Next Steps

1. Read the [README.md](./README.md) for full documentation
2. Check [MCP_CONFIG.md](./MCP_CONFIG.md) for client configuration
3. Review API endpoints in the README
4. Set up monitoring and alerts
5. Configure HTTPS with a reverse proxy for production

## Troubleshooting

### Can't connect to Odoo?

1. Verify Odoo is running: `curl http://localhost:8069`
2. Check credentials in `.env`
3. Verify database name is correct
4. Check firewall/network settings

### Port 3000 already in use?

Change `MCP_SERVER_PORT` in `.env` or use:

```bash
MCP_SERVER_PORT=3001 npm start
```

### Database errors?

Ensure the `data/` directory is writable:

```bash
mkdir -p data logs
chmod 755 data logs
```

## Need Help?

- Check the [README.md](./README.md) for detailed documentation
- Review logs in the `logs/` directory
- Check API logs: `GET /api/logs` endpoint
