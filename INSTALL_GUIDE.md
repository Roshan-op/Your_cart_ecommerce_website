# Install Dependencies Guide

This guide explains how to install all dependencies for the Digital Market project.

## Requirements

Before running the installation scripts, ensure you have:

1. **Python 3.8+** - Download from [python.org](https://www.python.org/downloads/)
2. **Node.js & npm** - Download from [nodejs.org](https://nodejs.org/)
3. **Git** (optional, for version control)

## Installation Methods

### Method 1: PowerShell Script (Recommended for Windows PowerShell)

Run the following command in PowerShell:

```powershell
.\install_dependencies.ps1
```

**If you get an execution policy error**, run this first:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

### Method 2: Batch Script (Traditional Windows Command Prompt)

Simply double-click `install_dependencies.bat` or run from Command Prompt:

```cmd
install_dependencies.bat
```

### Method 3: Manual Installation

If you prefer to install manually:

#### Python Dependencies:

```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows)
.\.venv\Scripts\activate

# Install Python packages
pip install -r Digital-Market-master\backend\requirements.txt
```

#### Node.js Dependencies:

```bash
# Navigate to frontend directory
cd Digital-Market-master\backend\frontend

# Install npm packages
npm install

# Return to root
cd ..\..\..
```

## What Gets Installed

### Python Packages (from requirements.txt):
- Django 4.1.6
- Django REST Framework
- Django CORS Headers
- Django JWT Authentication
- Pillow (image processing)
- Requests (HTTP library)
- And other supporting libraries

### Node.js Packages (from package.json):
- React 18.2.0
- React Redux
- React Router
- Bootstrap & React Bootstrap
- Axios (HTTP client)
- Khalti Checkout (payment gateway)
- Webpack & Webpack Dev Server
- And other supporting libraries

## Starting the Application

After installation completes:

### Start Backend Server:

```bash
cd Digital-Market-master\backend
python manage.py runserver
```

The backend will be available at: `http://127.0.0.1:8000`

### Start Frontend Development Server:

Open a new terminal and run:

```bash
cd Digital-Market-master\backend\frontend
npm start
```

The frontend will be available at: `http://localhost:3000`

## Troubleshooting

### Python not found:
- Ensure Python is installed and added to PATH
- Restart your terminal after installing Python

### npm not found:
- Ensure Node.js is installed and added to PATH
- Restart your terminal after installing Node.js

### Permission Denied (PowerShell):
- Run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned`

### Virtual Environment Issues:
- Delete the `.venv` folder and rerun the script
- Or manually recreate: `python -m venv .venv`

### npm install fails:
- Clear npm cache: `npm cache clean --force`
- Try again: `npm install`

## Additional Commands

### Update Dependencies:

```bash
# Update pip
pip install --upgrade pip

# Update npm packages
npm update
```

### List Installed Packages:

```bash
# Python
pip list

# Node.js
npm list
```

### Remove Virtual Environment:

```bash
# Windows
rmdir /s .venv
```

## Support

For more information, check:
- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [npm Documentation](https://docs.npmjs.com/)
