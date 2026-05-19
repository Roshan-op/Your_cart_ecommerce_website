"""
Management command to populate product sizes and gender data based on category
"""
from django.core.management.base import BaseCommand
from base.models import Product
import json


class Command(BaseCommand):
    help = 'Populate product sizes and gender information based on category'

    def handle(self, *args, **options):
        # Define size templates based on category
        size_templates = {
            'Footwear': ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
            'Clothing': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            'Accessories': None,  # No sizes needed
            'Bags': None,  # No sizes needed
            'Electronics': None,  # No sizes needed
            'Home & Decor': None,  # No sizes needed
        }

        # Gender mapping based on product name keywords
        gender_keywords = {
            'Male': ['men', "men's", 'male', 'boy', 'gents'],
            'Female': ['women', "women's", 'female', 'girl', 'ladies', 'lady'],
            'Both': ['unisex', 'both', 'universal', 'all']
        }

        updated_count = 0
        
        for product in Product.objects.all():
            gender = 'both'  # default
            
            # Determine gender from product name
            product_name_lower = product.name.lower() if product.name else ''
            for gender_label, keywords in gender_keywords.items():
                if any(keyword in product_name_lower for keyword in keywords):
                    gender = gender_label.lower()
                    break
            
            # Get sizes from category
            category = product.category if product.category else ''
            sizes = size_templates.get(category)
            
            # Update product
            product.gender = gender
            if sizes:
                product.available_sizes = ','.join(sizes)
            
            product.save()
            updated_count += 1
            
            self.stdout.write(
                self.style.SUCCESS(
                    f"Updated: {product.name} - Gender: {gender}, Category: {category}"
                )
            )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n✅ Successfully updated {updated_count} products with sizes and gender data'
            )
        )
