@echo off
echo.
echo ============================================================
echo UPASS PROJECT SYNC SCRIPT
echo ============================================================
echo.
echo This script will sync your project with the latest changes
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo ERROR: Please run this script from the UPASS project root directory
    pause
    exit /b 1
)

echo [1/8] Pulling latest code from Git...
git pull origin main
if errorlevel 1 (
    echo.
    echo WARNING: Git pull failed. Continue anyway? (Y/N)
    set /p continue=
    if /i not "%continue%"=="Y" exit /b 1
)

echo.
echo [2/8] Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Backend npm install failed
    pause
    exit /b 1
)

echo.
echo [3/8] Running database migrations...
node run_migrations.js
if errorlevel 1 (
    echo ERROR: Migration failed
    pause
    exit /b 1
)

echo.
echo [4/8] Verifying database health...
node check_db.js

echo.
echo [5/8] Verifying departments...
node verify_departments.js

echo.
echo [6/8] Checking student data...
node check_students.js

echo.
echo [7/8] Installing frontend dependencies...
cd ..
call npm install
if errorlevel 1 (
    echo ERROR: Frontend npm install failed
    pause
    exit /b 1
)

echo.
echo [8/8] Checking for environment files...
if not exist "backend\.env" (
    echo WARNING: backend\.env not found! Copy from backend\.env.example
)
if not exist ".env" (
    echo WARNING: .env not found! Copy from .env.example
)

echo.
echo ============================================================
echo SYNC COMPLETE!
echo ============================================================
echo.
echo Next steps:
echo 1. Start backend: cd backend ^&^& npm run dev
echo 2. Start frontend: npm run dev (in new terminal)
echo.
echo All systems verified and ready!
echo.
pause
