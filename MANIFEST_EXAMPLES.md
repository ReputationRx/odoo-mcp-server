# Manifest File Examples

## Example 1: Free Open Source App

```python
{
    'name': 'Odoo MCP Server',
    'version': '17.0.1.0.0',
    'license': 'LGPL-3',
    'price': 0.0,  # Free
    'currency': 'EUR',
    'support': 'support@yourcompany.com',
}
```

## Example 2: Paid App (€29)

```python
{
    'name': 'Odoo MCP Server',
    'version': '17.0.1.0.0',
    'license': 'OPL-1',  # Proprietary license
    'price': 29.0,  # €29
    'currency': 'EUR',
    'support': 'support@yourcompany.com',
}
```

## Example 3: Paid App ($49 USD)

```python
{
    'name': 'Odoo MCP Server',
    'version': '17.0.1.0.0',
    'license': 'OPL-1',
    'price': 49.0,  # $49
    'currency': 'USD',
    'support': 'support@yourcompany.com',
}
```

## Example 4: Premium App (€99)

```python
{
    'name': 'Odoo MCP Server Pro',
    'version': '17.0.2.0.0',
    'license': 'OPL-1',
    'price': 99.0,  # €99
    'currency': 'EUR',
    'support': 'premium-support@yourcompany.com',
    'summary': 'Advanced MCP server with premium features',
}
```

## Example 5: Beta Version

```python
{
    'name': 'Odoo MCP Server',
    'version': '17.0.0.9.0',  # Version < 1.0.0 indicates beta
    'license': 'LGPL-3',
    'price': 0.0,
    'currency': 'EUR',
    'support': 'support@yourcompany.com',
    'summary': 'Beta version - MCP server for Odoo integration',
}
```

## Complete Example with All Fields

```python
{
    'name': 'Odoo MCP Server',
    'version': '17.0.1.0.0',
    'category': 'Tools',
    'summary': 'MCP server for Odoo AI integration',
    'description': """
    Full description here...
    """,
    'author': 'Your Company Name',
    'website': 'https://github.com/yourusername/odoo-mcp-server',
    'license': 'LGPL-3',
    'depends': ['base'],
    'external_dependencies': {
        'python': [],
        'bin': ['node'],
    },
    'data': [],
    'demo': [],
    'installable': True,
    'application': False,
    'auto_install': False,
    'price': 29.0,
    'currency': 'EUR',
    'support': 'support@yourcompany.com',
    'images': [
        'static/description/icon.png',
    ],
    'live_test_url': 'https://demo.yourcompany.com',
    'maintainers': [
        'Your Name',
    ],
}
```

## Version Numbering Guide

Odoo version format: `ODOO_VERSION.MAJOR.MINOR.PATCH`

- **Odoo 17**: `17.0.1.0.0`
- **Odoo 18**: `18.0.1.0.0`
- **Odoo 19**: `19.0.1.0.0`

For updates:
- Bug fix: `17.0.1.0.1`
- New feature: `17.0.1.1.0`
- Major update: `17.0.2.0.0`

## Pricing Guidelines

- **Minimum price**: 9 EUR/USD for paid apps
- **Free apps**: Set `price: 0.0` or `price: -1`
- **Currency**: Only EUR or USD allowed
- **Price consistency**: Must match or be lower than other platforms

## License Options

- **LGPL-3**: For open source apps (recommended for open source)
- **OPL-1**: For proprietary/commercial apps
- **Other**: Any license that respects dependencies

## Support Email

- Only visible to customers who purchase the app
- Should be a working email address
- Used for support requests and claims
- Required for paid apps

---

Update the manifest file with your specific values!
