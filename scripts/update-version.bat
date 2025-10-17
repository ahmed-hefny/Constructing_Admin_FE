@echo off
REM Version Update Script for Windows Command Prompt
REM Usage: update-version.bat [patch|minor|major]

setlocal enabledelayedexpansion

set "TYPE=%1"
if "%TYPE%"=="" set "TYPE=patch"

echo Starting version update (%TYPE%)...

REM Check if Node.js script exists
if not exist "scripts\update-version.js" (
    echo Error: update-version.js not found
    exit /b 1
)

REM Run the Node.js script
node scripts\update-version.js --%TYPE% --yes

if %ERRORLEVEL% equ 0 (
    echo.
    echo Version update completed successfully!
) else (
    echo.
    echo Version update failed!
    exit /b 1
)

pause