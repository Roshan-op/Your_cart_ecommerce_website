@echo off
REM ===================================================================
REM Cash Market - Local Development Server Starter
REM ===================================================================
REM This script automatically starts the Django development server
REM ===================================================================

echo.
echo =====================================================
echo        CASH MARKET - Development Server
echo =====================================================
echo.

REM Check if virtual environment exists
if not exist venv (
    echo [ERROR] Virtual environment not found!
    echo Please run: python -m venv venv
    pause
    exit /b 1
)

REM Navigate to backend directory
cd backend

REM Activate virtual environment
call ..\venv\Scripts\activate.bat

REM Run migrations if needed
echo [INFO] Checking database...
python manage.py migrate --noinput

REM Display credentials
echo.
echo =====================================================
echo        TEST CREDENTIALS
echo =====================================================
echo.
echo [ADMIN]
echo   Username: admin
echo   Password: admin123
echo   URL: http://localhost:8000/auth/admin/login/
echo.
echo [VENDOR]
echo   Username: vendor
echo   Password: vendor123
echo   URL: http://localhost:8000/auth/vendor/login/
echo.
echo [SIGNUP]
echo   URL: http://localhost:8000/auth/customer/signup/
echo.
echo =====================================================
echo.

REM Start Django server
echo [INFO] Starting Django development server...
echo [INFO] Server will be available at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

python manage.py runserver

pause
