import os, sys, django
sys.path.insert(0, r'c:\Users\Raghav\Desktop\Your Cart FYP\Digital-Market-master\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from base.models import Product

SIZES = {
    'shoes':   'UK 6,UK 7,UK 8,UK 9,UK 10,UK 11,UK 12',
    'jacket':  'XS,S,M,L,XL,XXL',
    'hoodie':  'XS,S,M,L,XL,XXL',
    't-shirt': 'XS,S,M,L,XL,XXL',
    'bracelet':'S,M,L',
    'watches': '',
    'clock':   '',
    'bag':     '',
}

updated = 0
for cat, sizes in SIZES.items():
    qs = Product.objects.filter(category__iexact=cat)
    for p in qs:
        p.available_sizes = sizes
        p.save(update_fields=['available_sizes'])
        updated += 1
        print(f'  {p.name} ({cat}): {sizes if sizes else "(no sizes)"}')

print(f'\nDone — updated {updated} products')
