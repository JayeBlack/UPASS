@echo off
echo.
echo ============================================================
echo UPASS - CLEAR DATABASE
echo ============================================================
echo.
echo WARNING: This will delete ALL data from your database!
echo.
echo Press CTRL+C to cancel, or
pause
echo.

cd backend
node clear_database.js

if errorlevel 1 (
    echo.
    echo ERROR: Failed to clear database
    pause
    exit /b 1
)

echo.
echo ============================================================
echo DATABASE CLEARED!
echo ============================================================
echo.
echo Now run these commands:
echo.
echo 1. Run migrations (recreate departments):
echo    cd backend
echo    node run_migrations.js
echo.
echo 2. Create super admin:
echo    create-admin.bat
echo    OR: cd backend ^&^& node create_superadmin.js admin@test.com pass123 Admin User
echo.
pause
