# Distribution Guide

This guide explains how to create and distribute the Odoo MCP Server as a standalone package.

## Creating a Distributable Package

### Step 1: Build the Package

```bash
npm run package
```

This command will:
1. Build the TypeScript code
2. Create a clean package directory
3. Include only necessary files
4. Create a `.tar.gz` archive (on Unix systems)

### Step 2: Package Location

The package will be created in:
- **Directory**: `dist-package/odoo-mcp-server-{version}/`
- **Archive**: `dist-package/odoo-mcp-server-{version}.tar.gz` (Unix)

### Step 3: Package Contents

The package includes:
- ✅ Compiled JavaScript (`dist/`)
- ✅ `package.json` (without devDependencies)
- ✅ Installation scripts (`install.sh`, `install.bat`)
- ✅ Documentation (README, INSTALLATION, etc.)
- ✅ Configuration templates (`.env.example`)
- ✅ Docker files
- ✅ License file

Excluded:
- ❌ Source TypeScript files
- ❌ Development dependencies
- ❌ Test files
- ❌ Git files
- ❌ Logs and data directories

## Distribution Methods

### 1. Direct File Distribution

Distribute the package directory or archive directly:
- Upload to your website
- Send via email
- Share via cloud storage
- Include in a CD/DVD

### 2. NPM Package

Publish to npm (public or private):

```bash
# Login to npm
npm login

# Publish (public)
npm publish

# Or publish to private registry
npm publish --registry=https://your-registry.com
```

### 3. Docker Image

Build and distribute as Docker image:

```bash
# Build image
docker build -t odoo-mcp-server:latest .

# Tag for registry
docker tag odoo-mcp-server:latest your-registry/odoo-mcp-server:latest

# Push to registry
docker push your-registry/odoo-mcp-server:latest
```

### 4. GitHub Releases

1. Create a release on GitHub
2. Upload the package archive
3. Add release notes
4. Tag the version

### 5. Self-Hosted Download

Host the package on your own server:
- Create a download page
- Provide installation instructions
- Include license information

## Pre-Distribution Checklist

Before distributing, ensure:

- [ ] Version number is updated in `package.json`
- [ ] `LICENSE` file is included
- [ ] `README.md` is up to date
- [ ] `INSTALLATION.md` is complete
- [ ] `.env.example` has all required variables
- [ ] Installation scripts are tested
- [ ] Package builds successfully
- [ ] All dependencies are compatible
- [ ] Documentation is clear and accurate

## Customization for Commercial Distribution

### Update Package Metadata

Edit `package.json`:
```json
{
  "name": "@yourcompany/odoo-mcp-server",
  "author": "Your Company <support@yourcompany.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourcompany/odoo-mcp-server.git"
  }
}
```

### Add Commercial License

If selling with a commercial license:
1. Replace `LICENSE` with your commercial license
2. Update `package.json` license field
3. Add license validation if needed

### Add Branding

- Update README with your company branding
- Add your logo
- Include support contact information
- Add purchase/license information

### Add License Key System (Optional)

For license validation:
1. Implement license key validation
2. Add license check on startup
3. Include license key in distribution

## Testing the Package

Before distribution, test the package:

1. **Extract to a clean location**:
   ```bash
   cd /tmp
   tar -xzf odoo-mcp-server-1.0.0.tar.gz
   cd odoo-mcp-server-1.0.0
   ```

2. **Run installation**:
   ```bash
   ./install.sh  # or install.bat on Windows
   ```

3. **Configure and test**:
   ```bash
   # Edit .env
   nano .env
   
   # Start server
   npm start
   
   # Test health endpoint
   curl http://localhost:3000/health
   ```

4. **Verify all features work**:
   - API endpoints
   - MCP protocol
   - Odoo connection
   - Authentication
   - Rate limiting

## Version Management

### Semantic Versioning

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Update Version

```bash
# Update version in package.json
npm version patch  # or minor, major
```

This will:
- Update version in `package.json`
- Create a git tag (if in git repo)
- Can be used with `npm publish`

## Support and Documentation

Include in your distribution:

1. **Installation Guide**: `INSTALLATION.md`
2. **User Manual**: Updated `README.md`
3. **API Documentation**: API endpoint documentation
4. **MCP Configuration**: `MCP_CONFIG.md`
5. **Troubleshooting**: Common issues and solutions
6. **Support Contact**: How to get help

## Legal Considerations

When distributing:

1. **License Compliance**: Include all required license notices
2. **Third-Party Licenses**: Include licenses for dependencies
3. **Copyright**: Include copyright notices
4. **Terms of Service**: If applicable, include ToS
5. **Privacy Policy**: If collecting data, include privacy policy

## Example Distribution Structure

```
odoo-mcp-server-1.0.0/
├── dist/                    # Compiled code
├── scripts/                 # Utility scripts
├── package.json            # Package metadata
├── LICENSE                 # License file
├── README.md               # Main documentation
├── INSTALLATION.md         # Installation guide
├── MCP_CONFIG.md          # MCP client setup
├── INTEGRATION_GUIDE.md   # Integration examples
├── .env.example           # Configuration template
├── install.sh             # Unix installer
├── install.bat            # Windows installer
├── Dockerfile            # Docker image
└── docker-compose.yml    # Docker Compose
```

## Next Steps

1. Test the package thoroughly
2. Create distribution materials (website, marketing)
3. Set up support channels
4. Prepare pricing/licensing model
5. Launch distribution
