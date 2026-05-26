import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from base.models import Order, OrderItem, Product

# Get customer
customer = User.objects.get(email='customer@example.com')
print(f"\n✅ Customer found: {customer.email}")

# Get orders for this customer
orders = customer.order_set.all()
print(f"✅ Customer has {orders.count()} orders\n")

# Display order details with vendor info
for order in orders:
    print(f"Order #{order._id}:")
    print(f"  Total: Rs.{order.totalPrice}")
    print(f"  Status: {'Paid' if order.ispaid else 'Pending'}")
    
    # Get items with vendor info
    items = OrderItem.objects.filter(order=order)
    vendors_set = set()
    
    for item in items:
        vendor = item.product.user
        vendors_set.add(vendor.email)
        print(f"    - {item.name} (Qty: {item.qty}) from {vendor.email}")
    
    print(f"  Vendors: {', '.join(vendors_set)}")
    print()

print("\n✅ Order display with vendor information is properly configured!")
