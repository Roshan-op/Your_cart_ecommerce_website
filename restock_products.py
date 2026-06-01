#!/usr/bin/env python
"""
Restock all products to have adequate stock
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from base.models import Product

# Get all products
products = Product.objects.all()

# Update each product to have stock of 50
updated_count = 0
for product in products:
    product.countInStock = 50
    product.save()
    updated_count += 1
    print(f"✓ Restocked: {product.name} ({product.countInStock} units)")

print(f"\n✅ Total products restocked: {updated_count}")
print("All products now have 50 units in stock!")
