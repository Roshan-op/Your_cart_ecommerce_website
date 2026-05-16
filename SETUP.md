# MUSE E-Commerce Platform - Setup Guide

Complete step-by-step guide to set up and run the MUSE Digital Market application locally.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Email Configuration](#email-configuration)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)

## 📦 Prerequisites

### Required Software
- **Python 3.8+** - Download from [python.org](https://www.python.org/downloads/)
- **Node.js 14+** - Download from [nodejs.org](https://nodejs.org/)
- **Git** - Download from [git-scm.com](https://git-scm.com/)
- **Text Editor/IDE** - VS Code, PyCharm, or your preference

### Verify Installation
```bash
python --version      # Should show 3.8 or higher
node --version        # Should show 14 or higher
npm --version         # Should show 6 or higher
git --version         # Should show 2.x
```

## 🎯 Project Setup

### 1. Clone or Download the Repository
```bash
# Clone if using git
git clone <repository-url>
cd your-cart

# Or extract ZIP file manually
```

### 2. Understand the Project Structure
```
your-cart/
├── Digital-Market-master/
│   ├── backend/          # Django backend
│   └── frontend/         # React frontend (inside backend/)
├── .gitignore
├── README.md
├── SETUP.md             # This file
├── LICENSE
└── start_server.bat     # Batch file for Windows
```

## 🔧 Backend Setup

### Step 1: Create Virtual Environment

**Windows:**
```bash
cd Digital-Market-master/backend
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
cd Digital-Market-master/backend
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` at the start of your terminal line.

### Step 2: Install Python Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

Wait for all packages to install. This may take 2-5 minutes.

### Step 3: Create Environment File
```bash
# Copy example file
cp .env.example .env

# On Windows:
# copy .env.example .env
```

Edit `.env` file with your settings:
```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=127.0.0.1,localhost

# Database (SQLite for development)
# No additional config needed for SQLite

# Email Configuration - Gmail SMTP (Required for email features)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=xxxx xxxx xxxx xxxx
DEFAULT_FROM_EMAIL=your-email@gmail.com
ADMIN_EMAIL=admin@gmail.com
```

### Step 4: Setup Database

```bash
# Create database tables
python manage.py migrate

# Create superuser (optional - for Django admin)
python manage.py createsuperuser
# Follow prompts to create admin account
```

### Step 5: Load Sample Data (Optional)

If the project includes sample data:
```bash
python manage.py loaddata initial_data.json
```

Or create sample products through Django admin:
```
http://127.0.0.1:8000/admin/
```

### Step 6: Collect Static Files (Production only)

For production deployment:
```bash
python manage.py collectstatic --noinput
```

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Install Node Dependencies
```bash
npm install
# or
yarn install
```

This installs all packages listed in `package.json`. May take 2-5 minutes.

### Step 3: Create Frontend Environment (if needed)
Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://127.0.0.1:8000
```

## 📧 Email Configuration (Gmail SMTP)

### Why Configure Email?
- Sends welcome emails to new users
- Sends order confirmations
- Sends shipping notifications
- Password reset functionality

### Setup Gmail SMTP (Free & Easy)

#### Step 1: Enable 2-Step Verification
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Sign in to your Gmail account
3. Find "How you sign in to Google"
4. Click "2-Step Verification"
5. Follow the prompts to enable it

#### Step 2: Generate App Password
1. Return to [Google Account Security](https://myaccount.google.com/security)
2. Find "App passwords" (appears after enabling 2FA)
3. Select **Mail** and **Windows Computer** (or your device)
4. Click "Generate"
5. Copy the 16-character password shown (e.g., `abcd efgh ijkl mnop`)

#### Step 3: Add to .env
```env
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=abcdefghijklmnop
# Remove spaces from the password
```

#### Step 4: Test Email (Optional)
```bash
python manage.py shell
from django.core.mail import send_mail
send_mail(
    'Test Subject',
    'Test message body',
    'your-email@gmail.com',
    ['recipient@example.com'],
    fail_silently=False,
)
# Check recipient's inbox
exit()
```

### Gmail Limits
- **Free Tier**: 100 emails/day (resets daily)
- **Google Workspace**: Higher limits ($6/month)
- For production with high volume, consider SendGrid or AWS SES

## 🚀 Running the Application

### Method 1: Using Batch File (Windows Only)
```bash
# From project root
./start_server.bat
```

### Method 2: Manual Terminal Commands

**Terminal 1 - Backend:**
```bash
cd Digital-Market-master/backend
# Activate venv first
venv\Scripts\activate    # Windows
# or
source venv/bin/activate # macOS/Linux

python manage.py runserver
# Runs on http://127.0.0.1:8000/
```

**Terminal 2 - Frontend:**
```bash
cd Digital-Market-master/backend/frontend
npm start
# Runs on http://localhost:3000/
```

### First Time Access
1. Open http://localhost:3000/ in your browser
2. Home page loads with products
3. Click "Sign In" to create account or login
4. Explore products, add to cart, check wishlist

## 🔍 Verification Checklist

- [ ] Virtual environment activated (see `(venv)` in terminal)
- [ ] All pip packages installed without errors
- [ ] `.env` file created with configuration
- [ ] Database migrations completed
- [ ] Backend server running on http://127.0.0.1:8000/
- [ ] Frontend server running on http://localhost:3000/
- [ ] Can access home page in browser
- [ ] Can register new user account
- [ ] Can login to account
- [ ] Can browse products
- [ ] Can add products to cart

## 🐛 Troubleshooting

### Virtual Environment Issues

**Error: `venv command not found`**
```bash
# Try python3 instead
python3 -m venv venv
```

**Error: `python version 3.8 required`**
- Install Python 3.8+ from [python.org](https://www.python.org/downloads/)
- Verify with `python --version`

### Dependency Issues

**Error: `No module named 'django'`**
```bash
# Make sure venv is activated
pip install -r requirements.txt
```

**Error: `pip: command not found`**
```bash
# Try python -m pip
python -m pip install -r requirements.txt
```

### Database Issues

**Error: `no such table: base_product`**
```bash
# Run migrations again
python manage.py migrate
```

**Error: `database is locked`**
- Delete `db.sqlite3` file
- Run `python manage.py migrate` again
- Create new superuser if needed

### Backend Server Issues

**Error: `Address already in use`**
```bash
# Port 8000 is in use. Try different port
python manage.py runserver 8001
```

**Error: `SECRET_KEY not found`**
- Generate SECRET_KEY:
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```
- Add to `.env` file

### Frontend Build Issues

**Error: `npm: command not found`**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart terminal

**Error: `npm install fails`**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**Error: Port 3000 already in use**
```bash
# Use different port
PORT=3001 npm start
```

### Email Not Working

**Error: `SMTPAuthenticationError`**
- Verify EMAIL_HOST_USER is correct Gmail address
- Verify EMAIL_HOST_PASSWORD is 16-character app password (no spaces)
- Check 2-Step Verification is enabled on Gmail
- Generate new app password if needed

**Error: `SMTPException: SMTP AUTH extension not supported`**
- Verify settings in `settings.py`:
  - EMAIL_PORT = 587
  - EMAIL_USE_TLS = True
  - EMAIL_USE_SSL = False

**Error: `421 Service Unavailable`**
- Exceeded 100 emails/day limit
- Wait until next day or upgrade to Google Workspace

### API Errors

**Error: `401 Unauthorized` on protected endpoints**
- Login first to get token
- Token stored in localStorage
- Verify token not expired (30-day expiration)

**Error: `CORS error` from frontend**
- Backend CORS settings correct in `settings.py`
- Both frontend and backend running on localhost
- Check browser console for full error message

## 📞 Getting Help

### Common Resources
1. **Django Docs**: https://docs.djangoproject.com/
2. **React Docs**: https://react.dev/
3. **DRF Docs**: https://www.django-rest-framework.org/
4. **Project README**: See [README.md](README.md)

### Debug Mode
Enable verbose logging:
```bash
# Backend logs in terminal
python manage.py runserver --verbosity=2

# Frontend console (F12 in browser)
# Check Network tab for API calls
```

## 🔒 Security Notes

### Development vs Production
- `.env` file contains secrets - NEVER commit to git
- `DEBUG=True` only in development
- Use strong SECRET_KEY in production
- Set ALLOWED_HOSTS properly in production

### Email Security
- App Password is different from Gmail password
- Can be revoked anytime
- Use Gmail 2FA for account security
- Never use regular Gmail password in `.env`

## ✅ Next Steps

Once setup is complete:

1. **Create Test Account**
   - Register at http://localhost:3000/signup
   - Verify welcome email received

2. **Test Features**
   - Browse products
   - Add to cart
   - Add to wishlist
   - View user dashboard

3. **Access Admin**
   - Go to http://127.0.0.1:8000/admin/
   - Login with superuser account
   - Manage products, users, orders

4. **Explore API**
   - http://127.0.0.1:8000/api/products/
   - http://127.0.0.1:8000/api/products/1/recommend/

## 📚 Additional Resources

- **Gmail SMTP Setup**: [Gmail SMTP Documentation](https://support.google.com/mail/answer/7126229)
- **Python Virtual Environments**: [venv Documentation](https://docs.python.org/3/tutorial/venv.html)
- **Node/npm**: [npm Getting Started](https://docs.npmjs.com/getting-started)
- **Git Basics**: [Git Documentation](https://git-scm.com/doc)

---

**Last Updated**: May 16, 2026  
**Version**: 1.0.0  
**Status**: Complete ✅
