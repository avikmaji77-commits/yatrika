@echo off
REM Yatrika Complete Startup Guide
REM This guide will help you run the full project locally

setlocal enabledelayedexpansion

cd /d "%~dp0"

:menu
cls
echo ======================================
echo   Yatrika - Full Stack Local Server
echo ======================================
echo.
echo What would you like to do?
echo.
echo 1. Setup (Install all dependencies)
echo 2. Start Backend Only
echo 3. Start Frontend Only
echo 4. Start Both (Open 2 terminals)
echo 5. Check System Status
echo 6. Test API Connection
echo 7. View Documentation
echo 8. Exit
echo.
set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto setup
if "%choice%"=="2" goto backend
if "%choice%"=="3" goto frontend
if "%choice%"=="4" goto both
if "%choice%"=="5" goto status
if "%choice%"=="6" goto test
if "%choice%"=="7" goto docs
if "%choice%"=="8" goto end
goto menu

:setup
cls
echo ======================================
echo   Setting up Yatrika...
echo ======================================
echo.

echo [1] Installing backend dependencies...
if exist "backend\venv" (
    echo [SKIP] Backend virtual environment already exists
) else (
    echo Creating Python virtual environment...
    python -m venv backend\venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment
        pause
        goto menu
    )
)

echo.
echo [2] Installing backend packages...
call backend\venv\Scripts\activate.bat
pip install -q -r backend\requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install backend packages
    pause
    goto menu
)
echo [OK] Backend packages installed

echo.
echo [3] Installing frontend dependencies...
if exist "node_modules" (
    echo [SKIP] node_modules already exists
) else (
    call npm install -q
    if errorlevel 1 (
        echo [ERROR] Failed to install frontend dependencies
        pause
        goto menu
    )
)
echo [OK] Frontend dependencies installed

echo.
echo [4] Initializing database...
cd backend
python -c "from app_complete import app, init_db, ensure_database_seeded; init_db(); ensure_database_seeded()" 2>nul
if errorlevel 1 (
    echo [WARNING] Could not initialize database (may already exist)
) else (
    echo [OK] Database initialized
)
cd ..

echo.
echo ======================================
echo [SUCCESS] Setup Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Open 2 terminals
echo 2. In Terminal 1: cd backend ^&^& python app.py
echo 3. In Terminal 2: npm run dev
echo 4. Open http://localhost:5173
echo.
pause
goto menu

:backend
cls
echo ======================================
echo   Starting Backend Server
echo ======================================
echo.
echo Backend will start on http://localhost:5000
echo Press Ctrl+C to stop
echo.
cd /d "%~dp0backend"
call ..\backend\venv\Scripts\activate.bat 2>nul
if errorlevel 1 (
    echo [ERROR] Virtual environment not found. Run setup first (Option 1)
    pause
    cd /d "%~dp0"
    goto menu
)
python app.py
cd /d "%~dp0"
goto menu

:frontend
cls
echo ======================================
echo   Starting Frontend Server
echo ======================================
echo.
echo Frontend will start on http://localhost:5173
echo Press Ctrl+C to stop
echo.
call npm run dev
goto menu

:both
cls
echo ======================================
echo   Opening Both Servers
echo ======================================
echo.
echo Backend will open in new terminal on port 5000
echo Frontend will open in new terminal on port 5173
echo.

REM Open backend in new terminal
start "Yatrika Backend" cmd /k "cd /d "%~dp0backend" && ..\backend\venv\Scripts\activate.bat 2>nul && python app.py"

REM Wait a moment for backend to start
timeout /t 2 /nobreak

REM Open frontend in new terminal
start "Yatrika Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

echo.
echo Opening http://localhost:5173 in browser...
timeout /t 3 /nobreak
start http://localhost:5173

echo.
echo Both servers should now be running!
echo Check the new terminal windows for status.
echo.
pause
goto menu

:status
cls
echo ======================================
echo   System Status Check
echo ======================================
echo.

REM Check Python
python --version 2>nul
if errorlevel 1 (
    echo [ERROR] Python not found
) else (
    echo [OK] Python installed
)

REM Check Node.js
node --version 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js not found
) else (
    echo [OK] Node.js installed
)

REM Check npm
npm --version 2>nul
if errorlevel 1 (
    echo [ERROR] npm not found
) else (
    echo [OK] npm installed
)

REM Check backend venv
if exist "backend\venv" (
    echo [OK] Backend virtual environment exists
) else (
    echo [MISSING] Backend virtual environment
)

REM Check node_modules
if exist "node_modules" (
    echo [OK] Frontend dependencies installed
) else (
    echo [MISSING] Frontend dependencies
)

REM Check database
if exist "backend\data.db" (
    echo [OK] Database exists
) else (
    echo [MISSING] Database not found
)

REM Check backend requirements
if exist "backend\requirements.txt" (
    echo [OK] Backend requirements file exists
) else (
    echo [ERROR] Backend requirements file missing
)

REM Check ports
echo.
echo Checking ports...
netstat -ano | find "5000" >nul
if errorlevel 1 (
    echo [OK] Port 5000 is available
) else (
    echo [WARNING] Port 5000 is in use
)

netstat -ano | find "5173" >nul
if errorlevel 1 (
    echo [OK] Port 5173 is available
) else (
    echo [WARNING] Port 5173 is in use
)

echo.
pause
goto menu

:test
cls
echo ======================================
echo   Testing API Connection
echo ======================================
echo.
echo Testing backend health check...
echo.

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/health' -UseBasicParsing -TimeoutSec 3; Write-Host '[OK] Backend is responding' -ForegroundColor Green; $response.Content } catch { Write-Host '[ERROR] Could not connect to backend' -ForegroundColor Red; Write-Host 'Make sure backend is running: python backend/app.py' -ForegroundColor Yellow }"

echo.
echo.
echo Testing API endpoints...
echo.

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/meta' -UseBasicParsing -TimeoutSec 3; Write-Host '[OK] /api/meta endpoint working' -ForegroundColor Green } catch { Write-Host '[ERROR] /api/meta endpoint failed' -ForegroundColor Red }"

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/destinations?limit=1' -UseBasicParsing -TimeoutSec 3; Write-Host '[OK] /api/destinations endpoint working' -ForegroundColor Green } catch { Write-Host '[ERROR] /api/destinations endpoint failed' -ForegroundColor Red }"

echo.
echo.
pause
goto menu

:docs
cls
echo ======================================
echo   Yatrika Project Structure
echo ======================================
echo.
echo Frontend (React with TanStack Start):
echo   src/
echo     ├── components/     - React components
echo     ├── routes/         - Route definitions
echo     ├── hooks/          - Custom hooks
echo     ├── lib/            - Utilities
echo     └── server.ts       - Server configuration
echo.
echo Backend (Flask REST API):
echo   backend/
echo     ├── app.py          - Entry point
echo     ├── app_complete.py - Full application
echo     ├── models.py       - Database models
echo     ├── database.py     - Database setup
echo     ├── config.py       - Configuration
echo     ├── requirements.txt- Dependencies
echo     └── tests/          - Tests
echo.
echo Configuration Files:
echo   ├── vite.config.ts   - Frontend build config (API proxy)
echo   ├── package.json     - Frontend dependencies
echo   ├── tsconfig.json    - TypeScript config
echo   ├── docker-compose.yml - Docker setup
echo   └── LOCAL_SERVER_SETUP.md - Full documentation
echo.
echo API Endpoints:
echo   GET    /health - Health check
echo   GET    /api/meta - Metadata (categories, seasons, budgets)
echo   GET    /api/destinations - Get destinations
echo   GET    /api/destinations/^<id^> - Get specific destination
echo   GET    /api/stats - Get statistics
echo   GET    /api/trending - Get trending destinations
echo   POST   /api/recommend - Get recommendations
echo   POST   /api/search - Search destinations
echo   POST   /api/chat - Chat/AI interaction
echo   POST   /api/export - Export destinations
echo   POST   /api/import - Import destinations
echo.
pause
goto menu

:end
echo.
echo Thank you for using Yatrika!
echo For more help, see LOCAL_SERVER_SETUP.md
echo.
exit /b 0
