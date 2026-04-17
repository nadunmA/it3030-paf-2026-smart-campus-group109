@echo off
title Smart Campus – Stop
echo.
echo  Stopping Smart Campus services...
echo.

:: Kill Java (backend)
taskkill /F /IM java.exe >nul 2>&1
echo  [OK] Backend stopped

:: Kill Node on port 5173 (frontend dev server)
for /f "tokens=5" %%P in ('netstat -ano 2^>nul ^| findstr ":5173 " ^| findstr "LISTENING"') do (
    taskkill /F /PID %%P >nul 2>&1
)
echo  [OK] Frontend stopped

echo.
echo  All services stopped.
timeout /t 2 /nobreak >nul
