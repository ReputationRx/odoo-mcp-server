@echo off
REM Odoo MCP Server Installation Script for Windows

echo =========================================
echo Odoo MCP Server - Installation
echo =========================================
echo.

REM Check Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18 or higher.
    echo        Visit: https://nodejs.org/
    exit /b 1
)

echo [OK] Node.js detected
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
call npm install --production
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

REM Build the project
echo [INFO] Building the project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to build project
    exit /b 1
)

REM Create necessary directories
echo [INFO] Creating necessary directories...
if not exist logs mkdir logs
if not exist data mkdir data

REM Check if .env exists
if not exist .env (
    echo [INFO] Creating .env file from template...
    if exist .env.example (
        copy .env.example .env
        echo [WARNING] Please edit .env file with your Odoo configuration
    ) else (
        echo [WARNING] .env.example not found. Please create .env manually.
    )
) else (
    echo [OK] .env file already exists
)

echo.
echo =========================================
echo [OK] Installation completed successfully!
echo =========================================
echo.
echo Next steps:
echo 1. Edit .env file with your Odoo configuration
echo 2. Run 'npm start' to start the server
echo 3. Or run 'npm run dev' for development mode
echo.
echo For more information, see INSTALLATION.md
pause
