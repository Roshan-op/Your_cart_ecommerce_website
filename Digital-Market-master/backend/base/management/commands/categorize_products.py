from django.core.management.base import BaseCommand
from base.models import Product
from collections import defaultdict

class Command(BaseCommand):
    help = 'Categorize and differentiate products in the database'

    def handle(self, *args, **options):
        """
        Categorize products based on keywords and update their categories
        """
        
        # Define category mapping based on keywords
        category_keywords = {
            'Footwear': ['shoes', 'sneaker', 'heels', 'footwear', 'air force', 'huarache', 'max'],
            'Clothing': ['hoodie', 'jacket', 'shirt', 't-shirt', 'tshirt', 'pants', 'coat', 'dress', 'wears'],
            'Accessories': ['watch', 'bracelet', 'necklace', 'earring', 'belt', 'scarf', 'hat'],
            'Bags': ['bag', 'backpack', 'handbag', 'crossbody', 'luggage', 'purse'],
            'Electronics': ['headphone', 'earphone', 'mouse', 'keyboard', 'camera', 'laptop', 'phone', 'iphone', 'dslr'],
            'Home & Decor': ['clock', 'vase', 'cup', 'ceramic', 'pot', 'wall', 'interior'],
        }
        
        # Analyze products
        products = Product.objects.all()
        categorization_report = defaultdict(list)
        uncategorized = []
        
        for product in products:
            categorized = False
            product_name = (product.name + ' ' + (product.brand or '') + ' ' + (product.description or '')).lower()
            
            for main_category, keywords in category_keywords.items():
                for keyword in keywords:
                    if keyword.lower() in product_name:
                        if product.category != main_category:
                            product.category = main_category
                            product.save()
                            self.stdout.write(
                                self.style.SUCCESS(
                                    f"✓ Updated: {product.name} → {main_category}"
                                )
                            )
                        categorization_report[main_category].append(product)
                        categorized = True
                        break
                if categorized:
                    break
            
            if not categorized:
                uncategorized.append(product)
                self.stdout.write(
                    self.style.WARNING(
                        f"? Uncategorized: {product.name} (ID: {product._id})"
                    )
                )
        
        # Print summary
        self.stdout.write("\n" + "="*60)
        self.stdout.write(self.style.SUCCESS("PRODUCT CATEGORIZATION SUMMARY"))
        self.stdout.write("="*60 + "\n")
        
        for category, items in sorted(categorization_report.items()):
            self.stdout.write(
                self.style.SUCCESS(f"\n📦 {category.upper()} ({len(items)} products)")
            )
            self.stdout.write("-" * 60)
            for product in items:
                self.stdout.write(
                    f"  • {product._id}: {product.name} | "
                    f"Brand: {product.brand or 'N/A'} | "
                    f"Price: Rs. {product.price} | "
                    f"Stock: {product.countInStock}"
                )
        
        if uncategorized:
            self.stdout.write(
                self.style.WARNING(f"\n⚠️  UNCATEGORIZED ({len(uncategorized)} products)")
            )
            self.stdout.write("-" * 60)
            for product in uncategorized:
                self.stdout.write(
                    f"  • {product._id}: {product.name} | "
                    f"Brand: {product.brand or 'N/A'} | "
                    f"Price: Rs. {product.price}"
                )
        
        # Print statistics
        self.stdout.write("\n" + "="*60)
        self.stdout.write(self.style.SUCCESS("STATISTICS"))
        self.stdout.write("="*60)
        self.stdout.write(f"Total Products: {products.count()}")
        self.stdout.write(f"Categorized: {sum(len(items) for items in categorization_report.values())}")
        self.stdout.write(f"Uncategorized: {len(uncategorized)}")
        
        # Price analysis
        self.stdout.write(f"\nPrice Range Analysis:")
        all_prices = [p.price for p in products if p.price]
        if all_prices:
            self.stdout.write(f"  Min Price: Rs. {min(all_prices)}")
            self.stdout.write(f"  Max Price: Rs. {max(all_prices)}")
            self.stdout.write(f"  Avg Price: Rs. {sum(all_prices)/len(all_prices):.2f}")
        
        # Stock analysis
        self.stdout.write(f"\nStock Level Analysis:")
        total_stock = sum(p.countInStock or 0 for p in products)
        self.stdout.write(f"  Total Stock: {total_stock} units")
        low_stock = [p for p in products if p.countInStock and p.countInStock < 5]
        if low_stock:
            self.stdout.write(f"  Low Stock Items ({len(low_stock)}):")
            for product in low_stock:
                self.stdout.write(f"    - {product.name}: {product.countInStock} units")
        
        self.stdout.write("\n" + self.style.SUCCESS("✓ Categorization Complete!"))
