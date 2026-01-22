# Quick Packaging Guide

## Create a Standalone Package

To create a distributable package ready for sale:

```bash
npm run package
```

This will:
1. Build the TypeScript code
2. Create a clean package in `dist-package/odoo-mcp-server-{version}/`
3. Generate a `.tar.gz` archive (on Unix/macOS)

## Package Contents

The created package includes everything needed for installation:
- ✅ Compiled code (ready to run)
- ✅ Installation scripts (install.sh, install.bat)
- ✅ Complete documentation
- ✅ Configuration templates
- ✅ Docker support
- ✅ License file

## Testing the Package

1. Extract the package:
   ```bash
   cd /tmp
   tar -xzf dist-package/odoo-mcp-server-1.0.0.tar.gz
   cd odoo-mcp-server-1.0.0
   ```

2. Run the installer:
   ```bash
   ./install.sh  # Linux/macOS
   # or
   install.bat   # Windows
   ```

3. Configure and test:
   ```bash
   # Edit .env with your Odoo settings
   nano .env
   
   # Start the server
   npm start
   
   # Test it
   curl http://localhost:3000/health
   ```

## Distribution

The package is ready to:
- Upload to your website
- Distribute via email
- Share on cloud storage
- Include in a CD/DVD
- Publish to npm
- Create Docker image

See [DISTRIBUTION.md](./DISTRIBUTION.md) for detailed distribution options.

## Before Selling

1. ✅ Update version in `package.json`
2. ✅ Update author/repository information
3. ✅ Test the package thoroughly
4. ✅ Review all documentation
5. ✅ Ensure LICENSE file is correct
6. ✅ Test installation on clean systems

## Customization

- **License**: Replace `LICENSE` file if using commercial license
- **Branding**: Update README with your company info
- **Support**: Add your support contact information
- **Metadata**: Update `package.json` with your details
