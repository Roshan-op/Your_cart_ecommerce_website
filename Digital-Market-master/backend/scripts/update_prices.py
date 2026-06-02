#!/usr/bin/env python
import os
import sys
import django
import random

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from base.models import Product

# Get all products
products = Product.objects.all()
count = 0

for product in products:
    # Set price to a value less than 13
    # Range: 3-12
    product.price = round(random.uniform(3, 12), 2)
    product.save()
    count += 1

print(f"✓ Updated {count} products with prices less than 13")

# Show sample prices
print("\nSample products after update:")
for product in Product.objects.all()[:5]:
    print(f"  {product.name}: Rs. {product.price}")

# Show statistics
all_products = list(Product.objects.all())
min_price = min(p.price for p in all_products)
max_price = max(p.price for p in all_products)
avg_price = sum(p.price for p in all_products) / len(all_products)

print(f"\nPrice Statistics:")
print(f"  Min: Rs. {min_price}")
print(f"  Max: Rs. {max_price}")
print(f"  Avg: Rs. {avg_price:.2f}")
