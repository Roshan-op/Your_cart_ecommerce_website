import requests
import json
ids = [1,8,18,97]
for pid in ids:
    url = f'http://127.0.0.1:8000/api/products/{pid}/recommend/'
    r = requests.get(url)
    try:
        data = r.json()
    except Exception as e:
        print(pid, 'error parsing json', e, r.text)
        continue
    print(pid, 'status', r.status_code, 'count', len(data))
    if len(data) > 0:
        print('sample id:', data[0].get('_id'))
