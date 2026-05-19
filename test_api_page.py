import requests

# Get page 13 (the last page)
resp = requests.get('http://localhost:8000/api/products/?page=13')
data = resp.json()
products = data.get('products', [])
print(f'Page 13 ({len(products)} products):')
for p in products:
    print(f'ID: {p["_id"]}, Name: {p["name"]}, Price: {p["price"]}')

print('\n--- Testing search for "Roshan" ---')
resp = requests.get('http://localhost:8000/api/products/?keyword=roshan')
data = resp.json()
products = data.get('products', [])
print(f'Search results ({len(products)} products):')
for p in products:
    print(f'ID: {p["_id"]}, Name: {p["name"]}, Price: {p["price"]}, Image: {p["image"]}')
