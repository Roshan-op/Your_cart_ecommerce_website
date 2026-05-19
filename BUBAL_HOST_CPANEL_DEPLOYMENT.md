# 🎯 BUBAL HOST - CPANEL DEPLOYMENT GUIDE

**Complete guide for deploying Cash Market Django application on cPanel hosting**

---

## 📑 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [cPanel Access & Setup](#cpanel-access--setup)
3. [File Upload & Structure](#file-upload--structure)
4. [Python Environment Setup](#python-environment-setup)
5. [Database Configuration](#database-configuration)
6. [Configuration Files](#configuration-files)
7. [Deployment Steps](#deployment-steps)
8. [Testing & Verification](#testing--verification)
9. [Troubleshooting](#troubleshooting)

---

## ✅ PREREQUISITES

- ✅ cPanel access credentials (from Bubal Host)
- ✅ FTP/SFTP access to your hosting
- ✅ SSH access (if available - recommended)
- ✅ Python 3.8+ support enabled on hosting
- ✅ PostgreSQL or MySQL database available
- ✅ SSL certificate (usually included)
- ✅ Your project files ready

---

## 🔑 CPANEL ACCESS & SETUP

### Step 1: Login to cPanel

```
URL: https://your-domain.com:2083
OR: https://bubalhost-control-panel.com
Username: Your cPanel username
Password: Your cPanel password
```

Save login credentials securely!

### Step 2: Note Important Information

In cPanel dashboard, note down:

```
📌 Your Hosting Account Details:

Username: ________________
Domain: ________________
Home Directory: /home/username
Public HTML: /home/username/public_html

Database:
- Host: localhost or db.bubalhost.com
- Prefix: username_
- Power User: username_user

FTP Credentials:
- Host: ftp.yourdomain.com or your-ip.bubalhost.com
- Username: username@yourdomain.com
- Password: ________________

Email for Admin: ________________
```

### Step 3: Access File Manager

In cPanel:
```
Home → File Manager → Open File Manager
```

Or access via FTP:
```
FTP Client: FileZilla, WinSCP, etc.
Server: ftp.yourdomain.com
Username: username@yourdomain.com
Password: Your FTP password
```

---

## 📁 FILE UPLOAD & STRUCTURE

### Step 1: Create Project Directory

In cPanel File Manager:

```
/home/username/
├── public_html/              (Web root - for frontend)
│   ├── index.html
│   └── static/
│
└── django_app/               (NEW - Backend folder)
    ├── backend/
    │   ├── manage.py
    │   ├── db.sqlite3
    │   ├── requirements.txt
    │   ├── backend/
    │   │   ├── settings.py
    │   │   ├── urls.py
    │   │   └── wsgi.py
    │   │
    │   ├── base/
    │   │   ├── models.py
    │   │   ├── views/
    │   │   ├── urls/
    │   │   ├── templates/
    │   │   └── migrations/
    │   │
    │   ├── static/
    │   ├── media/
    │   └── venv/             (Virtual environment)
    │
    └── .htaccess             (Important!)
```

### Step 2: Upload Backend Files

**Via cPanel File Manager:**

1. Right-click in `/home/username/`
2. Select **Create Folder** → Name it `django_app`
3. Upload all backend files (except `venv` and `.git`)

**Via FTP Client (Recommended):**

```
1. Connect to FTP server
2. Navigate to home directory
3. Create folder: django_app
4. Upload contents of backend folder
```

**Via SSH (Fastest):**

```bash
# SSH into server
ssh username@bubalhost.com

# Navigate to home
cd ~

# Create directory
mkdir django_app
cd django_app

# Download from GitHub (if using Git)
git clone https://github.com/yourusername/yourrepo.git .

# Or use SFTP to upload ZIP and extract
unzip yourproject.zip
```

### Step 3: Set Correct Permissions

In cPanel File Manager or via SSH:

```bash
# SSH commands
cd ~/django_app

# Make writable directories
chmod 755 .
chmod 755 backend
chmod 777 backend/media
chmod 777 backend/staticfiles
chmod 666 backend/db.sqlite3

# Make scripts executable
chmod 755 backend/manage.py
```

---

## 🐍 PYTHON ENVIRONMENT SETUP

### Step 1: Check Python Version

In cPanel:

```
Home → Software → Select PHP Version

Look for: Python version or "Select Default PHP Version"
```

Or via SSH:

```bash
python3 --version
python3.9 --version
python3.10 --version
```

### Step 2: Create Virtual Environment

**Via SSH (Recommended):**

```bash
cd ~/django_app
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r backend/requirements.txt
```

**Via cPanel Terminal (if available):**

Same commands as above.

### Step 3: Add Production Dependencies

```bash
source ~/django_app/venv/bin/activate
cd ~/django_app/backend

pip install gunicorn
pip install psycopg2-binary  # For PostgreSQL
pip install mysql-connector-python  # For MySQL
pip install whitenoise
pip install django-environ

# Update requirements
pip freeze > requirements.txt
```

---

## 🗄️ DATABASE CONFIGURATION

### Step 1: Create Database in cPanel

**For MySQL (Most Common):**

```
cPanel → MySQL Databases

1. Create Database:
   - Name: username_cashmarket
   - Click Create

2. Create User:
   - Username: username_cashuser
   - Password: complex_password_here
   - Privileges: ALL PRIVILEGES
   - Click Add User to Database

3. Note the credentials
```

**For PostgreSQL:**

```
cPanel → PostgreSQL Databases (if available)

1. Create Database:
   - Name: cashmarket
   
2. Create User:
   - Username: cashuser
   - Password: complex_password_here
```

### Step 2: Update Django Settings

Edit `backend/backend/settings.py`:

```python
import os
import environ

env = environ.Env()

# ============ PRODUCTION SETTINGS ============
DEBUG = env.bool('DEBUG', False)
SECRET_KEY = env('SECRET_KEY', 'django-insecure-your-key-change-in-production')

ALLOWED_HOSTS = [
    'yourdomain.com',
    'www.yourdomain.com',
    'bubalhost-ip-address',
]

# ============ DATABASE CONFIGURATION ============
# MySQL Configuration (Most Common on cPanel)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'username_cashmarket',
        'USER': 'username_cashuser',
        'PASSWORD': 'your_complex_password_here',
        'HOST': 'localhost',
        'PORT': '3306',
        'CHARSET': 'utf8mb4',
        'INIT_COMMAND': "SET sql_mode='STRICT_TRANS_TABLES'",
    }
}

# OR PostgreSQL Configuration
"""
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'cashmarket',
        'USER': 'cashuser',
        'PASSWORD': 'your_password_here',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
"""

# ============ SECURITY ============
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# ============ STATIC & MEDIA FILES ============
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'backend', 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'backend', 'media')

# ============ CORS CONFIGURATION ============
CORS_ALLOWED_ORIGINS = [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
]

# ============ EMAIL CONFIGURATION ============
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'mail.yourdomain.com'  # cPanel mail server
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'noreply@yourdomain.com'
EMAIL_HOST_PASSWORD = 'email_password_here'
DEFAULT_FROM_EMAIL = 'noreply@yourdomain.com'

# ============ REST FRAMEWORK ============
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'base.apps.BaseConfig',
    'rest_framework',
    'corsheaders',
    'whitenoise.runserver_nostatic',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

---

## 📄 CONFIGURATION FILES

### File 1: `.htaccess` (Main - In `~/django_app/`)

**Location:** `/home/username/django_app/.htaccess`

```apache
# DO NOT REMOVE THIS LINE
# If you modify this file and your site stops working, 
# restore this backup immediately.

RewriteEngine On
RewriteBase /

# Disable public access to Python files
<FilesMatch "\.py$">
    Deny from all
</FilesMatch>

# Disable public access to sensitive files
<FilesMatch "^(manage|wsgi)\.py$">
    Deny from all
</FilesMatch>

# Deny access to .env and other sensitive files
<FilesMatch "^\.env|\.gitignore|\.git|venv">
    Deny from all
</FilesMatch>

# Deny access to migrations folder contents
<DirectoryMatch "migrations">
    Deny from all
</DirectoryMatch>

# 404 for .pyc files
<FilesMatch "\.pyc$">
    Deny from all
</FilesMatch>

# Forward everything to backend
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ backend/wsgi.py/$1 [QSA,L]
```

### File 2: `.htaccess` (In `~/django_app/backend/static/`)

**Location:** `/home/username/django_app/backend/staticfiles/.htaccess`

```apache
# Enable caching for static files
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType application/x-font-ttf "access plus 1 year"
    ExpiresByType font/opentype "access plus 1 year"
    ExpiresByType application/x-font-woff "access plus 1 year"
</IfModule>

<IfModule mod_gzip.c>
    mod_gzip_on       On
    mod_gzip_dechunk  On
    mod_gzip_item_include file      \.(html?|txt|css|js|json|xml|htc|pdf|ico)$
    mod_gzip_item_include handler   ^cgi-script$
    mod_gzip_item_include mime      ^text/.*
    mod_gzip_item_include mime      ^application/x-javascript.*
    mod_gzip_item_exclude mime      ^image/.*
    mod_gzip_item_exclude rspheader ^Content-Encoding:.*gzip.*
</IfModule>
```

### File 3: `.htaccess` (In `~/django_app/backend/media/`)

**Location:** `/home/username/django_app/backend/media/.htaccess`

```apache
# Allow direct access to media files
<FilesMatch "\.(jpg|jpeg|png|gif|pdf|mp4|webp)$">
    Allow from all
</FilesMatch>

# Enable caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
</IfModule>
```

### File 4: `public_html/.htaccess` (Frontend)

**Location:** `/home/username/public_html/.htaccess`

```apache
RewriteEngine On

# If you are using Laravel, check that the following path is correct.
# If you are using Magento instead of the folder name 'public_html' you might need to use 'magento'.
# RewriteBase /

# Redirect to Django backend for API calls
RewriteCond %{REQUEST_URI} ^/api/ [OR]
RewriteCond %{REQUEST_URI} ^/admin/ [OR]
RewriteCond %{REQUEST_URI} ^/auth/ [OR]
RewriteCond %{REQUEST_URI} ^/dashboard/
RewriteRule ^(.*)$ http://yourdomain.com:8000/$1 [P,L]

# Otherwise serve from React frontend
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]

# Compress output
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/atom+xml
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/x-httpd-php
    AddOutputFilterByType DEFLATE application/x-httpd-fastphp
    AddOutputFilterByType DEFLATE application/x-httpd-eruby
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>
```

### File 5: `backend/wsgi.py` (WSGI Configuration)

Edit or create: `/home/username/django_app/backend/backend/wsgi.py`

```python
"""
WSGI config for backend project on cPanel.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os
import sys
from pathlib import Path

# Add project directory to path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
sys.path.insert(0, str(BASE_DIR.parent))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Setup Django
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

# If using Whitenoise for static files
try:
    from whitenoise import WhiteNoise
    application = WhiteNoise(application, root=str(BASE_DIR / 'staticfiles'))
except ImportError:
    pass
```

### File 6: `.env` File (Environment Variables)

**Location:** `/home/username/django_app/backend/.env`

```bash
# ========== SECURITY ==========
DEBUG=False
SECRET_KEY=django-insecure-@9z#e@-p5v#j4$zxcvbnm,./qwerty1234567890

# ========== ALLOWED HOSTS ==========
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,bubalhost-ip

# ========== DATABASE ==========
# For MySQL
DB_ENGINE=django.db.backends.mysql
DB_NAME=username_cashmarket
DB_USER=username_cashuser
DB_PASSWORD=your_complex_password_here
DB_HOST=localhost
DB_PORT=3306

# ========== EMAIL ==========
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=noreply@yourdomain.com
EMAIL_HOST_PASSWORD=your_email_password

# ========== CORS ==========
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# ========== AWS S3 (Optional for media storage) ==========
USE_S3=False
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_STORAGE_BUCKET_NAME=your_bucket
AWS_S3_REGION_NAME=us-east-1
```

**⚠️ Important:** Set proper permissions:
```bash
chmod 600 /home/username/django_app/backend/.env
```

### File 7: `cron_backup.sh` (Backup Script)

**Location:** `/home/username/cron_backup.sh`

```bash
#!/bin/bash

# Daily backup script for Cash Market
# Add to crontab: 0 2 * * * /home/username/cron_backup.sh

BACKUP_DIR="/home/username/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="username_cashmarket"
DB_USER="username_cashuser"
DB_PASS="your_password"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup MySQL database
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Backup media files
tar -czf $BACKUP_DIR/media_backup_$DATE.tar.gz /home/username/django_app/backend/media/

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE" >> /home/username/cron_backup.log
```

Set permissions:
```bash
chmod +x /home/username/cron_backup.sh
```

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Collect Static Files

```bash
cd ~/django_app/backend
source ~/django_app/venv/bin/activate

python manage.py collectstatic --noinput --clear
```

### Step 2: Run Migrations

```bash
source ~/django_app/venv/bin/activate
cd ~/django_app/backend

python manage.py migrate
```

### Step 3: Create Superuser (Admin)

```bash
source ~/django_app/venv/bin/activate
cd ~/django_app/backend

python manage.py createsuperuser

# Follow prompts:
# Username: admin
# Email: admin@yourdomain.com
# Password: strong_password_here
```

### Step 4: Test Application

Via SSH or cPanel terminal:

```bash
source ~/django_app/venv/bin/activate
cd ~/django_app/backend

# Quick health check
python manage.py shell
>>> from django.db import connection
>>> connection.ensure_connection()
>>> print("Database connected!")
>>> exit()
```

### Step 5: Set Up Cron Jobs

In cPanel:

```
Advanced → Cron Jobs

1. Database Backup (Daily at 2 AM)
   Command: /home/username/cron_backup.sh
   
2. Cleanup old sessions (Weekly)
   Command: source ~/django_app/venv/bin/activate && python ~/django_app/backend/manage.py clearsessions
   
3. Monitor disk space (Daily)
   Command: df -h >> ~/logs/diskspace.log
```

### Step 6: Setup Email Forwarding (Optional)

In cPanel:

```
Mail → Forwarders

1. Create: noreply@yourdomain.com
   Forwards to: your_real_email@gmail.com

2. Create: admin@yourdomain.com
   Forwards to: your_real_email@gmail.com

3. Create: support@yourdomain.com
   Forwards to: your_real_email@gmail.com
```

---

## ✅ TESTING & VERIFICATION

### Step 1: Test API Endpoints

```bash
# Test basic connectivity
curl -I https://yourdomain.com/api/

# Test admin login
curl -X POST https://yourdomain.com/auth/admin/login/ \
  -d "username=admin&password=admin123"

# Test health check
curl https://yourdomain.com/health/
```

### Step 2: Check cPanel Logs

In cPanel:

```
Logs → Error log
Monitor for any Python/Django errors

Logs → Access log
Check if requests are being received
```

### Step 3: Monitor Resource Usage

In cPanel:

```
Resource Usage
- CPU usage
- Memory usage
- Disk space usage
- Bandwidth usage
```

### Step 4: Test Database Connectivity

Create test script: `/home/username/test_db.py`

```python
import os
import sys
import django

# Setup Django
sys.path.insert(0, '/home/username/django_app/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Test database
from django.db import connection
try:
    connection.ensure_connection()
    print("✅ Database connection successful!")
except Exception as e:
    print(f"❌ Database error: {e}")

# Test models
from base.models import Product, Order, User
print(f"✅ Total products: {Product.objects.count()}")
print(f"✅ Total orders: {Order.objects.count()}")
print(f"✅ Total users: {User.objects.count()}")
```

Run test:
```bash
source ~/django_app/venv/bin/activate
python /home/username/test_db.py
```

### Step 5: Admin Panel Access

Visit:
```
https://yourdomain.com/admin/

Username: admin
Password: your_password
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Internal Server Error" (500)

**Check cPanel Error Log:**
1. cPanel → Logs → Error log
2. Look for recent Python/Django errors
3. Check `/home/username/public_html/error_log`

**Solutions:**
```bash
# Check database connection
source ~/django_app/venv/bin/activate
cd ~/django_app/backend
python manage.py shell
>>> from django.db import connection
>>> connection.ensure_connection()
```

### Issue: "Static Files Not Loading" (404)

**Solutions:**
```bash
# 1. Collect static files again
python manage.py collectstatic --noinput --clear

# 2. Check permissions
chmod -R 755 ~/django_app/backend/staticfiles

# 3. Check .htaccess file location
ls -la ~/django_app/backend/staticfiles/.htaccess
```

### Issue: "Module Not Found" Error

**Solutions:**
```bash
# Reinstall dependencies
source ~/django_app/venv/bin/activate
pip install -r ~/django_app/backend/requirements.txt

# Verify installation
pip list | grep Django
```

### Issue: "Database Connection Error"

**Solutions:**
```bash
# 1. Verify credentials in .env
cat ~/django_app/backend/.env | grep DB_

# 2. Test MySQL connection
mysql -u username_cashuser -p -h localhost username_cashmarket

# 3. Check MySQL is running
cPanel → Processes → Search for "MySQL"

# 4. Recreate database
mysql -u username_cashuser -p -e "DROP DATABASE username_cashmarket; CREATE DATABASE username_cashmarket;"
```

### Issue: "Permission Denied"

**Solutions:**
```bash
# Fix permissions
chmod 755 ~/django_app
chmod 755 ~/django_app/backend
chmod 755 ~/django_app/backend/manage.py
chmod 777 ~/django_app/backend/media
chmod 777 ~/django_app/backend/staticfiles

# Fix owner
# Contact hosting provider if you don't have chown access
```

### Issue: "Certificate Error" (SSL)

**Solutions:**
```
cPanel → AutoSSL

1. Check "Automatic SSL" is enabled
2. Click "Install" for your domain
3. Wait for installation (5-10 minutes)
4. Verify: Visit https://yourdomain.com
```

---

## 📊 MONITORING & MAINTENANCE

### Daily Checks

```bash
# 1. Check error logs
tail -20 /home/username/public_html/error_log

# 2. Check disk usage
df -h

# 3. Verify backups ran
ls -la /home/username/backups/ | tail -5
```

### Weekly Tasks

```bash
# Update Django packages
source ~/django_app/venv/bin/activate
pip install --upgrade django djangorestframework

# Clear old sessions
python ~/django_app/backend/manage.py clearsessions

# Test database backup restore
# (Don't actually restore, just test the backup)
```

### Monthly Tasks

```bash
# Update all packages
pip install -r requirements.txt --upgrade

# Review and update .env variables
nano ~/django_app/backend/.env

# Test SSL certificate renewal
# (Should be automatic with AutoSSL)
```

---

## 🔐 SECURITY CHECKLIST

Before going live:

- [ ] `DEBUG = False` in production
- [ ] Unique SECRET_KEY set
- [ ] Database password is strong
- [ ] `.env` file permissions set to 600
- [ ] `.htaccess` files in place
- [ ] SSL certificate installed
- [ ] Static files collected
- [ ] Admin user created
- [ ] Database backup scheduled
- [ ] Logs monitored
- [ ] ALLOWED_HOSTS configured
- [ ] CORS settings correct
- [ ] Email configured
- [ ] Backups tested
- [ ] Error alerts set up

---

## 🎯 QUICK REFERENCE

### Important Paths

```
Project Root:       /home/username/django_app/
Django Project:     /home/username/django_app/backend/
Static Files:       /home/username/django_app/backend/staticfiles/
Media Files:        /home/username/django_app/backend/media/
Virtual Env:        /home/username/django_app/venv/
Settings File:      /home/username/django_app/backend/backend/settings.py
WSGI File:          /home/username/django_app/backend/backend/wsgi.py
```

### Important Commands

```bash
# Activate environment
source ~/django_app/venv/bin/activate

# Collect static
cd ~/django_app/backend && python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Django shell
python manage.py shell

# Check health
python manage.py check

# View logs
tail -f /home/username/public_html/error_log
```

### Important URLs

```
Admin:      https://yourdomain.com/admin/
API Base:   https://yourdomain.com/api/
Auth:       https://yourdomain.com/auth/
Dashboard:  https://yourdomain.com/dashboard/
```

---

## 📞 SUPPORT

**If you encounter issues:**

1. Check error logs in cPanel
2. Check `/home/username/public_html/error_log`
3. SSH into server and check manually
4. Contact Bubal Host support with:
   - Error log excerpt
   - When the error started
   - What you were doing when it occurred

**Bubal Host Support:**
```
Email: support@bubalhost.com
Phone: 1-XXX-XXX-XXXX
Website: https://www.bubalhost.com/support
```

---

## ✨ DEPLOYMENT SUMMARY

```
✅ Upload files to ~/django_app/
✅ Create virtual environment
✅ Install dependencies
✅ Create database in cPanel
✅ Update settings.py with DB credentials
✅ Create .env file with configuration
✅ Upload .htaccess files
✅ Collect static files
✅ Run migrations
✅ Create superuser
✅ Setup email
✅ Setup SSL certificate
✅ Setup monitoring
✅ Test all endpoints
✅ Configure backups
✅ Go live!
```

---

## 🎉 YOU'RE LIVE!

Your Cash Market application is now deployed on Bubal Host cPanel!

**Next Steps:**
- Monitor logs regularly
- Test application functionality
- Setup email notifications
- Configure domain DNS if needed
- Train team on accessing admin panel

**Happy hosting! 🚀**

---

**Document Version:** 1.0.0  
**Hosting Provider:** Bubal Host  
**Last Updated:** March 28, 2026  
**Compatibility:** Django 4.1.6, Python 3.8+, cPanel 11.80+
