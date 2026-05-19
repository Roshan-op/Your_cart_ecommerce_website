"""
Script to reset all users and create new users with different roles
Run with: python manage.py shell < scripts/reset_users.py
"""

from django.contrib.auth.models import User

# Delete all existing users
print("🗑️  Deleting all existing users...")
User.objects.all().delete()
print("✓ All users deleted")

# Create Admin User
print("\n👨‍💼 Creating Admin User...")
admin = User.objects.create_superuser(
    username='admin',
    email='admin@digitalmarket.com',
    password='Admin@123456',
    first_name='Admin',
    last_name='Manager'
)
admin.save()
print(f"✓ Admin created: {admin.username}")

# Create Vendor Users
print("\n🏪 Creating Vendor Users...")
vendors = [
    {
        'username': 'vendor1',
        'email': 'vendor1@shop.com',
        'password': 'Vendor@123456',
        'first_name': 'Raj',
        'last_name': 'Kumar'
    },
    {
        'username': 'vendor2',
        'email': 'vendor2@shop.com',
        'password': 'Vendor@234567',
        'first_name': 'Priya',
        'last_name': 'Singh'
    },
    {
        'username': 'vendor3',
        'email': 'vendor3@shop.com',
        'password': 'Vendor@345678',
        'first_name': 'Arjun',
        'last_name': 'Patel'
    }
]

for vendor_data in vendors:
    vendor = User.objects.create_user(
        username=vendor_data['username'],
        email=vendor_data['email'],
        password=vendor_data['password'],
        first_name=vendor_data['first_name'],
        last_name=vendor_data['last_name']
    )
    vendor.is_staff = True
    vendor.save()
    print(f"✓ Vendor created: {vendor.username} ({vendor.email})")

# Create Customer Users
print("\n👤 Creating Customer Users...")
customers = [
    {
        'username': 'john_doe',
        'email': 'john@example.com',
        'password': 'Customer@123456',
        'first_name': 'John',
        'last_name': 'Doe'
    },
    {
        'username': 'sarah_smith',
        'email': 'sarah@example.com',
        'password': 'Customer@234567',
        'first_name': 'Sarah',
        'last_name': 'Smith'
    },
    {
        'username': 'mike_jones',
        'email': 'mike@example.com',
        'password': 'Customer@345678',
        'first_name': 'Mike',
        'last_name': 'Jones'
    },
    {
        'username': 'emma_wilson',
        'email': 'emma@example.com',
        'password': 'Customer@456789',
        'first_name': 'Emma',
        'last_name': 'Wilson'
    },
    {
        'username': 'david_brown',
        'email': 'david@example.com',
        'password': 'Customer@567890',
        'first_name': 'David',
        'last_name': 'Brown'
    }
]

for customer_data in customers:
    customer = User.objects.create_user(
        username=customer_data['username'],
        email=customer_data['email'],
        password=customer_data['password'],
        first_name=customer_data['first_name'],
        last_name=customer_data['last_name']
    )
    customer.save()
    print(f"✓ Customer created: {customer.username} ({customer.email})")

print("\n" + "="*60)
print("✅ USER SETUP COMPLETE!")
print("="*60)
