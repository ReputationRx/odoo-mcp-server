# Odoo MCP Server v1.0.0

## First Release

Production-ready Model Context Protocol (MCP) server for Odoo integration.

### ✨ Features

- ✅ **Full MCP Protocol Support**: Complete implementation of Model Context Protocol
- ✅ **REST API**: HTTP REST API for remote access
- ✅ **API Key Authentication**: Secure API key-based authentication with bcrypt hashing
- ✅ **Rate Limiting**: Configurable rate limiting per API key (default: 300 requests/minute)
- ✅ **Request Logging**: Comprehensive request/response logging with configurable retention
- ✅ **Odoo Integration**: Full CRUD operations on Odoo models via XML-RPC/JSON-RPC
- ✅ **Odoo 19 Support**: Automatic detection and use of Odoo 19's new JSON-RPC API
- ✅ **Backward Compatible**: Works with Odoo 17, 18, 19+ (auto-detects version)
- ✅ **Docker Support**: Dockerfile and docker-compose.yml included
- ✅ **TypeScript**: Fully typed codebase for better developer experience
- ✅ **Production Ready**: Health checks, graceful shutdown, error handling

### 📦 Installation

**Quick Start:**
```bash
# Linux/macOS
./install.sh

# Windows
install.bat
```

**Manual Installation:**
1. Extract the package
2. Run `npm install`
3. Run `npm run build`
4. Copy `.env.example` to `.env` and configure
5. Run `npm start`

See [INSTALLATION.md](./INSTALLATION.md) for detailed instructions.

### 📚 Documentation

- **README.md** - Complete documentation and API reference
- **INSTALLATION.md** - Detailed installation guide
- **MCP_CONFIG.md** - MCP client configuration guide
- **INTEGRATION_GUIDE.md** - Integration examples and use cases
- **QUICKSTART.md** - Quick start guide

### 🔧 Configuration

Edit `.env` file with your Odoo settings:
```env
ODOO_URL=http://localhost:8069
ODOO_DATABASE=odoo
ODOO_USERNAME=admin
ODOO_PASSWORD=admin
JWT_SECRET=your-secret-key-change-in-production
```

### 🚀 Usage

**Start the server:**
```bash
npm start
```

**Create an API key:**
```bash
curl -X POST http://localhost:3000/api/api-keys \
  -H "Content-Type: application/json" \
  -d '{"name": "My API Key", "rateLimitPerMinute": 300}'
```

**Test health endpoint:**
```bash
curl http://localhost:3000/health
```

### 🐳 Docker

```bash
docker-compose up -d
```

### 📋 Requirements

- Node.js 18.0.0 or higher
- Odoo instance (local or remote)
- npm 8.0.0 or higher

### 🔒 Security

- API keys are hashed with bcrypt
- Rate limiting to prevent abuse
- Request timeout protection
- Configurable log retention
- JWT secret for token generation

### 📄 License

MIT License - See [LICENSE](./LICENSE) file for details.

### 🆘 Support

For issues and questions:
- Check [INSTALLATION.md](./INSTALLATION.md) for installation help
- Review [MCP_CONFIG.md](./MCP_CONFIG.md) for MCP client setup
- See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for integration examples
- Open an issue on GitHub

### 🎯 What's Next

- Monitor the `/health` endpoint
- Create API keys for your applications
- Configure MCP clients (Claude Desktop, Cursor IDE)
- Integrate with your Odoo workflows

---

**Thank you for using Odoo MCP Server!** 🎉
