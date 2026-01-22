# Odoo MCP Server - Complete Capabilities Guide

## Overview

The Odoo MCP Server provides comprehensive access to your Odoo instance through the Model Context Protocol (MCP) and REST API. Here's everything you can do with it.

---

## 🎯 Core Capabilities

### 1. **Full CRUD Operations on Any Odoo Model**

You can perform complete Create, Read, Update, and Delete operations on **any Odoo model**:

#### ✅ **Search & Read Records**
- Search with complex domain filters
- Retrieve specific fields
- Pagination support (limit/offset)
- Custom sorting
- Works with all Odoo models (Partners, Sales Orders, Invoices, Products, etc.)

#### ✅ **Create Records**
- Create new records in any model
- Set any field values
- Handle relationships (Many2one, One2many, Many2many)
- Automatic validation and constraints

#### ✅ **Update Records**
- Update single or multiple records
- Partial updates (only changed fields)
- Bulk operations supported

#### ✅ **Delete Records**
- Delete single or multiple records
- Cascade deletion handled by Odoo

---

## 🔧 MCP Tools Available

When using the MCP server with AI assistants (Claude, Cursor, etc.), you have access to these tools:

### 1. `odoo_search_records`
**Search and retrieve records from any Odoo model**

**Example Use Cases:**
- Find customers by name, email, or other criteria
- List all open sales orders
- Search products by category or price range
- Find invoices by date range
- Query any model with complex filters

**Parameters:**
- `model`: Odoo model name (e.g., `res.partner`, `sale.order`)
- `domain`: Search filters (e.g., `[["name", "ilike", "test"]]`)
- `fields`: Fields to retrieve (e.g., `["name", "email", "phone"]`)
- `limit`: Maximum records (1-1000)
- `offset`: Pagination offset
- `order`: Sort order (e.g., `"name asc"`)

### 2. `odoo_create_record`
**Create new records in any Odoo model**

**Example Use Cases:**
- Create new customers/partners
- Create sales orders
- Create invoices
- Create products
- Create any type of record in Odoo

**Parameters:**
- `model`: Odoo model name
- `values`: Object with field values

### 3. `odoo_update_record`
**Update existing records**

**Example Use Cases:**
- Update customer information
- Modify sales order status
- Update product prices
- Change invoice details
- Bulk update records

**Parameters:**
- `model`: Odoo model name
- `ids`: Array of record IDs to update
- `values`: Object with fields to update

### 4. `odoo_delete_record`
**Delete records from Odoo**

**Example Use Cases:**
- Remove obsolete records
- Clean up test data
- Delete draft documents

**Parameters:**
- `model`: Odoo model name
- `ids`: Array of record IDs to delete

### 5. `odoo_get_model_fields`
**Get field definitions for a model**

**Example Use Cases:**
- Discover available fields on a model
- Understand field types and relationships
- Build dynamic forms
- Validate field names before operations

**Parameters:**
- `model`: Odoo model name

### 6. `odoo_list_models`
**List all available Odoo models**

**Example Use Cases:**
- Discover what models are available
- Find model names for operations
- Explore Odoo structure

---

## 📊 Supported Odoo Modules & Models

The MCP server works with **ALL Odoo models**, including:

### **CRM & Sales**
- `crm.lead` - Leads/Opportunities
- `sale.order` - Sales Orders
- `sale.order.line` - Order Lines
- `res.partner` - Customers/Vendors
- `product.product` - Products
- `product.template` - Product Templates

### **Accounting**
- `account.move` - Invoices/Bills
- `account.payment` - Payments
- `account.journal` - Journals
- `account.account` - Chart of Accounts

### **Inventory**
- `stock.picking` - Stock Transfers
- `stock.move` - Stock Moves
- `stock.quant` - Stock Quantities
- `stock.location` - Warehouses/Locations

### **Purchase**
- `purchase.order` - Purchase Orders
- `purchase.order.line` - Purchase Order Lines

### **Project Management**
- `project.project` - Projects
- `project.task` - Tasks
- `project.milestone` - Milestones

### **HR**
- `hr.employee` - Employees
- `hr.department` - Departments
- `hr.leave` - Leave Requests

### **Manufacturing**
- `mrp.production` - Manufacturing Orders
- `mrp.bom` - Bills of Materials

### **And Many More!**
Any model in your Odoo instance is accessible, including:
- Custom modules
- Third-party apps
- Standard Odoo modules

---

## 🌐 REST API Endpoints

In addition to MCP tools, you have a full REST API:

### **Model Operations**
```
GET    /api/models                    # List all models
GET    /api/models/:model/fields     # Get model fields
POST   /api/models/:model/search     # Search records
POST   /api/models/:model/create     # Create record
PUT    /api/models/:model/:id        # Update record
DELETE /api/models/:model/:id        # Delete record
```

### **API Key Management**
```
POST   /api/api-keys                  # Create API key
GET    /api/api-keys                  # List API keys
GET    /api/api-keys/:id              # Get API key details
POST   /api/api-keys/:id/revoke       # Revoke API key
DELETE /api/api-keys/:id              # Delete API key
```

### **Logging & Monitoring**
```
GET    /api/logs                      # Get request logs
GET    /api/logs/stats                # Get log statistics
GET    /api/config                    # Get server configuration
GET    /health                        # Health check
```

---

## 💡 Real-World Use Cases

### **1. AI-Powered Customer Service**
- AI assistant searches customer records
- Updates customer information
- Creates support tickets
- Checks order status

### **2. Sales Automation**
- Create sales orders from AI conversations
- Update order statuses
- Generate quotes automatically
- Track sales pipeline

### **3. Inventory Management**
- Check stock levels via AI
- Create stock transfers
- Update product information
- Manage warehouses

### **4. Accounting Integration**
- Generate invoices from conversations
- Update payment status
- Query financial reports
- Manage accounts

### **5. Data Analysis & Reporting**
- Query any Odoo data
- Generate custom reports
- Analyze business metrics
- Export data for analysis

### **6. Workflow Automation**
- Trigger actions from external systems
- Integrate with other tools
- Automate repetitive tasks
- Sync data between systems

---

## 🔍 Advanced Search Capabilities

### **Domain Filters**
Odoo's powerful domain syntax is fully supported:

```python
# Simple filters
[["name", "=", "John"]]
[["amount_total", ">", 1000]]

# Multiple conditions
["&", ["name", "ilike", "test"], ["active", "=", True]]

# Complex queries
["|", "&", ["date", ">=", "2024-01-01"], ["state", "=", "draft"],
         ["user_id", "=", 5]]
```

### **Field Selection**
Retrieve only needed fields for efficiency:
```json
{
  "fields": ["name", "email", "phone", "street"]
}
```

### **Pagination**
Handle large datasets:
```json
{
  "limit": 100,
  "offset": 0
}
```

### **Sorting**
Custom sort orders:
```json
{
  "order": "date desc, name asc"
}
```

---

## 🔐 Security Features

### **API Key Authentication**
- Secure API key management
- Bcrypt hashing
- Per-key rate limits
- Expiration dates

### **Rate Limiting**
- Configurable per API key
- Default: 300 requests/minute
- Prevents abuse
- Headers show remaining requests

### **Request Logging**
- All requests logged
- Configurable retention (default: 30 days)
- Audit trail
- Error tracking

### **Request Timeout**
- Configurable timeout (default: 30s)
- Prevents resource exhaustion
- Automatic cleanup

---

## 🚀 Integration Options

### **1. MCP Protocol (AI Assistants)**
- Claude Desktop
- Cursor IDE
- Any MCP-compatible client
- Direct AI-to-Odoo communication

### **2. REST API**
- HTTP/HTTPS access
- Any programming language
- Webhooks
- External integrations

### **3. Docker**
- Containerized deployment
- Easy scaling
- Production-ready

---

## 📈 Performance & Scalability

### **Efficient Operations**
- Batch operations supported
- Field selection reduces data transfer
- Pagination for large datasets
- Connection pooling

### **Odoo 19 Support**
- Uses JSON-RPC (faster than XML-RPC)
- Bearer token authentication
- Modern API endpoints
- Automatic version detection

### **Backward Compatible**
- Works with Odoo 17, 18, 19+
- Auto-detects version
- Falls back gracefully

---

## 🎨 Example Scenarios

### **Scenario 1: AI Assistant Managing Customers**
```
User: "Find all customers in New York"
AI: Uses odoo_search_records with domain [["city", "=", "New York"]]

User: "Update John Doe's email to john@example.com"
AI: Uses odoo_search_records to find ID, then odoo_update_record

User: "Create a new customer named Acme Corp"
AI: Uses odoo_create_record with customer data
```

### **Scenario 2: Automated Order Processing**
```
1. External system sends webhook
2. MCP server creates sales order
3. Updates inventory
4. Generates invoice
5. Sends confirmation
```

### **Scenario 3: Data Synchronization**
```
1. Query source system
2. Transform data
3. Create/update Odoo records
4. Log all operations
5. Handle errors gracefully
```

---

## 🛠️ Customization & Extension

### **Custom Models**
- Works with custom Odoo modules
- No code changes needed
- Automatic discovery

### **Custom Fields**
- All custom fields accessible
- Field discovery via `odoo_get_model_fields`
- Dynamic field handling

### **Workflow Integration**
- Trigger Odoo workflows
- Call custom methods
- Execute any Odoo operation

---

## 📚 What You CAN Do

✅ Access any Odoo model  
✅ Perform CRUD operations  
✅ Complex search queries  
✅ Batch operations  
✅ Field discovery  
✅ Model discovery  
✅ Work with relationships  
✅ Handle all field types  
✅ Use with AI assistants  
✅ Integrate via REST API  
✅ Secure authentication  
✅ Rate limiting  
✅ Request logging  
✅ Odoo 17, 18, 19+ support  
✅ Custom modules support  

## ⚠️ What You CANNOT Do

❌ Direct database access (by design - uses Odoo API)  
❌ Bypass Odoo security rules (respects user permissions)  
❌ Execute arbitrary Python code (security)  
❌ Access Odoo internals directly  

---

## 🎯 Best Practices

1. **Use Field Selection**: Only retrieve needed fields
2. **Implement Pagination**: For large datasets
3. **Handle Errors**: Check responses and errors
4. **Use API Keys**: Not passwords in production
5. **Monitor Logs**: Track usage and errors
6. **Set Rate Limits**: Prevent abuse
7. **Use Odoo 19**: For better performance

---

## 📞 Getting Started

1. **Install**: `npm install` in the project directory
2. **Configure**: Set up `.env` with Odoo credentials
3. **Create API Key**: `npm run create-admin-key`
4. **Start Server**: `npm start`
5. **Use Tools**: Connect via MCP or REST API

For detailed setup, see [QUICKSTART.md](./QUICKSTART.md)

---

## 🔗 Related Documentation

- [README.md](./README.md) - Full documentation
- [QUICKSTART.md](./QUICKSTART.md) - Quick setup guide
- [MCP_CONFIG.md](./MCP_CONFIG.md) - MCP client configuration
- [ODOO19_SUPPORT.md](./ODOO19_SUPPORT.md) - Odoo 19 specific features

---

**The Odoo MCP Server gives you complete programmatic access to your Odoo instance through a secure, production-ready interface!**
