#!/usr/bin/env python3
"""
Import Enriched Products into Django Database
Converts enriched JSON data back into Product model format
"""

import os
import django
import json
from pathlib import Path

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from base.models import Product

def import_enriched_products(json_file_path):
    """Import enriched products from JSON file"""
    
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    products_data = data.get('products', [])
    print(f"Importing {len(products_data)} enriched products...\n")
    
    created_count = 0
    updated_count = 0
    failed_count = 0
    
    for product_data in products_data:
        try:
            product_id = product_data.get('id')
            
            # Try to get existing product
            try:
                product = Product.objects.get(_id=product_id)
                is_new = False
            except Product.DoesNotExist:
                product = Product()
                is_new = True
            
            # Update product fields with enriched data
            product._id = product_id
            product.name = product_data.get('name', product_data.get('original_name', ''))
            
            # Build rich description from enriched data
            description_parts = []
            desc_obj = product_data.get('description', {})
            if desc_obj.get('short'):
                description_parts.append(f"**{desc_obj['short']}**\n")
            
            if desc_obj.get('detailed'):
                description_parts.append(f"\n{desc_obj['detailed']}\n")
            
            if desc_obj.get('highlights'):
                highlights = "\n".join([f"• {h}" for h in desc_obj['highlights'][:6]])
                description_parts.append(f"\n**Key Features:**\n{highlights}")
            
            product.description = "\n".join(description_parts) if description_parts else "Premium quality product with excellent features"
            
            # Update basic fields
            product.brand = product_data.get('brand', '')
            product.price = float(product_data.get('price', 10))
            product.countInStock = product_data.get('stock', 10)
            product.rating = product_data.get('rating', 0) if product_data.get('rating') else 0
            product.numReviews = product_data.get('numReviews', 0)
            
            # Note: category field in enriched data
            product.category = product_data.get('category', 'Other')
            
            # Save product
            product.save()
            
            if is_new:
                created_count += 1
                status = "✅ CREATED"
            else:
                updated_count += 1
                status = "🔄 UPDATED"
            
            print(f"{status} | ID: {product_id:3d} | {product.name[:50]}")
            
        except Exception as e:
            failed_count += 1
            print(f"❌ FAILED | ID: {product_data.get('id', '?')} | Error: {str(e)[:50]}")
    
    print(f"\n{'='*70}")
    print(f"Import Summary:")
    print(f"  ✅ Created: {created_count}")
    print(f"  🔄 Updated: {updated_count}")
    print(f"  ❌ Failed: {failed_count}")
    print(f"  📊 Total: {created_count + updated_count}")
    print(f"{'='*70}")
    
    return created_count, updated_count, failed_count

def main():
    """Main execution"""
    json_file = Path("d:/your cart/enriched_products_complete.json")
    
    if not json_file.exists():
        print(f"❌ Error: File not found: {json_file}")
        return
    
    print("🚀 Starting Product Import")
    print(f"📂 Source: {json_file}\n")
    
    created, updated, failed = import_enriched_products(str(json_file))
    
    if failed == 0:
        print("\n✅ All products imported successfully!")
    else:
        print(f"\n⚠️  {failed} products failed to import")

if __name__ == "__main__":
    main()
