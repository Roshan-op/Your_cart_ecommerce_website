#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from base.models import Product

# Check if products exist
total_products = Product.objects.count()
print(f"Total products in database: {total_products}")

if total_products > 0:
    # Check a few products
    print("\nFirst 5 products:")
    for i, product in enumerate(Product.objects.all()[:5], 1):
        print(f"  {i}. {product.name} (ID: {product._id}, Price: Rs. {product.price}, Category: {product.category})")
    
    # Check for any with null prices
    null_prices = Product.objects.filter(price__isnull=True).count()
    print(f"\nProducts with NULL prices: {null_prices}")
    
    # Check for any without categories
    null_category = Product.objects.filter(category__isnull=True).count()
    print(f"Products with NULL category: {null_category}")
else:
    print("No products found in database!")
