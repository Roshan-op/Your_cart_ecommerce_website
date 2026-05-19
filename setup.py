#!/usr/bin/env python
"""
Cash Market - Setup & Start Script
Initializes the database and creates test users
"""

import os
import sys
import django
from pathlib import Path

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
sys.path.insert(0, str(Path(__file__).resolve().parent / 'Digital-Market-master' / 'backend'))

django.setup()

from django.contrib.auth.models import User
from django.core.management import call_command

def create_test_users():
    """Create test admin and vendor users"""
    
    print("\n" + "="*60)
    print("CASH MARKET - INITIAL SETUP")
    print("="*60 + "\n")
    
    # Create Admin User
    print("[1/2] Creating Admin User...")
    User.objects.filter(username='admin').delete()
    admin = User.objects.create_superuser(
        username='admin',
        email='admin@cashmarket.com',
        password='admin123'
    )
    print("✅ Admin user created successfully!")
    print("   Username: admin")
    print("   Password: admin123")
    print("   Email: admin@cashmarket.com")
    
    # Create Vendor User
    print("\n[2/2] Creating Vendor User...")
    User.objects.filter(username='vendor').delete()
    vendor = User.objects.create_user(
        username='vendor',
        email='vendor@cashmarket.com',
        password='vendor123',
        is_staff=True
    )
    print("✅ Vendor user created successfully!")
    print("   Username: vendor")
    print("   Password: vendor123")
    print("   Email: vendor@cashmarket.com")
    
    print("\n" + "="*60)
    print("SETUP COMPLETE!")
    print("="*60)
    print("\n📝 TEST CREDENTIALS:\n")
    print("🔐 ADMIN LOGIN:")
    print("   URL: http://localhost:8000/auth/admin/login/")
    print("   Username: admin")
    print("   Password: admin123")
    print("\n🏪 VENDOR LOGIN:")
    print("   URL: http://localhost:8000/auth/vendor/login/")
    print("   Username: vendor")
    print("   Password: vendor123")
    print("\n📝 NEW VENDOR SIGNUP:")
    print("   URL: http://localhost:8000/auth/customer/signup/")
    print("\n" + "="*60 + "\n")

def run_migrations():
    """Run database migrations"""
    print("[INFO] Running database migrations...")
    call_command('migrate', '--noinput')
    print("✅ Migrations completed!\n")

if __name__ == '__main__':
    try:
        # Run migrations
        run_migrations()
        
        # Create test users
        create_test_users()
        
        print("You can now start the server with:")
        print("  python manage.py runserver")
        print("\nOr use the batch file:")
        print("  start_server.bat")
        
    except Exception as e:
        print(f"\n❌ Error during setup: {str(e)}")
        sys.exit(1)
