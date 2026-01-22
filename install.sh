#!/bin/bash

# Odoo MCP Server Installation Script
# This script installs and sets up the Odoo MCP Server

set -e

echo "========================================="
echo "Odoo MCP Server - Installation"
echo "========================================="
echo ""

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build the project
echo "🔨 Building the project..."
npm run build

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs data

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "⚠️  Please edit .env file with your Odoo configuration"
    else
        echo "⚠️  .env.example not found. Please create .env manually."
    fi
else
    echo "✅ .env file already exists"
fi

echo ""
echo "========================================="
echo "✅ Installation completed successfully!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file with your Odoo configuration"
echo "2. Run 'npm start' to start the server"
echo "3. Or run 'npm run dev' for development mode"
echo ""
echo "For more information, see INSTALLATION.md"
