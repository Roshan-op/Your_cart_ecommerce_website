"""
Sample command to add size and gender data to products.
Run this after migration to populate your existing products.
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from base.models import Product

# Sample data mapping for your products
PRODUCTS_DATA = {
    # Footwear products (these should already be categorized as Footwear)
    # Add sizes 3-13 for all footwear
    
    # Clothing products - Map to clothing sizes
    2: {'name': "Men's Jacket", 'gender': 'male', 'sizes': 'XS,S,M,L,XL,XXL'},
    6: {'name': "Men's Hoodies", 'gender': 'male', 'sizes': 'XS,S,M,L,XL,XXL'},
    20: {'name': "Men's Jacket", 'gender': 'male', 'sizes': 'XS,S,M,L,XL,XXL'},
    21: {'name': "Hoodie", 'gender': 'both', 'sizes': 'XS,S,M,L,XL,XXL'},
    23: {'name': "T-shirt", 'gender': 'both', 'sizes': 'XS,S,M,L,XL,XXL'},
    49: {'name': "Hoodie and Paint Set", 'gender': 'both', 'sizes': 'XS,S,M,L,XL,XXL'},
    
    # Accessories (no sizes needed)
    9: {'name': "Hand Bracelet", 'gender': 'both', 'sizes': ''},
    24: {'name': "Pocket Watch", 'gender': 'both', 'sizes': ''},
    30: {'name': "Women's Watch", 'gender': 'female', 'sizes': ''},
    31: {'name': "Men's Watch", 'gender': 'male', 'sizes': ''},
}

# Update products
for product_id, data in PRODUCTS_DATA.items():
    try:
        product = Product.objects.get(_id=product_id)
        product.gender = data.get('gender', 'both')
        if data.get('sizes'):
            product.available_sizes = data['sizes']
        product.save()
        print(f"✅ Updated: {product.name}")
    except Product.DoesNotExist:
        print(f"❌ Product {product_id} not found")

print("\n✅ Done! Now visit http://localhost:3000/product/[id] to see sizes in action")
