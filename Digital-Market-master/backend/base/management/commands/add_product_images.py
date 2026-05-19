"""
Management command to add sample additional images to products
Replace these URLs with your actual product image URLs
"""

from django.core.management.base import BaseCommand
from base.models import Product
import json


class Command(BaseCommand):
    help = 'Add multiple images to products'

    def handle(self, *args, **options):
        # Example: Add additional images to products
        # Format: {product_id: [list of image URLs]}
        
        PRODUCTS_WITH_IMAGES = {
            # Nike Air Force (product_id 18)
            18: [
                "/media/products/nike_af1_side.jpg",
                "/media/products/nike_af1_top.jpg",
                "/media/products/nike_af1_front.jpg",
                "/media/products/nike_af1_back.jpg",
            ],
            # MacBook Pro (product_id 13)
            13: [
                "/media/products/macbook_closed.jpg",
                "/media/products/macbook_open.jpg",
                "/media/products/macbook_keyboard.jpg",
                "/media/products/macbook_screen.jpg",
            ],
            # Red iPhone 7 (product_id 25)
            25: [
                "/media/products/iphone7_front.jpg",
                "/media/products/iphone7_back.jpg",
                "/media/products/iphone7_side.jpg",
                "/media/products/iphone7_screen.jpg",
            ],
        }

        updated_count = 0

        for product_id, images in PRODUCTS_WITH_IMAGES.items():
            try:
                product = Product.objects.get(_id=product_id)
                # Store images as JSON array
                product.additional_images = json.dumps(images)
                product.save()
                updated_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"✅ Added {len(images)} images to: {product.name}"
                    )
                )
            except Product.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f"⚠️  Product {product_id} not found")
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n✅ Updated {updated_count} products with images'
            )
        )

        self.stdout.write(
            self.style.WARNING(
                "\n📝 Note: Upload actual images to /media/products/ folder or use external image URLs"
            )
        )
