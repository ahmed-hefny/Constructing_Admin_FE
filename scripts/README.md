# Version Update Scripts

This directory contains scripts to automatically update the application version across all relevant files.

## 📁 Files Updated

The scripts update the version in the following files:
- `package.json`
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

## 🚀 Usage

### NPM Scripts (Recommended)

```bash
# Increment patch version (1.6.3 → 1.6.4)
npm run version:patch

# Increment minor version (1.6.3 → 1.7.0)
npm run version:minor

# Increment major version (1.6.3 → 2.0.0)
npm run version:major

# Interactive mode (asks for confirmation)
npm run version:update
```

### Direct Script Execution

#### Node.js Script
```bash
# Patch version (default)
node scripts/update-version.js

# Specific version types
node scripts/update-version.js --patch
node scripts/update-version.js --minor
node scripts/update-version.js --major

# Skip confirmation
node scripts/update-version.js --patch --yes
```

#### PowerShell Script (Windows)
```powershell
# Patch version (default)
.\scripts\update-version.ps1

# Specific version types
.\scripts\update-version.ps1 -Type patch
.\scripts\update-version.ps1 -Type minor
.\scripts\update-version.ps1 -Type major

# Skip confirmation
.\scripts\update-version.ps1 -Type patch -Force
```

#### Batch Script (Windows Command Prompt)
```cmd
# Patch version (default)
scripts\update-version.bat

# Specific version types
scripts\update-version.bat patch
scripts\update-version.bat minor
scripts\update-version.bat major
```

## 📋 Version Types

| Type | Description | Example |
|------|-------------|---------|
| **patch** | Bug fixes, small changes | 1.6.3 → 1.6.4 |
| **minor** | New features, backward compatible | 1.6.3 → 1.7.0 |
| **major** | Breaking changes | 1.6.3 → 2.0.0 |

## 🔧 Script Features

### ✅ Features
- **Multi-file support**: Updates version in package.json and both environment files
- **Validation**: Checks that all files exist before starting
- **Confirmation**: Interactive confirmation (can be skipped)
- **Error handling**: Detailed error messages and rollback on failure
- **Cross-platform**: Works on Windows, macOS, and Linux
- **Colored output**: Easy-to-read console output
- **Summary report**: Shows which files were updated

### 🛡️ Safety Features
- **File validation**: Ensures all target files exist
- **Backup current version**: Shows current version before updating
- **Confirmation prompt**: Asks for confirmation before making changes
- **Error recovery**: Detailed error messages if something goes wrong

## 📖 Examples

### Updating Patch Version
```bash
$ npm run version:patch

🚀 Starting version update...
📋 Version type: patch
📦 Current version: 1.6.3
🎯 New version: 1.6.4

🔄 Updating files...
✓ Updated package.json: 1.6.3 → 1.6.4
✓ Updated environment.ts: 1.6.3 → 1.6.4
✓ Updated environment.prod.ts: 1.6.3 → 1.6.4

📊 Update Summary:
   Files updated: 3/3
   Version: 1.6.3 → 1.6.4

✅ All files updated successfully!

💡 Next steps:
   1. Review the changes
   2. Commit the version update
   3. Create a git tag (optional)
      git tag v1.6.4
```

### Interactive Mode
```bash
$ npm run version:update

🚀 Starting version update...
📋 Version type: patch
📦 Current version: 1.6.3
🎯 New version: 1.6.4

❓ Update version from 1.6.3 to 1.6.4? (y/N): y

🔄 Updating files...
✓ Updated package.json: 1.6.3 → 1.6.4
✓ Updated environment.ts: 1.6.3 → 1.6.4
✓ Updated environment.prod.ts: 1.6.3 → 1.6.4

✅ All files updated successfully!
```

## 🔄 Integration with Git Workflow

### Recommended Workflow
```bash
# 1. Update version
npm run version:patch

# 2. Stage the changes
git add package.json src/environments/

# 3. Commit the version update
git commit -m "chore: bump version to 1.6.4"

# 4. Create a git tag (optional)
git tag v1.6.4

# 5. Push changes and tags
git push origin master
git push origin --tags
```

### Automated Workflow (Optional)
You can create a combined script that handles the entire process:

```bash
# In package.json scripts section
"release:patch": "npm run version:patch && git add . && git commit -m \"chore: bump version\" && git push",
"release:minor": "npm run version:minor && git add . && git commit -m \"chore: bump version\" && git push",
"release:major": "npm run version:major && git add . && git commit -m \"chore: bump version\" && git push"
```

## 🐛 Troubleshooting

### Common Issues

1. **"File not found" error**
   - Ensure you're running the script from the project root directory
   - Check that all required files exist

2. **"Permission denied" error**
   - On Unix systems, you might need to make the script executable:
     ```bash
     chmod +x scripts/update-version.js
     ```

3. **"Node.js not found" error**
   - Ensure Node.js is installed and available in your PATH

4. **PowerShell execution policy error**
   - You might need to allow script execution:
     ```powershell
     Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
     ```

### Getting Help

If you encounter issues:
1. Check the error messages - they usually indicate the specific problem
2. Ensure all files exist and are readable/writable
3. Verify you're in the correct directory (project root)
4. Check that Node.js is properly installed

## 📄 Script Details

### update-version.js
- **Language**: Node.js
- **Features**: Full-featured with validation, confirmation, and colored output
- **Platform**: Cross-platform

### update-version.ps1
- **Language**: PowerShell
- **Features**: Windows-optimized with native PowerShell features
- **Platform**: Windows (PowerShell 5.0+)

### update-version.bat
- **Language**: Batch
- **Features**: Simple wrapper around Node.js script
- **Platform**: Windows Command Prompt