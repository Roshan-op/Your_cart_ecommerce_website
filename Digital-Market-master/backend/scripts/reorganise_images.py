"""
Reorganise product images from a flat static/images/ directory into:
    static/images/{category}/{product_slug}/{original_filename}

Updates the DB image field on each product to match the new path.
Leaves files that aren't referenced by any product untouched.
"""

import os, sys, shutil, re, django

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from base.models import Product

# ── paths ────────────────────────────────────────────────────────────────────
BASE_DIR    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA_ROOT  = os.path.join(BASE_DIR, 'static', 'images')   # matches MEDIA_ROOT in settings


def slugify(text):
    """Convert a product name to a safe folder name."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '_', text)
    return text[:50]


def image_abs(image_field):
    """Resolve a product.image value to an absolute file path."""
    if not image_field:
        return None
    path = str(image_field)
    # strip leading /images/  or  images/
    path = re.sub(r'^/?images/', '', path)
    return os.path.join(MEDIA_ROOT, path)


moved   = []
skipped = []
missing = []

products = Product.objects.exclude(image__isnull=True).exclude(image='')

for product in products:
    category = (product.category or 'uncategorised').lower().strip()
    name_slug = slugify(product.name or f'product_{product._id}')

    src_abs = image_abs(product.image)
    if not src_abs or not os.path.isfile(src_abs):
        missing.append((product._id, product.name, str(product.image)))
        continue

    filename   = os.path.basename(src_abs)
    target_dir = os.path.join(MEDIA_ROOT, category, name_slug)
    target_abs = os.path.join(target_dir, filename)

    # Already in the right place
    if os.path.normcase(os.path.abspath(src_abs)) == os.path.normcase(os.path.abspath(target_abs)):
        skipped.append(product.name)
        continue

    os.makedirs(target_dir, exist_ok=True)

    # If a file already exists at the destination, don't overwrite
    if os.path.isfile(target_abs):
        target_abs = os.path.join(target_dir, f'{product._id}_{filename}')

    shutil.move(src_abs, target_abs)

    # New DB value:  /images/{category}/{slug}/{filename}
    rel = os.path.relpath(target_abs, MEDIA_ROOT).replace('\\', '/')
    new_image = f'/images/{rel}'

    product.image = new_image
    product.save(update_fields=['image'])

    moved.append(f'  [{product._id}] {product.name}')
    moved.append(f'       {str(product.image)!r:>10}  →  {new_image!r}')

# ── report ────────────────────────────────────────────────────────────────────
print(f'\nMoved & updated: {len(moved) // 2} products')
for line in moved:
    print(line)

if missing:
    print(f'\nImage file not found for {len(missing)} products (DB path unchanged):')
    for pid, name, path in missing:
        print(f'  [{pid}] {name}  →  {path!r}')

if skipped:
    print(f'\nAlready in correct location: {len(skipped)} products')
    for n in skipped:
        print(f'  {n}')

print('\nDone.')