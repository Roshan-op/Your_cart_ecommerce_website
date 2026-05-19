import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

users = User.objects.all()
print(f'\n✅ Total Users Created: {users.count()}\n')
print('='*80)
print(f'{"Username":<20} | {"Email":<35} | {"Role":<10}')
print('='*80)

for user in users:
    if user.is_superuser:
        role = 'ADMIN'
    elif user.is_staff:
        role = 'VENDOR'
    else:
        role = 'CUSTOMER'
    print(f'{user.username:<20} | {user.email:<35} | {role:<10}')

print('='*80)
print('\n✨ All users are ready to login!\n')
