import sys, os, django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'
django.setup()

from django.conf import settings
from base.models import Product

print('MEDIA_ROOT:', settings.MEDIA_ROOT)
print('MEDIA_URL: ', settings.MEDIA_URL)
print()

ok = 0
missing = 0
for p in Product.objects.all():
    img_field = str(p.image).lstrip('/')      # e.g. images/shoes/nike/nike.jpg
    img_rel   = img_field.replace('images/', '', 1)  # shoes/nike/nike.jpg
    full_path = os.path.join(settings.MEDIA_ROOT, img_rel)
    exists    = os.path.isfile(full_path)
    status    = 'OK' if exists else 'MISSING'
    if exists:
        ok += 1
    else:
        missing += 1
    print(f'[{status}]  {p.name}')
    if not exists:
        print(f'       DB  : {p.image}')
        print(f'       Disk: {full_path}')

print(f'\n{ok} OK  /  {missing} MISSING')