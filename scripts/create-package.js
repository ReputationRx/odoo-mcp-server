#!/usr/bin/env node

/**
 * Creates a distributable package for the Odoo MCP Server
 * This script creates a clean package ready for distribution
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const packageJson = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8')
);

const packageName = `odoo-mcp-server-${packageJson.version}`;
const distDir = path.join(rootDir, 'dist-package');
const packageDir = path.join(distDir, packageName);

// Files and directories to include in the package
const includeFiles = [
  'dist',
  'package.json',
  'LICENSE',
  'README.md',
  'INSTALLATION.md',
  'MCP_CONFIG.md',
  'INTEGRATION_GUIDE.md',
  'QUICKSTART.md',
  '.env.example',
  'install.sh',
  'install.bat',
  'Dockerfile',
  'docker-compose.yml',
  '.dockerignore',
];

// Directories to include
const includeDirs = [
  'scripts',
];

// Files to exclude
const excludePatterns = [
  /^\.git/,
  /^node_modules/,
  /^\.env$/,
  /^logs/,
  /^data/,
  /^dist-package/,
  /^\.vscode/,
  /^\.idea/,
  /\.log$/,
  /\.DS_Store$/,
];

function shouldInclude(file) {
  const name = path.basename(file);
  return !excludePatterns.some(pattern => pattern.test(name));
}

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (!shouldInclude(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

console.log('📦 Creating distributable package...');
console.log(`   Package name: ${packageName}`);
console.log('');

// Clean and create package directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(packageDir, { recursive: true });

// Copy files
console.log('📋 Copying files...');
for (const file of includeFiles) {
  const src = path.join(rootDir, file);
  const dest = path.join(packageDir, file);

  if (!fs.existsSync(src)) {
    console.log(`   ⚠️  Skipping ${file} (not found)`);
    continue;
  }

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    copyFile(src, dest);
  }
  console.log(`   ✅ ${file}`);
}

// Copy directories
for (const dir of includeDirs) {
  const src = path.join(rootDir, dir);
  const dest = path.join(packageDir, dir);

  if (fs.existsSync(src)) {
    copyDir(src, dest);
    console.log(`   ✅ ${dir}/`);
  }
}

// Make install scripts executable
if (process.platform !== 'win32') {
  const installSh = path.join(packageDir, 'install.sh');
  if (fs.existsSync(installSh)) {
    fs.chmodSync(installSh, '755');
  }
}

// Create package.json for distribution (remove devDependencies)
const distPackageJson = {
  ...packageJson,
  devDependencies: undefined,
  scripts: {
    ...packageJson.scripts,
    package: undefined,
    'package:create': undefined,
    prepublishOnly: undefined,
  },
};

fs.writeFileSync(
  path.join(packageDir, 'package.json'),
  JSON.stringify(distPackageJson, null, 2) + '\n'
);

// Create archive
console.log('');
console.log('📦 Creating archive...');

const archiveName = `${packageName}.tar.gz`;
const archivePath = path.join(distDir, archiveName);

try {
  if (process.platform === 'win32') {
    // Windows: Use PowerShell or 7zip if available
    console.log('   ⚠️  On Windows, please manually create a zip file of the package directory');
    console.log(`   📁 Package directory: ${packageDir}`);
  } else {
    // Unix: Use tar
    execSync(
      `cd "${distDir}" && tar -czf "${archiveName}" "${packageName}"`,
      { stdio: 'inherit' }
    );
    console.log(`   ✅ Created: ${archivePath}`);
  }
} catch (error) {
  console.log('   ⚠️  Could not create archive automatically');
  console.log(`   📁 Package directory: ${packageDir}`);
}

console.log('');
console.log('✅ Package created successfully!');
console.log(`   📁 Location: ${packageDir}`);
if (fs.existsSync(archivePath)) {
  console.log(`   📦 Archive: ${archivePath}`);
}
console.log('');
console.log('📝 Next steps:');
console.log('   1. Test the package by extracting it to a new location');
console.log('   2. Run install.sh (or install.bat on Windows)');
console.log('   3. Configure .env file');
console.log('   4. Start the server with npm start');
console.log('');
