# 🌐 CASH MARKET - HOSTING & DEPLOYMENT GUIDE

**Version:** 1.0.0  
**Date:** March 28, 2026  

Complete guide to deploy Cash Market to production servers and hosting platforms.

---

## 📑 TABLE OF CONTENTS

1. [Hosting Options](#hosting-options)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Choose Your Hosting](#choose-your-hosting)
4. [Heroku Deployment (Easiest)](#heroku-deployment-easiest)
5. [PythonAnywhere Deployment](#pythonanywhere-deployment)
6. [DigitalOcean Deployment](#digitalocean-deployment)
7. [AWS Deployment](#aws-deployment)
8. [Render.com Deployment](#rendercom-deployment)
9. [General Production Setup](#general-production-setup)
10. [Domain & SSL/HTTPS](#domain--ssltls)
11. [Maintenance & Monitoring](#maintenance--monitoring)

---

## 🏢 HOSTING OPTIONS

### Quick Comparison

| Hosting | Difficulty | Cost | Speed | Best For |
|---------|-----------|------|-------|----------|
| **Heroku** | ⭐ Easy | $7-25/mo | ⚡ Fast | Quick start, small projects |
| **PythonAnywhere** | ⭐⭐ Easy | $5-50/mo | ⚡⚡ Good | Python-specific |
| **DigitalOcean** | ⭐⭐⭐ Medium | $4-24/mo | ⚡⚡⚡ Excellent | Full control, scalable |
| **AWS** | ⭐⭐⭐⭐ Hard | $1-100+/mo | ⚡⚡⚡⚡ Best | Enterprise, complex |
| **Render** | ⭐⭐ Easy | Free-$7/mo | ⚡⚡ Good | Quick deployment |
| **Railway** | ⭐⭐ Easy | Free-$5/mo | ⚡⚡ Good | Node/Python friendly |

---

## ✅ PRE-DEPLOYMENT CHECKLIST

Before deploying, verify these items:

- [ ] No debug mode in production (`DEBUG = False`)
- [ ] SECRET_KEY is secure (not the development key)
- [ ] ALLOWED_HOSTS is configured
- [ ] Database is configured (PostgreSQL recommended)
- [ ] Static files are configured
- [ ] Media files storage is set up
- [ ] Environment variables are in .env file
- [ ] All dependencies in requirements.txt
- [ ] Tests pass locally
- [ ] .gitignore updated (no secrets, venv, db files)
- [ ] Admin user created on server
- [ ] CORS settings configured for frontend
- [ ] Email configuration for notifications
- [ ] SSL/HTTPS certificate obtained

---

## 🎯 CHOOSE YOUR HOSTING

### ✨ Recommended: Heroku (Easiest & Fastest)

**Pros:**
- Free tier available
- One-click deployment from Git
- Automatic SSL
- Database included
- Environment variables UI
- Perfect for portfolio/learning

**Cons:**
- Higher cost at scale
- Slower cold starts
- Limited customization

### 🐍 Alternative: PythonAnywhere (Python-Focused)

**Pros:**
- Python-specific optimization
- Free tier available
- Web-based console
- Automatic Python setup
- Good for beginners

**Cons:**
- More limited than general hosts
- Can be expensive for database
- Slower file uploads

### 💪 Alternative: DigitalOcean (Full Control)

**Pros:**
- Affordable ($4/mo droplets)
- Full server control
- Excellent uptime
- Easy scaling
- Better for larger projects

**Cons:**
- Manual setup required
- Need server knowledge
- More maintenance

### 🚀 Alternative: Render (New & Simple)

**Pros:**
- Free tier with PostgreSQL
- Git integration
- Automatic deploys
- Clean UI
- No credit card required

**Cons:**
- Newer platform
- Smaller community
- Limited documentation

---

## 🎈 HEROKU DEPLOYMENT (EASIEST)

**Total time:** 15 minutes  
**Cost:** Free tier available

### Step 1: Create Heroku Account

1. Go to https://www.heroku.com
2. Click "Sign up"
3. Fill in details
4. Verify email
5. Create account

### Step 2: Install Heroku CLI

**Windows:**
```powershell
# Download installer from:
# https://cli-assets.heroku.com/heroku-x64.exe

# Or use chocolatey:
choco install heroku-cli

# Verify installation:
heroku --version
```

**macOS:**
```bash
brew tap heroku/brew && brew install heroku
heroku --version
```

**Linux:**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
heroku --version
```

### Step 3: Login to Heroku

```bash
heroku login
```

This opens browser for authentication.

### Step 4: Prepare Your Project

**Create `Procfile` in project root:**

```
web: gunicorn backend.wsgi --log-file -
release: python manage.py migrate
```

**Create `runtime.txt` in project root:**

```
python-3.9.16
```

**Update `requirements.txt`:**

```bash
cd "d:\your cart\Digital-Market-master\backend"

# Add production dependencies
pip install gunicorn whitenoise psycopg2-binary django-environ -q

# Update requirements
pip freeze > requirements.txt
```

Result should include:
```
gunicorn==21.2.0
whitenoise==6.5.0
psycopg2-binary==2.9.6
django-environ==0.10.0
...
```

**Update `settings.py`:**

```python
import os
import environ
from pathlib import Path

# Load environment variables
env = environ.Env()
environ.Env.read_env()

# Security
DEBUG = env.bool('DEBUG', False)  # False in production
SECRET_KEY = env('SECRET_KEY', 'your-secret-key-here')
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['localhost', '127.0.0.1'])

# Database - PostgreSQL
if env('USE_POSTGRES'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': env('DB_NAME'),
            'USER': env('DB_USER'),
            'PASSWORD': env('DB_PASSWORD'),
            'HOST': env('DB_HOST'),
            'PORT': env('DB_PORT', default='5432'),
        }
    }
else:
    # Development SQLite
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }

# Static Files (WhiteNoise)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media Files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# CORS
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=['localhost:3000'])

# AWS S3 (optional, for media storage)
if env('USE_S3', False):
    AWS_ACCESS_KEY_ID = env('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = env('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = env('AWS_S3_REGION_NAME')
    # etc...
```

### Step 5: Create `.env.production` File

```
DEBUG=False
SECRET_KEY=your-very-long-secret-key-here-change-this
ALLOWED_HOSTS=yourapp.herokuapp.com,www.yourapp.com
USE_POSTGRES=True
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432
CORS_ALLOWED_ORIGINS=https://frontend.yourapp.com
```

> **⚠️ Never commit .env.production to Git!**

### Step 6: Create Heroku App

```bash
cd "d:\your cart\Digital-Market-master"

# Create app
heroku create your-app-name

# Or with specific buildpack
heroku buildpacks:set heroku/python
```

### Step 7: Set Environment Variables

```bash
# Set variables (from .env.production)
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=your-secret-key
heroku config:set ALLOWED_HOSTS=your-app-name.herokuapp.com
heroku config:set USE_POSTGRES=True

# Add Heroku PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# The addon creates DATABASE_URL automatically
```

### Step 8: Deploy to Heroku

```bash
# Add and commit all changes
git add .
git commit -m "Prepare for Heroku deployment"

# Deploy
git push heroku main
# (or: git push heroku master - depending on branch name)
```

### Step 9: Run Migrations on Server

```bash
# Automatic via Procfile (release command)
# Or manual:
heroku run python manage.py migrate

# Create admin user
heroku run python manage.py createsuperuser

# Collect static files
heroku run python manage.py collectstatic --noinput
```

### Step 10: View Your App

```bash
# Open in browser
heroku open

# View logs
heroku logs --tail
```

**Your app is now live at:** `https://your-app-name.herokuapp.com`

---

## 🐍 PYTHONANYWHERE DEPLOYMENT

**Total time:** 20 minutes  
**Cost:** Free tier available with limitations

### Step 1: Create PythonAnywhere Account

1. Go to https://www.pythonanywhere.com
2. Click "Create account" / "Sign up"
3. Choose plan (free to start)
4. Verify email
5. Set up account

### Step 2: Upload Your Code

```bash
# Option A: Via Git (recommended)
# In PythonAnywhere Web tab:
# New web app -> Clone from git repo
# URL: https://github.com/yourusername/yourrepo.git

# Option B: Upload ZIP from dashboard
# Download your project as ZIP
# Upload through web interface
```

### Step 3: Create Virtual Environment

In PythonAnywhere bash console:

```bash
# Navigate to project
cd /home/yourusername/mysite

# Create virtual environment
mkvirtualenv --python=/usr/bin/python3.9 mysite

# Activate (usually automatic in PythonAnywhere)
source bin/activate

# Install requirements
pip install -r requirements.txt

# Install production server
pip install gunicorn
```

### Step 4: Configure App in Web Tab

1. Go to **Web** tab
2. Click **Add a new web app**
3. Choose Manual configuration
4. Select Python 3.9
5. Configure WSGI file:

**Edit `/home/yourusername/mysite/mysite_wsgi.py`:**

```python
import os
import sys

path = '/home/yourusername/mysite/backend'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

### Step 5: Configure Django Settings

Edit `backend/settings.py`:

```python
ALLOWED_HOSTS = ['yourusername.pythonanywhere.com']
DEBUG = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'yourusername$yourdb',
        'USER': 'yourusername',
        'PASSWORD': 'your-db-password',
        'HOST': 'yourusername.mysql.pythonanywhere-services.com',
    }
}

STATIC_URL = '/static/'
STATIC_ROOT = '/home/yourusername/mysite/static'

MEDIA_URL = '/media/'
MEDIA_ROOT = '/home/yourusername/mysite/media'
```

### Step 6: Collect Static Files

In bash console:

```bash
cd /home/yourusername/mysite/backend
python manage.py collectstatic --noinput
python manage.py migrate
python manage.py createsuperuser
```

### Step 7: Reload Web App

1. Go to **Web** section
2. Click **Reload** button
3. Wait for reload to complete

**Your app is now live at:** `https://yourusername.pythonanywhere.com`

---

## 💻 DIGITALOCEAN DEPLOYMENT

**Total time:** 45 minutes  
**Cost:** $4-6/month for basic droplet

### Step 1: Create DigitalOcean Account

1. Go to https://www.digitalocean.com
2. Sign up
3. Add payment method
4. Verify

### Step 2: Create Droplet

1. Click **Create** → **Droplet**
2. Choose image: **Ubuntu 22.04 LTS**
3. Choose size: **Basic $4-6/month**
4. Choose region: Pick closest to users
5. Add SSH key (or use password)
6. Click **Create Droplet**

Wait for droplet to be created (~1 minute).

### Step 3: SSH into Droplet

```bash
# Get IP from DigitalOcean dashboard
ssh root@your_droplet_ip

# Or if you set up SSH key
ssh -i ~/.ssh/do_rsa root@your_droplet_ip
```

### Step 4: System Setup

```bash
# Update system
apt update && apt upgrade -y

# Install Python and tools
apt install -y python3.10 python3-pip python3-venv

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx (reverse proxy)
apt install -y nginx

# Install Supervisor (process manager)
apt install -y supervisor

# Install Git
apt install -y git
```

### Step 5: Create Application User

```bash
# Create user for app
adduser cashmarket
# Set password and details

# Give sudo access
usermod -aG sudo cashmarket

# Switch to user
su - cashmarket
```

### Step 6: Clone Your Project

```bash
# As cashmarket user
cd ~
git clone https://github.com/yourusername/cash-market.git
cd cash-market
```

### Step 7: Setup Python Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn psycopg2-binary
```

### Step 8: Setup PostgreSQL Database

```bash
# As root
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE cashmarket;
CREATE USER cashuser WITH PASSWORD 'securepassword123';
ALTER ROLE cashuser SET client_encoding TO 'utf8';
ALTER ROLE cashuser SET default_transaction_isolation TO 'read committed';
ALTER ROLE cashuser SET default_transaction_deferrable TO on;
ALTER ROLE cashuser SET default_transaction_read_committed TO off;
ALTER ROLE cashuser SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE cashmarket TO cashuser;
\q
```

### Step 9: Configure Django

Edit `backend/settings.py`:

```python
DEBUG = False
ALLOWED_HOSTS = ['your_droplet_ip', 'yourdomain.com', 'www.yourdomain.com']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'cashmarket',
        'USER': 'cashuser',
        'PASSWORD': 'securepassword123',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

### Step 10: Collect Static Files & Migrate

```bash
# As cashmarket user in project directory
source venv/bin/activate
cd backend

python manage.py collectstatic --noinput
python manage.py migrate
python manage.py createsuperuser
```

### Step 11: Configure Gunicorn

Create `/home/cashmarket/gunicorn_config.py`:

```python
import multiprocessing

bind = "127.0.0.1:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
```

### Step 12: Configure Supervisor (Auto-Start)

Create `/etc/supervisor/conf.d/cashmarket.conf`:

```ini
[program:cashmarket]
directory=/home/cashmarket/cash-market/backend
command=/home/cashmarket/cash-market/venv/bin/gunicorn \
    --config /home/cashmarket/gunicorn_config.py \
    backend.wsgi:application
user=cashmarket
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/home/cashmarket/logs/gunicorn.log
```

Enable and start:

```bash
sudo mkdir -p /home/cashmarket/logs
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start cashmarket
```

### Step 13: Configure Nginx

Create `/etc/nginx/sites-available/cashmarket`:

```nginx
upstream cashmarket_app {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name your_droplet_ip yourdomain.com www.yourdomain.com;

    client_max_body_size 20M;

    location /static/ {
        alias /home/cashmarket/cash-market/backend/staticfiles/;
    }

    location /media/ {
        alias /home/cashmarket/cash-market/backend/media/;
    }

    location / {
        proxy_pass http://cashmarket_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/cashmarket /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 14: Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx

sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

**Your app is now live at:** `https://yourdomain.com`

---

## ☁️ AWS DEPLOYMENT

**Total time:** 60 minutes  
**Cost:** Free tier available, then ~$5-20/month

### Step 1: Setup AWS Account

1. Go to https://aws.amazon.com
2. Create account
3. Verify email and phone
4. Choose plan

### Step 2: Create EC2 Instance

1. Go to **EC2 Dashboard**
2. Click **Launch Instance**
3. Choose **Ubuntu 22.04 LTS**
4. Instance type: **t3.micro** (free tier eligible)
5. Storage: **30GB gp3**
6. Create security group:
   - Allow SSH (port 22)
   - Allow HTTP (port 80)
   - Allow HTTPS (port 443)
7. Launch

### Step 3: Connect to Instance

```bash
# Download key pair from AWS console
# Set permissions
chmod 400 your-key-pair.pem

# SSH into instance
ssh -i your-key-pair.pem ubuntu@your_instance_public_ip
```

### Step 4-10: Follow DigitalOcean Steps Above

The setup is nearly identical to DigitalOcean:
- System setup
- Create user
- Clone project
- Setup Python
- Setup PostgreSQL
- Configure Django
- Collect static files
- Configure Gunicorn/Supervisor/Nginx

### Specific AWS Notes:

**Use RDS for Database (optional but recommended):**

1. Go to **RDS** → **Create database**
2. Choose **PostgreSQL**
3. Choose **Free tier**
4. Configure security group
5. Get endpoint
6. Update `settings.py` with RDS endpoint

**Use S3 for Static/Media Files (optional):**

```bash
pip install boto3 django-storages
```

---

## 🚀 RENDER.COM DEPLOYMENT

**Total time:** 10 minutes  
**Cost:** Free tier available!

### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Connect GitHub account

### Step 2: Create Web Service

1. Click **+ New**
2. Select **Web Service**
3. Connect GitHub repo
4. Choose repository

### Step 3: Configure Deployment

**Settings:**
- **Name:** cashmarket
- **Environment:** Python
- **Region:** Auto
- **Branch:** main
- **Build Command:** `pip install -r requirements.txt && python manage.py collectstatic --noinput`
- **Start Command:** `gunicorn backend.wsgi:application --log-file -`

### Step 4: Set Environment Variables

```
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=cashmarket.onrender.com
DATABASE_URL=postgresql://...
```

### Step 5: Add PostgreSQL Database

1. In Render dashboard
2. Click **+ New**
3. Select **PostgreSQL**
4. Connect to web service

### Step 6: Deploy

Click **Deploy** - automatically deploys from GitHub!

**Your app is live at:** `https://cashmarket.onrender.com`

---

## 🛠️ GENERAL PRODUCTION SETUP

### Security Checklist

```python
# settings.py

# 1. Debug Mode OFF
DEBUG = False

# 2. Secret Key (change from development!)
SECRET_KEY = os.environ.get('SECRET_KEY')

# 3. Allowed Hosts
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

# 4. HTTPS
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# 5. CORS
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]

# 6. Database Password (from environment)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# 7. Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')

# 8. Security Headers
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# 9. XSS Protection
SECURE_BROWSER_XSS_FILTER = True

# 10. Content Type / MIME Type Checking
SECURE_CONTENT_SECURITY_POLICY = {
    'default-src': ("'self'",),
    'script-src': ("'self'", "'unsafe-inline'"),
}
```

### Database Backup Strategy

```bash
# Weekly backup script
#!/bin/bash

DB_NAME="cashmarket"
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup
pg_dump $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Upload to cloud (optional)
# aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://my-backups/

echo "Backup completed: $DATE"
```

Add to crontab:
```
# Run daily at 2 AM
0 2 * * * /home/cashmarket/backup.sh
```

### Monitor Application Health

```python
# health_check.py
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
def health_check(request):
    """Health check endpoint for monitoring"""
    return JsonResponse({
        'status': 'healthy',
        'database': 'connected',
        'timestamp': time.time()
    })
```

Add to `urls.py`:
```python
path('health/', health_check, name='health_check'),
```

Monitor with:
```bash
# Every 5 minutes check health
*/5 * * * * curl -f https://yourdomain.com/health/ || alert
```

---

## 🌐 DOMAIN & SSL/HTTPS

### Register Domain

**Popular registrars:**
- GoDaddy
- Namecheap  
- Google Domains
- Cloudflare

**Steps:**
1. Search for domain
2. Add to cart
3. Checkout
4. Configure DNS (next step)

### Point Domain to Server

**For Heroku:**
```
In Heroku dashboard:
Settings → Domains → Add Domain
Use Heroku's DNS instructions
```

**For DigitalOcean/Others:**
```
In registrar dashboard:
DNS Settings → Add A Record
Hostname: @
Points to: Your server IP

For www:
Hostname: www
CNAME: yourdomain.com
```

### Setup HTTPS/SSL

**Automatic (Recommended):**
```bash
# Let's Encrypt (free)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Or with webroot
sudo certbot certonly --webroot -w /var/www/html \
    -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

**Manual:**
1. Buy certificate from registrar ($10-100/year)
2. Upload to server
3. Update Nginx/Apache config

---

## 📊 MAINTENANCE & MONITORING

### Regular Tasks

```bash
# Daily: Check logs
tail -f /var/log/nginx/error.log
tail -f /home/cashmarket/logs/gunicorn.log

# Weekly: Database backup
pg_dump cashmarket > backup_$(date +%Y%m%d).sql

# Monthly: Update packages
pip install --upgrade pip
pip install -r requirements.txt --upgrade

# Quarterly: Security updates
sudo apt update && sudo apt upgrade

# Yearly: Certificate renewal check
certbot renew --dry-run
```

### Monitoring Tools

**Option 1: Simple Email Alerts**
```bash
# In crontab
0 * * * * curl -f https://yourdomain.com/health/ || \
    mail -s "Site Down!" admin@yourdomain.com
```

**Option 2: Monitoring Services**
- Uptime Robot (free): https://uptimerobot.com
- New Relic: https://newrelic.com
- DataDog: https://www.datadoghq.com
- Sentry (errors): https://sentry.io

**Option 3: Server Monitoring**
```bash
# Install monitoring tool
sudo apt install -y netdata

# Access at http://localhost:19999
```

### Log Rotation

Create `/etc/logrotate.d/cashmarket`:
```
/home/cashmarket/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 cashmarket cashmarket
}
```

### Performance Optimization

```python
# Cache Configuration (settings.py)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}

# Database Connection Pooling
DATABASES = {
    'default': {
        # ... other settings
        'CONN_MAX_AGE': 600,  # Connection pooling
    }
}

# Gzip Compression
MIDDLEWARE = [
    'django.middleware.gzip.GZipMiddleware',
    # ... other middleware
]

# CDN for Static Files (optional)
STATIC_URL = 'https://cdn.yourdomain.com/static/'
```

---

## 🐛 TROUBLESHOOTING DEPLOYMENT

### Issue: "502 Bad Gateway"

**Solutions:**
```bash
# Check Gunicorn status
sudo supervisorctl status cashmarket

# Restart Gunicorn
sudo supervisorctl restart cashmarket

# Check logs
sudo tail -50 /var/log/supervisor/cashmarket.log

# Check Nginx
sudo nginx -t
sudo systemctl restart nginx

# Check database connection
python manage.py shell
> from django.db import connection
> connection.ensure_connection()
```

### Issue: "Static files not loading"

**Solutions:**
```bash
# Collect static files
python manage.py collectstatic --noinput --clear

# Check Nginx static location
grep -n "location /static" /etc/nginx/sites-available/cashmarket

# Set correct permissions
sudo chown -R cashmarket:cashmarket /home/cashmarket/cash-market/backend/staticfiles/

# Restart Nginx
sudo systemctl restart nginx
```

### Issue: "Database connection error"

**Solutions:**
```bash
# Check PostgreSQL service
sudo systemctl status postgresql

# Check database exists
sudo -u postgres psql -l | grep cashmarket

# Check user permissions
sudo -u postgres psql -c "\du"

# Verify connection string
python manage.py shell
> import os
> print(os.environ.get('DATABASE_URL'))
```

### Issue: "Slow page loads"

**Check:**
```bash
# Check server resources
top
free -h
df -h

# Check database queries
python manage.py shell
> from django.db import connection
> from django.test.utils import CaptureQueriesContext
> with CaptureQueriesContext(connection) as ctx:
>     # your code
> print(f"{len(ctx.captured_queries)} queries")

# Enable database query logging
# settings.py:
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {'class': 'logging.StreamHandler'},
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

---

## 📋 DEPLOYMENT COMPARISON TABLE

| Task | Heroku | PythonAnywhere | DigitalOcean | AWS | Render |
|------|--------|----------------|--------------|-----|--------|
| Setup Time | 10 min | 15 min | 45 min | 60 min | 10 min |
| Free Tier | Yes | Yes | No | Limited | Yes |
| Monthly Cost | $7+ | $5+ | $4+ | $5+ | $0-7 |
| Easiest | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ |
| Control | Limited | Medium | Full | Full | Medium |
| Scalability | Easy | Medium | Easy | Easy | Easy |

---

## 🎯 RECOMMENDED DEPLOYMENT PATH

### For Learning / Portfolio:
```
Start → Heroku or Render → Deploy in 10 minutes
```

### For Small Project:
```
Start → PythonAnywhere → Scale using DigitalOcean
```

### For Production / Scaling:
```
Start → DigitalOcean/AWS → Add CDN → Setup monitoring
```

---

## 📚 ADDITIONAL RESOURCES

### Documentation
- Django Deployment: https://docs.djangoproject.com/en/4.1/howto/deployment/
- Heroku Python: https://devcenter.heroku.com/articles/deploying-python
- DigitalOcean Guides: https://www.digitalocean.com/docs/
- AWS Documentation: https://docs.aws.amazon.com/

### Tools
- Gunicorn: https://gunicorn.org/
- Nginx: https://nginx.org/
- PostgreSQL: https://www.postgresql.org/
- Redis: https://redis.io/

### Tutorials
- Real Python: https://realpython.com/
- Full Stack Python: https://www.fullstackpython.com/
- MDN Django: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django

---

## ✅ FINAL DEPLOYMENT CHECKLIST

Before going live:

- [ ] `DEBUG = False` in production settings
- [ ] Secret key is unique and secure
- [ ] Database is PostgreSQL (not SQLite)
- [ ] ALLOWED_HOSTS configured correctly
- [ ] Static files collected and serving
- [ ] Media files storage configured
- [ ] HTTPS/SSL certificate active
- [ ] Email configured for notifications
- [ ] Admin user created on server
- [ ] Backups scheduled
- [ ] Monitoring set up
- [ ] Error tracking configured (Sentry)
- [ ] Logs being monitored
- [ ] CORS settings correct for frontend
- [ ] Database user has limited permissions
- [ ] App tested on production server
- [ ] Team knows deployment process
- [ ] Rollback plan documented

---

## 🎉 YOU'RE READY TO DEPLOY!

Choose your hosting platform from the options above and follow the step-by-step guide. Most deployments take 10-60 minutes.

**Questions?**
- Check the specific platform's documentation
- Review logs: `tail -f logs/` or platform's log viewer
- Test locally first: `DEBUG=False python manage.py runserver`

**Happy deploying! 🚀**

---

**Document Version:** 1.0.0  
**Last Updated:** March 28, 2026  
**Compatibility:** Django 4.1.6, Python 3.8+
