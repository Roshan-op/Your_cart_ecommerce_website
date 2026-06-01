# Install All Dependencies Script
# This script installs both Python and Node.js dependencies for the Digital Market project

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Digital Market - Install Dependencies" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if virtual environment exists, if not create it
Write-Host "Step 1: Setting up Python virtual environment..." -ForegroundColor Yellow
if (Test-Path ".\.venv") {
    Write-Host "✓ Virtual environment already exists" -ForegroundColor Green
} else {
    Write-Host "Creating virtual environment..." -ForegroundColor Gray
    python -m venv .venv
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
}

Write-Host ""

# Activate virtual environment
Write-Host "Step 2: Activating virtual environment..." -ForegroundColor Yellow
& ".\.venv\Scripts\Activate.ps1"
Write-Host "✓ Virtual environment activated" -ForegroundColor Green

Write-Host ""

# Install Python dependencies
Write-Host "Step 3: Installing Python dependencies..." -ForegroundColor Yellow
$requirementsPath = ".\Digital-Market-master\backend\requirements.txt"
if (Test-Path $requirementsPath) {
    pip install -r $requirementsPath
    Write-Host "✓ Python dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ requirements.txt not found at $requirementsPath" -ForegroundColor Red
}

Write-Host ""

# Install Node.js dependencies
Write-Host "Step 4: Installing Node.js dependencies..." -ForegroundColor Yellow

# Check if npm is installed
if (Get-Command npm -ErrorAction SilentlyContinue) {
    $frontendPath = ".\Digital-Market-master\backend\frontend"
    if (Test-Path $frontendPath) {
        Push-Location $frontendPath
        Write-Host "Installing npm packages in frontend directory..." -ForegroundColor Gray
        npm install
        Write-Host "✓ Node.js dependencies installed" -ForegroundColor Green
        Pop-Location
    } else {
        Write-Host "✗ Frontend directory not found at $frontendPath" -ForegroundColor Red
    }
} else {
    Write-Host "✗ npm is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Installation Complete!" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. To start the backend: python manage.py runserver (from backend directory)"
Write-Host "  2. To start the frontend: npm start (from frontend directory)"
Write-Host ""
