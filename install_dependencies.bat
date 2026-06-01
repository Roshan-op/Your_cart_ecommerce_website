@echo off
REM Install All Dependencies Script (Batch version)
REM This script installs both Python and Node.js dependencies for the Digital Market project

color 0B
cls
echo ======================================
echo Digital Market - Install Dependencies
echo ======================================
echo.

REM Check if virtual environment exists
echo Step 1: Setting up Python virtual environment...
if exist ".\.venv" (
    echo Virtual environment already exists
) else (
    echo Creating virtual environment...
    python -m venv .venv
)
echo.

REM Activate virtual environment
echo Step 2: Activating virtual environment...
call .\.venv\Scripts\activate.bat

REM Install Python dependencies
echo Step 3: Installing Python dependencies...
if exist ".\Digital-Market-master\backend\requirements.txt" (
    pip install -r .\Digital-Market-master\backend\requirements.txt
    echo Python dependencies installed successfully
) else (
    echo ERROR: requirements.txt not found
)
echo.

REM Install Node.js dependencies
echo Step 4: Installing Node.js dependencies...
where npm >nul 2>nul
if %ERRORLEVEL% == 0 (
    cd .\Digital-Market-master\backend\frontend
    echo Installing npm packages...
    call npm install
    cd ..\..\..\
    echo Node.js dependencies installed successfully
) else (
    echo ERROR: npm is not installed. Please install Node.js from https://nodejs.org/
)

echo.
echo ======================================
echo Installation Complete!
echo ======================================
echo.
echo Next steps:
echo   1. To start the backend: python manage.py runserver (from backend directory)
echo   2. To start the frontend: npm start (from frontend directory)
echo.
pause
