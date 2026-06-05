@echo off
REM Yatrika Local Server Startup Script (Windows)
REM This script starts both backend and frontend on a local server

setlocal enabledelayedexpansion

set PROJECT_ROOT=%~dp0
cd /d "%PROJECT_ROOT%"

echo ======================================
echo   Yatrika Local Server Startup
echo ======================================
echo.

REM Check prerequisites
echo Checking prerequisites...

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed
    exit /b 1
)
echo [OK] Python found

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed
    exit /b 1
)
echo [OK] Node.js found

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed
    exit /b 1
)
echo [OK] npm found

echo.
echo Setting up backend...

REM Check if virtual environment exists
if not exist "backend\venv" (
    echo Creating Python virtual environment...
    python -m venv backend\venv
    call backend\venv\Scripts\activate.bat
    python -m pip install -q --upgrade pip
    pip install -q -r backend\requirements.txt
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend environment already exists
)

echo.
echo Setting up frontend...

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install -q
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)

echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo To start the servers:
echo.
echo 1. Open two PowerShell/Command Prompt windows
echo.
echo 2. In Terminal 1 - Start Backend:
echo    cd backend
echo    python app.py
echo.
echo 3. In Terminal 2 - Start Frontend:
echo    npm run dev
echo.
echo 4. Open http://localhost:5173 in your browser
echo.
echo API will be available at http://localhost:5000
echo API proxy is configured in vite.config.ts
echo.
pause
