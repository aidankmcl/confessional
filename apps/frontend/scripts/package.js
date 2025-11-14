#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Set encoding for console output
process.env.FORCE_COLOR = '1';

// Ensure 7-Zip is in PATH for Windows (required by Squirrel)
if (os.platform() === 'win32') {
  const sevenZipPaths = [
    'C:\\Program Files\\7-Zip',
    'C:\\Program Files (x86)\\7-Zip'
  ];
  
  for (const sevenZipPath of sevenZipPaths) {
    if (fs.existsSync(path.join(sevenZipPath, '7z.exe'))) {
      if (!process.env.PATH.includes(sevenZipPath)) {
        process.env.PATH = `${process.env.PATH};${sevenZipPath}`;
        console.log(`\x1b[36mAdded 7-Zip to PATH: ${sevenZipPath}\x1b[0m`);
      }
      break;
    }
  }
}

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

// Determine platforms to build for
const args = process.argv.slice(2);
let platforms = [];

if (args.includes('--all')) {
  platforms = ['darwin', 'win32', 'linux'];
} else if (args.includes('--mac')) {
  platforms.push('darwin');
}
if (args.includes('--win')) {
  platforms.push('win32');
}
if (args.includes('--linux')) {
  platforms.push('linux');
}

// Default to current platform if none specified
if (platforms.length === 0) {
  const currentPlatform = os.platform();
  platforms.push(currentPlatform);
  console.log(`\x1b[33mNo platform specified, defaulting to current platform: ${currentPlatform}\x1b[0m`);
}

// Build for each platform
for (const platform of platforms) {
  console.log(`\x1b[33m===== Building for ${platform} =====\x1b[0m`);
  
  try {
    runCommand(`electron-forge make --platform=${platform}`);
    console.log(`\x1b[32mSuccessfully built for ${platform}!\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31mFailed to build for ${platform}. Error: ${error.message}\x1b[0m`);
  }
}

console.log('\x1b[32m===== Build process completed =====\x1b[0m');