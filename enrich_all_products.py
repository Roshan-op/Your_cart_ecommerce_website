#!/usr/bin/env python3
"""
Complete Product Enrichment Script
Processes all 196 products from data.csv and generates enriched JSON
Author: E-commerce Data Architect
Date: 2026-04-16
"""

import csv
import json
from pathlib import Path
from collections import defaultdict

# Define enrichment patterns by category
CATEGORY_PATTERNS = {
    "Footwear": {
        "attrs": {
            "sizes": [6, 7, 8, 9, 10, 11, 12, 13],
            "colors": ["Black", "White", "Brown", "Grey", "Navy", "Red"],
        },
        "descriptions": {
            "Nike": "Premium athletic running shoes designed with breathable mesh and responsive cushioning",
            "Adidas": "High-performance sports footwear with advanced comfort technology",
            "Caliber": "Premium leather shoes offering sophistication and durability",
            "Converse": "Iconic casual canvas sneakers perfect for everyday style",
            "Vans": "Classic slip-on canvas shoes offering effortless style",
            "Timberland": "Rugged outdoor boots built for durability and all-weather performance",
        }
    },
    "Clothing": {
        "attrs": {
            "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
            "colors": ["Black", "White", "Grey", "Navy", "Red", "Blue"],
        },
        "descriptions": {
            "Huba": "Comfortable casual clothing perfect for urban lifestyle",
            "Rhino Leathers": "Premium leather and quality clothing for professionals",
            "Generic": "Stylish casual wear for everyday occasions",
        }
    },
    "Watches": {
        "attrs": {
            "sizes": [],
            "colors": ["Black", "Silver", "Gold", "Brown"],
        },
        "descriptions": {
            "Fossil": "Classic timepiece combining style with reliable function",
            "Casio": "Digital watch with reliable timekeeping",
            "Apple": "Smart watch with health and fitness features",
        }
    },
    "Electronics": {
        "attrs": {
            "sizes": [],
            "colors": ["Black", "Silver", "White", "Space Grey"],
        },
        "descriptions": {
            "Apple": "Premium technology product with advanced features",
            "Logitech": "Precision technology designed for performance",
            "Nikon": "Professional photography equipment",
            "Meizu": "Advanced audio technology",
            "Sony": "Premium entertainment technology",
        }
    },
    "Accessories": {
        "attrs": {
            "sizes": ["One Size"],
            "colors": ["Black", "Brown", "Grey", "Navy", "Tan"],
        },
        "descriptions": {
            "Generic": "Stylish accessory for everyday use",
        }
    }
}

class ProductEnricher:
    def __init__(self, csv_path):
        self.csv_path = csv_path
        self.products = []
        self.categories = defaultdict(list)
        
    def load_csv(self):
        """Load products from CSV file"""
        with open(self.csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for idx, row in enumerate(reader, 1):
                self.products.append({
                    'id': idx,
                    'original': row,
                })
    
    def categorize_products(self):
        """Categorize products by type"""
        for product in self.products:
            category = self.get_category(product['original'])
            self.categories[category].append(product)
    
    def get_category(self, product_data):
        """Determine product category"""
        name = product_data.get('names', '').lower()
        category = product_data.get('category', '').lower()
        
        footwear_keywords = ['shoe', 'boot', 'heels', 'sneaker', 'running', 'athletic']
        clothing_keywords = ['shirt', 'jacket', 'hoodie', 't-shirt', 'pants', 'coat']
        watch_keywords = ['watch', 'clock', 'alarm', 'timepiece']
        electronic_keywords = ['phone', 'iphone', 'macbook', 'camera', 'headphone', 'mouse', 'playstation']
        accessory_keywords = ['bag', 'sunglasses', 'cap', 'hat', 'belt', 'jewelry', 'bracelet', 'earring']
        
        combined_text = f"{name} {category}"
        
        if any(kw in combined_text for kw in footwear_keywords):
            return 'Footwear'
        elif any(kw in combined_text for kw in clothing_keywords):
            return 'Clothing'
        elif any(kw in combined_text for kw in watch_keywords):
            return 'Watches'
        elif any(kw in combined_text for kw in electronic_keywords):
            return 'Electronics'
        elif any(kw in combined_text for kw in accessory_keywords):
            return 'Accessories'
        else:
            return category.capitalize() if category else 'Other'
    
    def generate_name(self, original_data, product_id):
        """Generate professional product name"""
        name = original_data.get('names', f'Product {product_id}').strip()
        brand = original_data.get('brand', 'Generic').strip()
        
        # Capitalize brand properly
        brand = brand.title() if brand.lower() != 'demin' else 'Denim'
        
        # If name is too generic, enhance it
        if len(name) < 10 or name.count("'s") > 1:
            category = original_data.get('category', '').title()
            return f"{brand} {name} - {category} for Professional Use"
        
        # Clean and enhance
        if brand.lower() not in name.lower():
            return f"{brand} {name}"
        return name
    
    def generate_description(self, original_data, category, product_id):
        """Generate enriched descriptions"""
        name = original_data.get('names', '')
        brand = original_data.get('brand', 'Generic')
        orig_desc = original_data.get('description', '')
        
        # Short description (1-2 lines)
        if category == 'Footwear':
            short = f"Premium footwear from {brand} combining style and comfort for everyday wear."
        elif category == 'Clothing':
            short = f"Comfortable {brand} garment perfect for casual and professional settings."
        elif category == 'Watches':
            short = f"Reliable {brand} timepiece with classic design and accurate timekeeping."
        elif category == 'Electronics':
            short = f"Advanced {brand} technology product featuring modern features and performance."
        else:
            short = f"Quality {brand} {category.lower()} item with excellent functionality."
        
        # Detailed description
        if orig_desc and orig_desc.lower() != 'null':
            detailed = f"{orig_desc} This {category.lower()} product offers premium quality and reliable performance for everyday use."
        else:
            detailed = f"Premium quality {category.lower()} designed for professionals and enthusiasts. Features include durable construction, comfort-focused design, and versatile styling options suitable for multiple occasions."
        
        # Highlights
        highlights = [
            "Premium quality construction",
            "Durable materials",
            "Comfortable fit",
            "Professional design",
            "Versatile styling",
            "Long-lasting durability"
        ]
        
        return {
            "short": short,
            "detailed": detailed,
            "highlights": highlights
        }
    
    def generate_images(self, product_id, original_data, category):
        """Generate image URLs based on category"""
        name_slug = original_data.get('names', f'product_{product_id}').lower().replace(" ", "_")
        image_file = original_data.get('image', f'{name_slug}.jpg')
        
        return [
            f"/images/{name_slug}_01.jpg",
            f"/images/{name_slug}_lifestyle.jpg",
            f"/images/{name_slug}_detail.jpg"
        ]
    
    def generate_variants(self, category):
        """Generate variants based on category"""
        if category == 'Footwear':
            return {
                "sizes": [6, 7, 8, 9, 10, 11, 12, 13],
                "colors": ["Black", "White", "Brown", "Grey", "Navy"],
                "other": {}
            }
        elif category == 'Clothing':
            return {
                "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
                "colors": ["Black", "White", "Grey", "Navy", "Red"],
                "other": {}
            }
        elif category == 'Watches':
            return {
                "sizes": [],
                "colors": ["Black", "Silver", "Gold", "Brown"],
                "other": {}
            }
        elif category == 'Electronics':
            return {
                "sizes": [],
                "colors": ["Black", "Silver", "White"],
                "other": {}
            }
        else:
            return {
                "sizes": [],
                "colors": ["Black", "White", "Grey"],
                "other": {}
            }
    
    def generate_tags(self, original_data, category, product_id):
        """Generate SEO tags"""
        name = original_data.get('names', '').lower()
        brand = original_data.get('brand', 'generic').lower()
        
        tags = [
            category.lower(),
            brand,
            'quality',
            'professional',
            'comfortable',
            'durable',
            'everyday',
            'versatile'
        ]
        
        # Add category-specific tags
        if 'nike' in brand or 'adidas' in brand:
            tags.extend(['sports', 'athletic', 'performance'])
        if 'leather' in name:
            tags.append('leather')
        if 'premium' in name.lower() or 'pro' in name.lower():
            tags.append('premium')
        
        return list(dict.fromkeys(tags))[:10]  # Unique, max 10
    
    def enrich_product(self, product, product_id):
        """Enrich a single product"""
        original = product['original']
        category = self.get_category(original)
        
        return {
            "id": product_id,
            "original_name": original.get('names', ''),
            "name": self.generate_name(original, product_id),
            "brand": original.get('brand', 'Generic').title(),
            "category": category,
            "description": self.generate_description(original, category, product_id),
            "images": self.generate_images(product_id, original, category),
            "variants": self.generate_variants(category),
            "tags": self.generate_tags(original, category, product_id),
            "price": original.get('price', '10.00'),
            "stock": int(original.get('countInStock', 10)) if original.get('countInStock') else 10,
            "rating": int(original.get('rating', 0)) if original.get('rating') and original.get('rating').lower() != 'null' else None,
            "numReviews": int(original.get('numReviews', 0)) if original.get('numReviews') and original.get('numReviews').lower() != 'null' else 0,
            "image_file": original.get('image', '')
        }
    
    def process_all(self):
        """Process all products"""
        self.load_csv()
        enriched_products = []
        
        print(f"Loaded {len(self.products)} products from CSV")
        
        for product in self.products:
            enriched = self.enrich_product(product, product['id'])
            enriched_products.append(enriched)
            
            if product['id'] % 50 == 0:
                print(f"Processed {product['id']} products...")
        
        print(f"Completed enrichment of all {len(enriched_products)} products")
        return enriched_products
    
    def save_json(self, products, output_path):
        """Save enriched products to JSON"""
        output_data = {
            "metadata": {
                "total_products": len(products),
                "enriched_date": "2026-04-16",
                "version": "1.0",
                "description": "Complete e-commerce product dataset - enriched for production"
            },
            "products": products,
            "summary": {
                "total_enriched": len(products),
                "categories": self._count_categories(products)
            }
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        print(f"Saved {len(products)} enriched products to {output_path}")
    
    def _count_categories(self, products):
        """Count products by category"""
        counts = defaultdict(int)
        for product in products:
            counts[product['category']] += 1
        return dict(counts)
    
    def save_batches(self, products, batch_size=50):
        """Save products in batches"""
        for i in range(0, len(products), batch_size):
            batch = products[i:i+batch_size]
            batch_num = (i // batch_size) + 1
            start_id = batch[0]['id']
            end_id = batch[-1]['id']
            
            output_path = Path(f"d:/your cart/enriched_products_batch_{batch_num}_{start_id}-{end_id}.json")
            
            batch_data = {
                "metadata": {
                    "batch_number": batch_num,
                    "products_count": len(batch),
                    "id_range": f"{start_id}-{end_id}"
                },
                "products": batch
            }
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(batch_data, f, indent=2, ensure_ascii=False)
            
            print(f"Saved batch {batch_num}: {len(batch)} products ({start_id}-{end_id})")

def main():
    """Main execution"""
    csv_path = Path("d:/your cart/Digital-Market-master/backend/data.csv")
    
    if not csv_path.exists():
        print(f"Error: CSV file not found at {csv_path}")
        return
    
    print("Starting complete product enrichment...")
    print(f"Reading from: {csv_path}\n")
    
    enricher = ProductEnricher(str(csv_path))
    enriched_products = enricher.process_all()
    
    # Save complete dataset
    enricher.save_json(enriched_products, "d:/your cart/enriched_products_complete.json")
    
    # Save in batches for easier management
    print("\nSaving products in batches...")
    enricher.save_batches(enriched_products, batch_size=50)
    
    print("\n✅ Product enrichment completed successfully!")
    print(f"Total products enriched: {len(enriched_products)}")
    print(f"Output files created in: d:/your cart/")

if __name__ == "__main__":
    main()
