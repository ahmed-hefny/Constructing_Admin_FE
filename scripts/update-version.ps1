# PowerShell Version Update Script
# Usage: .\scripts\update-version.ps1 [-Type patch|minor|major]

param(
    [ValidateSet("patch", "minor", "major")]
    [string]$Type = "patch",
    [switch]$Force
)

# File paths
$PackageJsonPath = "package.json"
$EnvironmentPath = "src\environments\environment.ts"
$EnvironmentProdPath = "src\environments\environment.prod.ts"

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    } else {
        $input | Write-Output
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Success($Message) {
    Write-ColorOutput Green "✓ $Message"
}

function Write-Error($Message) {
    Write-ColorOutput Red "✗ $Message"
}

function Write-Info($Message) {
    Write-ColorOutput Cyan "ℹ $Message"
}

function Write-Warning($Message) {
    Write-ColorOutput Yellow "⚠ $Message"
}

# Function to increment version
function Get-IncrementedVersion($Version, $Type) {
    $parts = $Version.Split('.') | ForEach-Object { [int]$_ }
    
    switch ($Type) {
        "major" {
            $parts[0]++
            $parts[1] = 0
            $parts[2] = 0
        }
        "minor" {
            $parts[1]++
            $parts[2] = 0
        }
        "patch" {
            $parts[2]++
        }
    }
    
    return "$($parts[0]).$($parts[1]).$($parts[2])"
}

# Function to update package.json
function Update-PackageJson($NewVersion) {
    try {
        $content = Get-Content $PackageJsonPath -Raw | ConvertFrom-Json
        $oldVersion = $content.version
        $content.version = $NewVersion
        
        $content | ConvertTo-Json -Depth 10 | Set-Content $PackageJsonPath -Encoding UTF8
        Write-Success "Updated package.json: $oldVersion → $NewVersion"
        return $true
    }
    catch {
        Write-Error "Failed to update package.json: $($_.Exception.Message)"
        return $false
    }
}

# Function to update environment files
function Update-EnvironmentFile($FilePath, $NewVersion) {
    try {
        $content = Get-Content $FilePath -Raw
        $oldVersionMatch = [regex]::Match($content, "version:\s*['`"]([^'`"]+)['`"]")
        
        if (-not $oldVersionMatch.Success) {
            Write-Error "Could not find version in $FilePath"
            return $false
        }
        
        $oldVersion = $oldVersionMatch.Groups[1].Value
        $newContent = $content -replace "version:\s*['`"][^'`"]+['`"]", "version: '$NewVersion'"
        
        Set-Content -Path $FilePath -Value $newContent -Encoding UTF8
        Write-Success "Updated $(Split-Path $FilePath -Leaf): $oldVersion → $NewVersion"
        return $true
    }
    catch {
        Write-Error "Failed to update $(Split-Path $FilePath -Leaf): $($_.Exception.Message)"
        return $false
    }
}

# Main script
Write-Info "Starting version update ($Type)..."

# Check if files exist
$files = @($PackageJsonPath, $EnvironmentPath, $EnvironmentProdPath)
foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        Write-Error "File not found: $file"
        exit 1
    }
}

# Get current version
try {
    $packageJson = Get-Content $PackageJsonPath -Raw | ConvertFrom-Json
    $currentVersion = $packageJson.version
    Write-Info "Current version: $currentVersion"
}
catch {
    Write-Error "Could not read current version from package.json"
    exit 1
}

# Calculate new version
$newVersion = Get-IncrementedVersion $currentVersion $Type
Write-Info "New version: $newVersion"

# Confirm update
if (-not $Force) {
    $confirmation = Read-Host "Update version from $currentVersion to $newVersion? (y/N)"
    if ($confirmation -ne 'y' -and $confirmation -ne 'yes') {
        Write-Warning "Version update cancelled"
        exit 0
    }
}

# Perform updates
Write-Info "Updating files..."
$updateCount = 0

if (Update-PackageJson $newVersion) { $updateCount++ }
if (Update-EnvironmentFile $EnvironmentPath $newVersion) { $updateCount++ }
if (Update-EnvironmentFile $EnvironmentProdPath $newVersion) { $updateCount++ }

# Summary
Write-Host ""
Write-Info "Update Summary:"
Write-Host "   Files updated: $updateCount/3" -ForegroundColor $(if ($updateCount -eq 3) { "Green" } else { "Yellow" })
Write-Host "   Version: $currentVersion → $newVersion" -ForegroundColor Blue

if ($updateCount -eq 3) {
    Write-Success "All files updated successfully!"
    Write-Host ""
    Write-Info "Next steps:"
    Write-Host "   1. Review the changes" -ForegroundColor Cyan
    Write-Host "   2. Commit the version update" -ForegroundColor Cyan
    Write-Host "   3. Create a git tag (optional)" -ForegroundColor Cyan
    Write-Host "      git tag v$newVersion" -ForegroundColor Cyan
} else {
    Write-Warning "Some files failed to update. Please check the errors above."
    exit 1
}