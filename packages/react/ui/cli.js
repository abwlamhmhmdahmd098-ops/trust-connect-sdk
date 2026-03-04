#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(`
Trust Connect UI CLI

Usage:
  npx @trustwallet/connect-ui add [options]

Commands:
  add              Copy UI components to your project

Options:
  --path <path>    Destination path (default: ./src/trustConnect)
  --help           Show this help message

Examples:
  npx @trustwallet/connect-ui add
  npx @trustwallet/connect-ui add --path ./src/components/trust
  `);
}

function copyRecursiveSync(src, dest) {
  const exists = existsSync(src);
  const stats = exists && statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }
    readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(join(src, childItemName), join(dest, childItemName));
    });
  } else {
    copyFileSync(src, dest);
  }
}

function installDependencies() {
  console.log('\n📦 Installing dependencies...');

  const dependencies = [
    '@trustwallet/connect-ui-logic',
    'cuer@0.0.3'
  ];

  try {
    // Check if package.json exists
    if (!existsSync('./package.json')) {
      console.error('❌ No package.json found in current directory');
      process.exit(1);
    }

    // Detect package manager
    let packageManager = 'npm';
    if (existsSync('./pnpm-lock.yaml')) {
      packageManager = 'pnpm';
    } else if (existsSync('./yarn.lock')) {
      packageManager = 'yarn';
    }

    console.log(`   Using ${packageManager}...`);

    const installCommand = packageManager === 'yarn'
      ? `yarn add ${dependencies.join(' ')}`
      : `${packageManager} install ${dependencies.join(' ')}`;

    execSync(installCommand, { stdio: 'inherit' });

    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    console.log('\n💡 You can manually install the dependencies:');
    console.log(`   npm install ${dependencies.join(' ')}`);
  }
}

function add() {
  const pathIndex = args.indexOf('--path');
  const customPath = pathIndex !== -1 ? args[pathIndex + 1] : null;
  const destPath = customPath || './src/trustConnect';

  console.log('🚀 Adding Trust Connect UI components...\n');

  // Source directory
  const srcDir = join(__dirname, 'src');

  if (!existsSync(srcDir)) {
    console.error('❌ Source directory not found');
    process.exit(1);
  }

  // Destination directory
  const fullDestPath = join(process.cwd(), destPath);

  if (existsSync(fullDestPath)) {
    console.log(`⚠️  Directory ${destPath} already exists. Files will be overwritten.`);
  }

  try {
    console.log(`📁 Copying files to ${destPath}...`);
    copyRecursiveSync(srcDir, fullDestPath);
    console.log('✅ Files copied successfully\n');

    installDependencies();

    console.log('\n✨ Installation complete!');
    console.log('\nNext steps:');
    console.log(`  1. Import components from "${destPath}"`);
    console.log('  2. Make sure you have react and react-dom installed');
    console.log('\nExample:');
    console.log(`  import { TrustModal } from '${destPath}/ui/TrustModal';`);

  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    process.exit(1);
  }
}

// Main
if (!command || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

if (command === 'add') {
  add();
} else {
  console.error(`Unknown command: ${command}`);
  showHelp();
  process.exit(1);
}
