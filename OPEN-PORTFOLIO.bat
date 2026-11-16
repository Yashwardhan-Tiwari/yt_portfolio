@echo off
setlocal
cd /d "%~dp0"
where powershell.exe >nul 2>nul
if errorlevel 1 (
  echo Windows PowerShell was not found. Opening the self-contained HTML version instead.
  start "" "%~dp0index.html"
  exit /b
)
echo Starting Yashwardhan's portfolio...
echo Keep the PowerShell server window open while browsing.
start "Yashwardhan Portfolio Server" powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
