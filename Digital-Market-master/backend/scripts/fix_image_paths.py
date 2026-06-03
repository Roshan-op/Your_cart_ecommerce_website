"""
Fix DB image paths so they are stored relative to MEDIA_ROOT only.
Before: /images/clock/grey_alarm_clock/grey_alram_clock.jpg
After:  clock/grey_alarm_clock/grey_alram_clock.jpg

Django's FileField.url() prepends MEDIA_URL (/images/) automatically,
so the path stored in the DB must NOT include /images/.
"""
import sys, os, re, django

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from base.models import Product

updated = 0
already_ok = 0

for p in Product.objects.exclude(image='').exclude(image__isnull=True):
    raw = str(p.image)

    # Strip any leading /images/ or images/ prefix
    clean = re.sub(r'^/?images/', '', raw)

    if clean == raw:
        already_ok += 1
        continue

    p.image = clean
    p.save(update_fields=['image'])
    updated += 1
    print(f'  Fixed [{p._id}] {p.name}')
    print(f'    was : {raw}')
    print(f'    now : {clean}')

print(f'\nUpdated: {updated}   Already correct: {already_ok}')
