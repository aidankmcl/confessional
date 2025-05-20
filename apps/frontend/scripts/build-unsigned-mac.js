#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Set encoding for console output
process.env.FORCE_COLOR = '1';

// Utility function to run a command and log output
function runCommand(command, options = {}) {
  console.log(`\x1b[36m> ${command}\x1b[0m`);
  try {
    return execSync(command, {
      stdio: 'inherit',
      ...options
    });
  } catch (error) {
    console.error(`\x1b[31mCommand failed: ${command}\x1b[0m`);
    throw error;
  }
}

// Ensure backend is built first
console.log('\x1b[33m===== Building Backend =====\x1b[0m');
runCommand('cd ../backend && npm run build');

// Create a clean out directory
const outDir = path.resolve(__dirname, '../out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Build for macOS without signing
console.log('\x1b[33m===== Building unsigned Mac app =====\x1b[0m');

// Ensure any signing env vars are cleared
process.env.APPLE_IDENTITY = '';
process.env.APPLE_ID = '';
process.env.APPLE_PASSWORD = '';
process.env.APPLE_TEAM_ID = '';

try {
  // Use --skip-signing to explicitly disable signing
  runCommand('electron-forge package --platform=darwin');
  
  console.log('\x1b[32m===== Packaging as ZIP for easy distribution =====\x1b[0m');
  runCommand('electron-forge make --platform=darwin --targets=@electron-forge/maker-zip');
  
  console.log('\x1b[32mSuccessfully built unsigned Mac app!\x1b[0m');
  console.log('\x1b[33mYou can find the app in the out/Confessional-darwin-*/Confessional.app directory\x1b[0m');
  console.log('\x1b[33mand the ZIP file in out/make/zip/darwin/x64/\x1b[0m');
} catch (error) {
  console.error(`\x1b[31mFailed to build. Error: ${error.message}\x1b[0m`);
  process.exit(1);
}