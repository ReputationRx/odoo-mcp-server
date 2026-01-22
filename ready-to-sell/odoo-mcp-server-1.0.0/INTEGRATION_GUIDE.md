# Integration Guide - Adding Odoo MCP Server to Your Odoo Instance

This guide walks you through integrating the Odoo MCP Server with your existing Odoo installation.

---

## 📋 Prerequisites

- Odoo instance running (17, 18, or 19+)
- Node.js 18+ installed
- Access to your Odoo database credentials
- (Optional) Docker if using containerized deployment

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install the MCP Server

```bash
# Navigate to the project directory
cd odoo-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

### Step 2: Configure Connection to Your Odoo

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your Odoo details
nano .env  # or use your preferred editor
```

**Update these values in `.env`:**

```env
# Your Odoo Instance Details
ODOO_URL=http://localhost:8069          # Your Odoo URL
ODOO_DATABASE=your_database_name        # Your Odoo database name
ODOO_USERNAME=admin                      # Odoo username
ODOO_PASSWORD=your_password              # Odoo password or API key

# For Odoo 19+, you can use an API key instead:
ODOO_API_KEY=your_api_key_here           # Optional: Odoo 19+ API key

# Security (IMPORTANT: Change in production!)
JWT_SECRET=change-this-to-a-random-secret-key-min-32-chars
```

### Step 3: Create Your First API Key

```bash
npm run create-admin-key
```

**Save the API key shown** - you'll need it for authentication!

### Step 4: Start the Server

```bash
# Start the API server (for HTTP access)
npm start

# Or start in development mode
npm run dev
```

The server will start on `http://localhost:3000` by default.

### Step 5: Test the Connection

```bash
# Health check
curl http://localhost:3000/health

# Test Odoo connection (replace YOUR_API_KEY with the key from step 3)
curl http://localhost:3000/api/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

If you see a list of Odoo models, you're connected! ✅

---

## 🔌 Integration Options

### Option 1: MCP Protocol (For AI Assistants)

This allows AI assistants like Claude Desktop or Cursor to directly interact with your Odoo.

#### A. Claude Desktop Integration

1. **Find your Claude Desktop config file:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Edit the config file** (create if it doesn't exist):

```json
{
  "mcpServers": {
    "odoo": {
      "command": "node",
      "args": [
        "/absolute/path/to/odoo-mcp-server/dist/index.js"
      ],
      "env": {
        "MCP_MODE": "mcp",
        "ODOO_URL": "http://localhost:8069",
        "ODOO_DATABASE": "your_database_name",
        "ODOO_USERNAME": "admin",
        "ODOO_PASSWORD": "your_password",
        "JWT_SECRET": "your-secret-key"
      }
    }
  }
}
```

3. **Restart Claude Desktop**

4. **Test it**: Ask Claude "List all available Odoo models" or "Find customers named John"

#### B. Cursor IDE Integration

1. **Create or edit** `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "odoo": {
      "command": "node",
      "args": [
        "/absolute/path/to/odoo-mcp-server/dist/index.js"
      ],
      "env": {
        "MCP_MODE": "mcp",
        "ODOO_URL": "http://localhost:8069",
        "ODOO_DATABASE": "your_database_name",
        "ODOO_USERNAME": "admin",
        "ODOO_PASSWORD": "your_password"
      }
    }
  }
}
```

2. **Restart Cursor**

### Option 2: REST API (For External Systems)

Use the HTTP API for integrations with other systems, webhooks, or custom applications.

#### Start the API Server

```bash
# Set mode to API only
MCP_MODE=api npm start
```

#### Use the API

```bash
# Create an API key
curl -X POST http://localhost:3000/api/api-keys \
  -H "Content-Type: application/json" \
  -d '{"name": "My Integration Key"}'

# Use the API key for requests
curl http://localhost:3000/api/models/res.partner/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": [["name", "ilike", "test"]],
    "fields": ["name", "email"],
    "limit": 10
  }'
```

### Option 3: Docker Deployment

For production or easier deployment:

#### A. Using Docker Compose (Includes Odoo)

```bash
# Edit docker-compose.yml with your Odoo details
# Then:
docker-compose up -d

# View logs
docker-compose logs -f odoo-mcp-server
```

#### B. Standalone Docker Container

```bash
# Build the image
docker build -t odoo-mcp-server .

# Run the container
docker run -d \
  --name odoo-mcp-server \
  -p 3000:3000 \
  -e ODOO_URL=http://your-odoo-host:8069 \
  -e ODOO_DATABASE=your_database \
  -e ODOO_USERNAME=admin \
  -e ODOO_PASSWORD=your_password \
  -e JWT_SECRET=your-secret-key \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/logs:/app/logs \
  odoo-mcp-server
```

---

## 🔐 Getting Odoo API Key (Odoo 19+)

For Odoo 19+, using an API key is recommended:

1. **Log into Odoo 19**
2. Go to **Settings** → **Users & Companies** → **Users**
3. Select your user
4. Go to **API Keys** tab
5. Click **Generate API Key**
6. Copy the key
7. Use it as `ODOO_PASSWORD` or `ODOO_API_KEY` in your `.env`

---

## 🌐 Connecting to Remote Odoo

If your Odoo is on a remote server:

```env
# In .env file
ODOO_URL=https://your-odoo-domain.com
ODOO_DATABASE=production_db
ODOO_USERNAME=api_user
ODOO_PASSWORD=secure_api_key
```

**Security Notes:**
- Use HTTPS for remote connections
- Use API keys, not passwords
- Consider firewall rules
- Use environment variables, not hardcoded credentials

---

## 🔧 Configuration Options

### Environment Variables

All settings can be configured via environment variables:

```env
# Odoo Connection
ODOO_URL=http://localhost:8069
ODOO_DATABASE=odoo
ODOO_USERNAME=admin
ODOO_PASSWORD=admin
ODOO_API_KEY=                    # Optional for Odoo 19+

# Server Settings
MCP_SERVER_PORT=3000
MCP_SERVER_HOST=0.0.0.0
MCP_MODE=both                     # 'api', 'mcp', or 'both'

# Security
JWT_SECRET=your-secret-key
REQUIRE_API_KEYS=true
MCP_ACCESS_ENABLED=true

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=300
RATE_LIMIT_TIMEOUT_SECONDS=30

# Logging
LOG_ENABLED=true
LOG_RETENTION_DAYS=30
LOG_LEVEL=info
```

---

## ✅ Verification Steps

### 1. Check Server is Running

```bash
curl http://localhost:3000/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-01-20T...",
  "version": "1.0.0"
}
```

### 2. Test Odoo Connection

```bash
curl http://localhost:3000/api/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Should return a list of Odoo models.

### 3. Test Search Operation

```bash
curl -X POST http://localhost:3000/api/models/res.partner/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"domain": [], "limit": 5}'
```

Should return partner records.

### 4. Test MCP Connection (if using MCP mode)

In Claude Desktop or Cursor, try:
- "List all Odoo models"
- "Find customers named John"
- "Show me the fields for sale.order model"

---

## 🐛 Troubleshooting

### Connection Issues

**Problem**: Can't connect to Odoo

**Solutions**:
1. Verify Odoo is running: `curl http://localhost:8069`
2. Check credentials in `.env`
3. Verify database name is correct
4. Check firewall/network settings
5. For remote Odoo, ensure URL is accessible

### Authentication Errors

**Problem**: "Invalid credentials" or "Authentication failed"

**Solutions**:
1. Double-check username and password
2. For Odoo 19+, use API key instead of password
3. Verify user has API access enabled
4. Check Odoo logs for more details

### Port Already in Use

**Problem**: Port 3000 is already in use

**Solutions**:
```bash
# Change port in .env
MCP_SERVER_PORT=3001

# Or find and kill the process using port 3000
lsof -ti:3000 | xargs kill
```

### MCP Not Working in Claude/Cursor

**Problem**: MCP tools not appearing

**Solutions**:
1. Verify config file path is correct
2. Use absolute path to `dist/index.js`
3. Check environment variables are set
4. Restart Claude Desktop/Cursor
5. Check server logs for errors
6. Verify `MCP_MODE=mcp` is set

### Database Errors

**Problem**: SQLite database errors

**Solutions**:
```bash
# Ensure data directory exists and is writable
mkdir -p data logs
chmod 755 data logs

# Check disk space
df -h
```

---

## 🔄 Updating the Server

When you update the server:

```bash
# Pull latest changes
git pull

# Reinstall dependencies (if package.json changed)
npm install

# Rebuild
npm run build

# Restart server
npm start
```

For Docker:
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 📊 Monitoring

### View Logs

```bash
# Application logs
tail -f logs/mcp-server-*.log

# Error logs
tail -f logs/mcp-server-error-*.log

# Docker logs
docker-compose logs -f odoo-mcp-server
```

### Check Log Statistics

```bash
curl http://localhost:3000/api/logs/stats \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### View Recent Requests

```bash
curl "http://localhost:3000/api/logs?limit=50" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## 🔒 Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Use API keys, not passwords
- [ ] Enable HTTPS (use reverse proxy)
- [ ] Set appropriate rate limits
- [ ] Configure log retention
- [ ] Set up monitoring/alerting
- [ ] Review firewall rules
- [ ] Use environment variables (not .env in production)
- [ ] Set up backups for database
- [ ] Configure proper logging levels
- [ ] Test failover scenarios

---

## 📚 Next Steps

1. **Read the documentation**:
   - [README.md](./README.md) - Full documentation
   - [CAPABILITIES.md](./CAPABILITIES.md) - What you can do
   - [QUICKSTART.md](./QUICKSTART.md) - Quick start guide

2. **Explore the API**:
   - Try different Odoo models
   - Test search operations
   - Create/update records

3. **Integrate with your workflow**:
   - Set up AI assistants
   - Create automation scripts
   - Build integrations

---

## 🆘 Need Help?

- Check the [README.md](./README.md) for detailed documentation
- Review logs in the `logs/` directory
- Check API logs via `/api/logs` endpoint
- Verify Odoo connection with health check

**You're now ready to use the Odoo MCP Server with your Odoo instance!** 🎉
