@echo off
title FitTrack Live Tracker Launcher
color 0A
echo ======================================================
echo           FITTRACK LIVE TRACKER AUTO-LAUNCHER
echo ======================================================
echo.
echo [0/4] Cleaning up any previous sessions...
taskkill /f /im ngrok.exe >nul 2>&1
taskkill /f /im php.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
timeout /t 3 /nobreak >nul
echo Done. Starting fresh...
echo.

echo [1/4] Starting Laravel Backend API...
start /min "FitTrack Backend API" cmd /c "cd /d D:\LARAVEL PROJECT\Backend && php artisan serve --host=127.0.0.1 --port=8000"

echo [2/4] Starting Reverb WebSockets...
start /min "FitTrack WebSockets" cmd /c "cd /d D:\LARAVEL PROJECT\Backend && php artisan reverb:start --host=0.0.0.0 --port=8090"

echo [3/4] Starting Vite Frontend UI (with API proxy)...
start /min "FitTrack Frontend UI" cmd /c "cd /d D:\LARAVEL PROJECT\Frontend\tracker-ui && npm run dev -- --host --port 5174"

echo.
echo Waiting 12 seconds for all servers to fully boot...
timeout /t 12 /nobreak >nul

echo [4/4] Starting Permanent Ngrok Tunnel...
start /min "FitTrack Ngrok Tunnel" cmd /c "ngrok http --url=gender-purchase-undertone.ngrok-free.dev 5174"

echo.
echo ======================================================
echo  SUCCESS! All systems launched in the background!
echo ======================================================
echo.
echo  +-------------------------------------------------+
echo  ^|  YOUR PERMANENT APP LINK (save this on phone!): ^|
echo  ^|                                                 ^|
echo  ^|  https://gender-purchase-undertone.ngrok-free.dev ^|
echo  ^|                                                 ^|
echo  ^|  This link NEVER CHANGES. Use it every time!   ^|
echo  +-------------------------------------------------+
echo.
echo * Backend + API are proxied through the frontend tunnel.
echo * All terminals are running silently in your taskbar.
echo * To stop everything, close the minimized windows on taskbar.
echo.
pause
