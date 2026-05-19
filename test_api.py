import requests
import json

resp = requests.get('http://localhost:8000/api/products/')
data = resp.json()
print(f'Status: {resp.status_code}')
print(f'Total pages: {data.get("pages")}')
products = data.get('products', [])
print(f'Products returned: {len(products)}')
print('\nFirst 3 products:')
for p in products[:3]:
    print(f'ID: {p["_id"]}, Name: {p["name"]}, Price: {p["price"]}, Image: {p["image"]}')
