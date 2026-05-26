import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

try:
    admin_user = User.objects.get(email='admin@example.com')
    print(f"Admin user found: {admin_user.username}")
    print(f"Is staff: {admin_user.is_staff}")
    print(f"Is superuser: {admin_user.is_superuser}")
    
    if not admin_user.is_staff or not admin_user.is_superuser:
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()
        print("✅ Admin permissions updated!")
    else:
        print("✅ Admin already has proper permissions")
except User.DoesNotExist:
    print("❌ Admin user not found")
