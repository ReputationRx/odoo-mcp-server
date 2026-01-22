# Odoo 19 Support

The Odoo MCP Server fully supports **Odoo 19** with its new JSON-RPC API endpoints, while maintaining backward compatibility with older Odoo versions.

## Odoo 19 Features

### JSON-RPC API (Odoo 19+)

Odoo 19 introduced a new RESTful JSON-RPC API endpoint format:
- **Endpoint**: `/json/2/<model>/<method>`
- **Authentication**: Bearer token (API key)
- **Content-Type**: `application/json`
- **Method**: HTTP POST

### Automatic Detection

The MCP server automatically detects your Odoo version:

1. **First, tries Odoo 19+ JSON-RPC authentication** (`/json/2/auth`)
2. **If that fails, falls back to XML-RPC** (for Odoo < 19)

This means the server works seamlessly with both:
- ✅ **Odoo 19+** (uses JSON-RPC)
- ✅ **Odoo 17, 18** (uses XML-RPC)
- ✅ **Odoo 16 and earlier** (uses XML-RPC)

## Configuration

### Using Odoo 19 API Key

For Odoo 19+, you can use an API key instead of a password:

```env
ODOO_URL=http://localhost:8069
ODOO_DATABASE=odoo
ODOO_USERNAME=admin
ODOO_PASSWORD=your-api-key-here
# OR
ODOO_API_KEY=your-api-key-here
```

### Getting an API Key in Odoo 19

1. Log into Odoo 19
2. Go to **Settings** → **Users & Companies** → **Users**
3. Select your user
4. Go to **API Keys** tab
5. Click **Generate API Key**
6. Copy the key and use it as `ODOO_PASSWORD` or `ODOO_API_KEY`

## API Differences

### Odoo 19+ (JSON-RPC)

```typescript
// Authentication
POST /json/2/auth
{
  "db": "odoo",
  "login": "admin",
  "password": "api-key"
}

// Execute method
POST /json/2/res.partner/search_read
Authorization: Bearer <access_token>
{
  "args": [[["name", "ilike", "test"]]],
  "kwargs": {"fields": ["name", "email"], "limit": 10}
}
```

### Odoo < 19 (XML-RPC)

```typescript
// Uses traditional XML-RPC endpoints
POST /xmlrpc/2/common (authentication)
POST /xmlrpc/2/object (method execution)
```

## Benefits of Odoo 19 Support

1. **Modern API**: RESTful JSON endpoints instead of XML-RPC
2. **Better Performance**: JSON is more efficient than XML
3. **Bearer Token Auth**: More secure than password-based auth
4. **HTTP Status Codes**: Proper HTTP error codes
5. **Easier Debugging**: JSON responses are easier to read

## Testing Odoo 19 Connection

### Check if JSON-RPC is being used:

```bash
# The server will log which protocol it's using
# Look for: "Odoo 19+ detected, using JSON-RPC API"
```

### Manual Test:

```bash
# Test Odoo 19 authentication
curl -X POST http://localhost:8069/json/2/auth \
  -H "Content-Type: application/json" \
  -d '{
    "db": "odoo",
    "login": "admin",
    "password": "your-api-key"
  }'
```

## Migration Notes

- **No code changes needed**: The server automatically detects and uses the appropriate protocol
- **Backward compatible**: Works with all Odoo versions
- **API keys recommended**: For Odoo 19+, use API keys instead of passwords for better security

## Troubleshooting

### JSON-RPC Not Working?

1. **Verify Odoo version**: Check that you're running Odoo 19+
2. **Check API key**: Ensure you're using a valid API key (not password)
3. **Check endpoint**: Verify `/json/2/auth` is accessible
4. **Check logs**: The server will log which protocol it's using

### Fallback to XML-RPC

If JSON-RPC fails, the server automatically falls back to XML-RPC. You'll see a log message:
```
JSON-RPC not available, falling back to XML-RPC
```

This ensures compatibility with all Odoo versions.
