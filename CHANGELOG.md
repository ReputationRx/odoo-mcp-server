# Changelog

All notable changes to the Odoo MCP Server will be documented in this file.

## [1.0.0] - 2025-01-20

### Added
- Initial release of Odoo MCP Server
- Full MCP protocol implementation with stdio transport
- Express API server for HTTP access
- API key authentication with bcrypt hashing
- Rate limiting with configurable limits per API key
- Request logging with SQLite storage and file rotation
- Request timeout protection
- Odoo XML-RPC/JSON-RPC client integration
- CRUD operations for Odoo models
- Model field discovery
- Docker and Docker Compose support
- Health check endpoints
- Comprehensive logging with Winston
- Configuration management via environment variables
- API endpoints for:
  - API key management
  - Model operations
  - Request logs and statistics
  - Server configuration

### Features
- Production-ready error handling
- Graceful shutdown
- TypeScript for type safety
- SQLite database for API keys and logs
- Daily log rotation with retention policy
- Rate limit headers in responses
- Request ID tracking
