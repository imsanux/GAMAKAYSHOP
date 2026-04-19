import json
from collections import Counter

path = r'c:\Users\alienware\Desktop\GAMAKAYSHOP\GAMAKAYSHOP\src\data\products.json'

with open(path, 'r', encoding='utf-8') as f:
    products = json.load(f)

ids = [p['id'] for p in products]
dupes = [id for id, count in Counter(ids).items() if count > 1]
print('Duplicate IDs found:', dupes)
for p in products:
    if p['id'] in dupes:
        print(f"  ID={p['id']} -> {p['name']}")

# Fix: reassign duplicate IDs — find the max current ID and increment from there
max_id = max(int(p['id']) for p in products)
seen = set()
for p in products:
    if p['id'] in seen:
        max_id += 1
        print(f"Reassigning duplicate ID {p['id']} ({p['name']}) -> {max_id}")
        p['id'] = str(max_id)
    else:
        seen.add(p['id'])

with open(path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=4, ensure_ascii=False)

print('Done. All IDs are now unique.')
