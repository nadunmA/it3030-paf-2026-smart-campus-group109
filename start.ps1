$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

Write-Host ""
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host "     Smart Campus - Starting Up" -ForegroundColor Cyan
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host ""

# ── 1. Load .env ──────────────────────────────────────────
$EnvFile = Join-Path $Root ".env"
if (-not (Test-Path $EnvFile)) {
    Write-Host "  [ERROR] .env not found. Copy .env.example to .env" -ForegroundColor Red
    Read-Host "Press Enter to exit"; exit 1
}

$env_vars = @{}
Get-Content $EnvFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $idx = $line.IndexOf("=")
        if ($idx -gt 0) {
            $key = $line.Substring(0, $idx).Trim()
            $val = $line.Substring($idx + 1).Trim()
            $env_vars[$key] = $val
            Set-Item "Env:$key" $val
        }
    }
}
Write-Host "  [OK] Loaded .env" -ForegroundColor Green

# ── 2. Find Java ──────────────────────────────────────────
$javaHome = $null
$candidates = @(
    "C:\Program Files\Java\jdk-22",
    "C:\Program Files\Java\jdk-21",
    "C:\Program Files\Java\jdk-17"
)
foreach ($p in $candidates) { if (Test-Path $p) { $javaHome = $p; break } }

if (-not $javaHome) {
    foreach ($base in @("C:\Program Files\Eclipse Adoptium","C:\Program Files\Microsoft")) {
        if (Test-Path $base) {
            $f = Get-ChildItem $base -Filter "jdk-*" -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1
            if ($f) { $javaHome = $f.FullName; break }
        }
    }
}
if (-not $javaHome) {
    Write-Host "  [ERROR] Java JDK not found. Install Java 17+ from https://adoptium.net" -ForegroundColor Red
    Read-Host "Press Enter to exit"; exit 1
}
Write-Host "  [OK] Java: $javaHome" -ForegroundColor Green

# ── 3. Find Maven ─────────────────────────────────────────
$mvn = $null
$m2 = Join-Path $env:USERPROFILE ".m2\wrapper\dists"
if (Test-Path $m2) {
    $found = Get-ChildItem $m2 -Filter "mvn.cmd" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) { $mvn = $found.FullName }
}
if (-not $mvn -and (Get-Command mvn -ErrorAction SilentlyContinue)) { $mvn = "mvn" }
if (-not $mvn) {
    Write-Host "  [ERROR] Maven not found. Run mvnw.cmd once to auto-download it." -ForegroundColor Red
    Read-Host "Press Enter to exit"; exit 1
}
Write-Host "  [OK] Maven: $mvn" -ForegroundColor Green

# ── 4. Node.js ────────────────────────────────────────────
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "  [ERROR] Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
    Read-Host "Press Enter to exit"; exit 1
}
Write-Host "  [OK] Node.js found" -ForegroundColor Green

# ── 5. npm install if needed ──────────────────────────────
if (-not (Test-Path (Join-Path $Root "frontend\node_modules"))) {
    Write-Host "  [INFO] Installing frontend dependencies (first run only)..." -ForegroundColor Yellow
    Push-Location (Join-Path $Root "frontend")
    npm install
    Pop-Location
    Write-Host "  [OK] Dependencies installed" -ForegroundColor Green
}

# ── 6. Kill port 8080 ────────────────────────────────────
try {
    $conn = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
    if ($conn) { Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue }
} catch {}

# ── 7. Write launcher scripts ────────────────────────────
$backendScript  = Join-Path $Root "run-backend-launch.bat"
$frontendScript = Join-Path $Root "run-frontend-launch.bat"

$MONGO_URI           = $env_vars["MONGO_URI"]
$GOOGLE_CLIENT_ID    = $env_vars["GOOGLE_CLIENT_ID"]
$GOOGLE_CLIENT_SECRET= $env_vars["GOOGLE_CLIENT_SECRET"]
$JWT_SECRET          = $env_vars["JWT_SECRET"]
$FRONTEND_URL        = $env_vars["FRONTEND_URL"]
$backendDir          = Join-Path $Root "backend\smart-campus"
$frontendDir         = Join-Path $Root "frontend"

$backendContent = @"
@echo off
title Smart Campus Backend
set "JAVA_HOME=$javaHome"
set "MONGO_URI=$MONGO_URI"
set "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID"
set "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET"
set "JWT_SECRET=$JWT_SECRET"
set "FRONTEND_URL=$FRONTEND_URL"
cd /d "$backendDir"
"$mvn" spring-boot:run
echo.
echo Backend stopped. Press any key to close.
pause >nul
"@

$frontendContent = @"
@echo off
title Smart Campus Frontend
cd /d "$frontendDir"
npm run dev
echo.
echo Frontend stopped. Press any key to close.
pause >nul
"@

[System.IO.File]::WriteAllText($backendScript,  $backendContent,  [System.Text.Encoding]::ASCII)
[System.IO.File]::WriteAllText($frontendScript, $frontendContent, [System.Text.Encoding]::ASCII)

# ── 8. Launch ─────────────────────────────────────────────
Write-Host ""
Write-Host "  Starting backend  > http://localhost:8080" -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/c", $backendScript

Start-Sleep -Seconds 1

Write-Host "  Starting frontend > http://localhost:5173" -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/c", $frontendScript

Write-Host ""
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host "   Both services are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "   Frontend : http://localhost:5173"
Write-Host "   Backend  : http://localhost:8080"
Write-Host ""
Write-Host "   Close the two terminal windows to stop."
Write-Host "  ============================================"
Write-Host ""
Write-Host "  Opening browser in 20 seconds..."
Start-Sleep -Seconds 20
Start-Process "http://localhost:5173"
