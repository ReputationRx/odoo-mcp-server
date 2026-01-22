# Odoo Manifest File Guide

## Overview

The `__manifest__.py` file has been created for Odoo Apps Store submission. However, **this is a standalone Node.js MCP server, not a traditional Odoo Python module**.

## Important Notes

### Current Situation
- This is a **standalone Node.js/TypeScript application**
- It runs as a separate server (not inside Odoo)
- It connects to Odoo via XML-RPC/JSON-RPC APIs
- It cannot be installed as a traditional Odoo module

### Options for Odoo Apps Store

#### Option 1: Create an Odoo Module Wrapper
Create a Python Odoo module that:
- Installs and manages the Node.js MCP server
- Provides Odoo UI for configuration
- Integrates the MCP server with Odoo
- Uses the manifest file for Apps Store submission

#### Option 2: Use as Documentation
Use the manifest file as:
- Documentation reference
- Template for future Odoo module development
- Metadata for GitHub/GitLab repository

#### Option 3: Standalone Distribution
Keep as standalone product:
- Distribute via GitHub releases
- Sell directly from your website
- Publish to npm
- Use Docker Hub

## Manifest File Configuration

### Required Fields (Already Set)

```python
'name': 'Odoo MCP Server',  # Max 25 characters, no adjectives
'version': '17.0.1.0.0',     # Format: ODOO_VERSION.MAJOR.MINOR.PATCH
'license': 'LGPL-3',         # LGPL-3 for open source, OPL-1 for proprietary
'depends': ['base'],          # Required dependencies
```

### Pricing Configuration

To set pricing, update these fields:

```python
'price': 0.0,        # Price in EUR (minimum 9 EUR for paid apps)
'currency': 'EUR',   # EUR or USD
```

**Examples:**
- Free app: `'price': 0.0` or `'price': -1`
- Paid app (€29): `'price': 29.0`
- Paid app ($49): `'price': 49.0, 'currency': 'USD'`

### Support Configuration

```python
'support': 'support@yourcompany.com',  # Support email
```

### Optional Fields

```python
'summary': 'Short description (max ~100 chars)',
'website': 'https://yourwebsite.com',
'live_test_url': 'https://demo.yourwebsite.com',  # Demo instance URL
'maintainers': ['Your Name'],  # List of maintainers
```

## Creating App Description Page

Odoo Apps Store uses `static/description/index.html` for the app description page.

### Required Structure

```
your-module/
├── __manifest__.py
└── static/
    └── description/
        ├── index.html      # App description page
        ├── icon.png        # App icon (128x128)
        └── banner.png      # Banner image (optional)
```

### Description Page Guidelines

From Odoo vendor guidelines:
- ✅ Must be in English
- ✅ Must be accurate and not misleading
- ✅ Can use YouTube links (canonical format)
- ✅ Can use `mailto:` and `skype:` links
- ❌ Cannot link to other app stores
- ❌ Cannot include promotions/ads
- ❌ Cannot inject JavaScript
- ❌ Cannot use harmful styles

## If Creating an Odoo Module Wrapper

If you want to create an actual Odoo module that wraps this MCP server:

### 1. Module Structure

```
odoo_mcp_server/
├── __manifest__.py
├── __init__.py
├── models/
│   ├── __init__.py
│   └── mcp_server_config.py
├── views/
│   └── mcp_server_views.xml
├── static/
│   └── description/
│       ├── index.html
│       └── icon.png
└── scripts/
    └── install_mcp_server.sh
```

### 2. Module Features

The Odoo module could:
- Install Node.js and npm dependencies
- Download and install the MCP server
- Provide Odoo UI for configuration
- Manage MCP server lifecycle (start/stop)
- Display logs and status
- Handle updates

### 3. Installation Script

The module could include a script that:
```bash
# Downloads the MCP server
# Installs Node.js dependencies
# Configures the server
# Starts the service
```

## Current Manifest Configuration

The current `__manifest__.py` is configured as:

- **Name**: Odoo MCP Server (23 characters - within limit)
- **Version**: 17.0.1.0.0 (for Odoo 17)
- **License**: LGPL-3 (open source)
- **Price**: 0.0 (free)
- **Category**: Tools
- **Dependencies**: base module

## Updating the Manifest

### For Paid App

```python
'price': 29.0,        # €29
'currency': 'EUR',
'support': 'support@yourcompany.com',
```

### For Different Odoo Version

```python
'version': '18.0.1.0.0',  # For Odoo 18
'version': '19.0.1.0.0',  # For Odoo 19
```

### For Proprietary License

```python
'license': 'OPL-1',  # Odoo Proprietary License
```

## Next Steps

1. **Decide Distribution Method**:
   - Standalone (current) - GitHub, npm, direct sales
   - Odoo Module Wrapper - Create Python module
   - Both - Offer both options

2. **If Going Odoo Apps Store Route**:
   - Create Odoo module wrapper
   - Create `static/description/index.html`
   - Add app icon and images
   - Test installation
   - Submit to Odoo Apps Store

3. **If Staying Standalone**:
   - Use manifest as reference
   - Focus on GitHub/npm distribution
   - Create marketing materials
   - Set up direct sales

## Recommendations

For this MCP server, I recommend:

1. **Primary**: Standalone distribution (GitHub, npm, direct)
   - More flexible
   - Easier to maintain
   - Better for Node.js ecosystem

2. **Secondary**: Create Odoo module wrapper (optional)
   - If you want Odoo Apps Store presence
   - Provides Odoo UI integration
   - Easier for Odoo-only users

3. **Documentation**: Keep manifest file
   - Useful reference
   - Template for future modules
   - Metadata documentation

---

**The manifest file is ready!** Update the pricing, support email, and other fields as needed.
