# -*- coding: utf-8 -*-
{
    'name': 'Odoo MCP Server',
    'version': '19.0.1.0.0',
    'category': 'Tools',
    'summary': 'MCP server for Odoo 19 AI integration',
    'description': """
Odoo MCP Server
==============

A production-ready Model Context Protocol (MCP) server that enables seamless integration 
between Odoo and AI assistants like Claude, Cursor IDE, and other MCP-compatible tools.

Key Features:
-------------
* Full MCP Protocol Support - Complete implementation of Model Context Protocol
* REST API Access - HTTP REST API for remote access to Odoo
* API Key Authentication - Secure API key-based authentication with bcrypt hashing
* Rate Limiting - Configurable rate limiting per API key (default: 300 requests/minute)
* Request Logging - Comprehensive request/response logging with configurable retention
* Full CRUD Operations - Create, Read, Update, Delete operations on any Odoo model
* Odoo 19 Optimized - Native support for Odoo 19's JSON-RPC API
* Backward Compatible - Also works with Odoo 17 and 18 (auto-detects version)
* Model Management - List and manage available Odoo models
* Production Ready - Docker support, health checks, graceful shutdown, error handling

Use Cases:
----------
* Integrate Odoo with AI assistants (Claude Desktop, Cursor IDE)
* Automate Odoo operations via MCP protocol
* Access Odoo data through REST API
* Build custom integrations with Odoo
* Enable AI-powered Odoo workflows

Technical Details:
------------------
* Built with TypeScript and Node.js
* Uses Express.js for REST API
* Supports XML-RPC and JSON-RPC protocols
* Includes Docker support for easy deployment
* Full TypeScript typing for better developer experience

Installation:
-------------
This is a standalone Node.js server. Installation instructions are provided in the 
package documentation. Requires Node.js 18+ and an Odoo instance.

For detailed installation and configuration, see the INSTALLATION.md file included 
in the package.
    """,
    'author': 'Crazy_Thinkerer',
    'website': 'https://github.com/yourusername/odoo-mcp-server',
    'license': 'LGPL-3',
    'depends': [
        'base',
    ],
    'external_dependencies': {
        'python': [],
        'bin': ['node'],
    },
    'data': [],
    'demo': [],
    'installable': True,
    'application': False,
    'auto_install': False,
    'price': 97.0,  # $97 USD
    'currency': 'USD',  # EUR or USD
    'support': 'support@yourcompany.com',  # Support email address
                                            # This email is only visible to customers who purchase the app
    'images': [
        # Add paths to your app images/thumbnails
        # 'static/description/icon.png',
        # 'static/description/banner.png',
    ],
    'live_test_url': '',  # Optional: URL to demo instance
    'maintainers': [
        # Add maintainer names
        # 'Your Name',
    ],
}
