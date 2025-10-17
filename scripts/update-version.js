#!/usr/bin/env node

/**
 * Version Update Script
 * 
 * This script automatically increments the patch version in:
 * - package.json
 * - src/environments/environment.ts
 * - src/environments/environment.prod.ts
 * 
 * Usage:
 *   npm run version:patch
 *   node scripts/update-version.js
 *   node scripts/update-version.js --patch
 *   node scripts/update-version.js --minor
 *   node scripts/update-version.js --major
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  packageJsonPath: path.join(__dirname, '..', 'package.json'),
  environmentPath: path.join(__dirname, '..', 'src', 'environments', 'environment.ts'),
  environmentProdPath: path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts'),
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Logs colored messages to console
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Increments version number based on type
 */
function incrementVersion(version, type = 'patch') {
  const parts = version.split('.').map(Number);
  
  switch (type) {
    case 'major':
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case 'minor':
      parts[1]++;
      parts[2] = 0;
      break;
    case 'patch':
    default:
      parts[2]++;
      break;
  }
  
  return parts.join('.');
}

/**
 * Updates version in package.json
 */
function updatePackageJson(newVersion) {
  try {
    const packageJsonContent = fs.readFileSync(CONFIG.packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    
    const oldVersion = packageJson.version;
    packageJson.version = newVersion;
    
    fs.writeFileSync(CONFIG.packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    
    log(`✓ Updated package.json: ${oldVersion} → ${newVersion}`, 'green');
    return true;
  } catch (error) {
    log(`✗ Error updating package.json: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Updates version in environment files
 */
function updateEnvironmentFile(filePath, newVersion) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract current version using regex
    const versionRegex = /version:\s*['"`]([^'"`]+)['"`]/;
    const match = content.match(versionRegex);
    
    if (!match) {
      log(`✗ Could not find version in ${path.basename(filePath)}`, 'red');
      return false;
    }
    
    const oldVersion = match[1];
    const updatedContent = content.replace(versionRegex, `version: '${newVersion}'`);
    
    fs.writeFileSync(filePath, updatedContent);
    
    log(`✓ Updated ${path.basename(filePath)}: ${oldVersion} → ${newVersion}`, 'green');
    return true;
  } catch (error) {
    log(`✗ Error updating ${path.basename(filePath)}: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Validates that all files exist
 */
function validateFiles() {
  const files = [
    CONFIG.packageJsonPath,
    CONFIG.environmentPath,
    CONFIG.environmentProdPath
  ];
  
  for (const file of files) {
    if (!fs.existsSync(file)) {
      log(`✗ File not found: ${file}`, 'red');
      return false;
    }
  }
  
  return true;
}

/**
 * Gets current version from package.json
 */
function getCurrentVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(CONFIG.packageJsonPath, 'utf8'));
    return packageJson.version;
  } catch (error) {
    log(`✗ Error reading current version: ${error.message}`, 'red');
    return null;
  }
}

/**
 * Main function
 */
function main() {
  log('🚀 Starting version update...', 'cyan');
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const versionType = args.find(arg => ['--major', '--minor', '--patch'].includes(arg))?.replace('--', '') || 'patch';
  
  log(`📋 Version type: ${versionType}`, 'blue');
  
  // Validate files exist
  if (!validateFiles()) {
    log('\n❌ Validation failed. Exiting.', 'red');
    process.exit(1);
  }
  
  // Get current version
  const currentVersion = getCurrentVersion();
  if (!currentVersion) {
    log('\n❌ Could not determine current version. Exiting.', 'red');
    process.exit(1);
  }
  
  log(`📦 Current version: ${currentVersion}`, 'yellow');
  
  // Calculate new version
  const newVersion = incrementVersion(currentVersion, versionType);
  log(`🎯 New version: ${newVersion}`, 'yellow');
  
  // Confirm update
  if (process.stdout.isTTY && !args.includes('--yes') && !args.includes('-y')) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(`\n❓ Update version from ${currentVersion} to ${newVersion}? (y/N): `, (answer) => {
      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        log('\n❌ Version update cancelled.', 'yellow');
        rl.close();
        process.exit(0);
      }
      
      rl.close();
      performUpdate(currentVersion, newVersion);
    });
  } else {
    performUpdate(currentVersion, newVersion);
  }
}

/**
 * Performs the actual version update
 */
function performUpdate(currentVersion, newVersion) {
  log('\n🔄 Updating files...', 'cyan');
  
  let updateCount = 0;
  
  // Update package.json
  if (updatePackageJson(newVersion)) {
    updateCount++;
  }
  
  // Update environment.ts
  if (updateEnvironmentFile(CONFIG.environmentPath, newVersion)) {
    updateCount++;
  }
  
  // Update environment.prod.ts
  if (updateEnvironmentFile(CONFIG.environmentProdPath, newVersion)) {
    updateCount++;
  }
  
  // Summary
  log('\n📊 Update Summary:', 'bright');
  log(`   Files updated: ${updateCount}/3`, updateCount === 3 ? 'green' : 'yellow');
  log(`   Version: ${currentVersion} → ${newVersion}`, 'blue');
  
  if (updateCount === 3) {
    log('\n✅ All files updated successfully!', 'green');
    log('\n💡 Next steps:', 'cyan');
    log('   1. Review the changes', 'cyan');
    log('   2. Commit the version update', 'cyan');
    log('   3. Create a git tag (optional)', 'cyan');
    log(`      git tag v${newVersion}`, 'cyan');
  } else {
    log('\n⚠️  Some files failed to update. Please check the errors above.', 'yellow');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  incrementVersion,
  updatePackageJson,
  updateEnvironmentFile,
  getCurrentVersion
};