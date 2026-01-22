# Odoo MCP Server - Start Here

Welcome! This package contains everything you need to run the Odoo MCP Server.

## Quick Start

### Option 1: Automated Installation (Recommended)

**Linux/macOS:**
```bash
chmod +x install.sh
./install.sh
```

**Windows:**
```batch
install.bat
```

### Option 2: Manual Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Create necessary directories:
   ```bash
   mkdir -p logs data
   ```

4. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your Odoo settings
   ```

5. Start the server:
   ```bash
   npm start
   ```

## Configuration

Edit the `.env` file with your Odoo configuration:

```env
ODOO_URL=http://localhost:8069
ODOO_DATABASE=odoo
ODOO_USERNAME=admin
ODOO_PASSWORD=admin
JWT_SECRET=your-secret-key-change-in-production
```

## Documentation

- **INSTALLATION.md** - Complete installation guide
- **README.md** - Full documentation and API reference
- **MCP_CONFIG.md** - MCP client configuration
- **INTEGRATION_GUIDE.md** - Integration examples

## Support

For help and support, please refer to the documentation files or contact your vendor.

## License

MIT License - See LICENSE file for details.
