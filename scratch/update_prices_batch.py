import json
import re

json_path = r'c:\Users\alienware\Desktop\GAMAKAYSHOP\GAMAKAYSHOP\src\data\products.json'

updates = [
    { "search": "Tinder Gold", "denominations": [{ "value": "1 Week", "price": 500 }, { "value": "1 Month", "price": 1250 }] },
    { "search": "Grok by xAI", "denominations": [{ "value": "1 Month", "price": 1650 }] },
    { "search": "Spotify Premium", "denominations": [{ "value": "3 Months", "price": 850 }] },
    { "search": "SurfShark VPN", "denominations": [{ "value": "1 Week", "price": 375 }, { "value": "1 Month", "price": 1650 }] },
    { "search": "CyberGhost VPN", "denominations": [{ "value": "1 Month", "price": 1650 }] },
    { "search": "ExpressVPN", "name": "ExpressVPN", "denominations": [{ "value": "1 Month", "price": 1650 }, { "value": "Desktop (1 Device/Month)", "price": 1650 }] },
    { "search": "NordVPN", "denominations": [{ "value": "1 Month", "price": 1250 }] },
    { "search": "Xbox Gamepass Ultimate", "denominations": [{ "value": "1 Month", "price": 2750 }] },
    { "search": "PlayStation Giftcards INR", "filter": lambda p: "₹2000" in [d['value'] for d in p['denominations']], "update_denoms": lambda d: 3900 if d['value'] == "₹2000" else d['price'] },
    { "search": "F1 TV Pro", "denominations": [{ "value": "1 Month", "price": 500 }] },
    { "search": "Discord Nitro", "denominations": [{ "value": "1 Month Basic", "price": 580 }, { "value": "1 Month Full", "price": 1875 }] },
    { "search": "Cursor AI", "denominations": [{ "value": "1 Month", "price": 3750 }] },
    { "search": "Replit AI Core", "denominations": [{ "value": "1 Month", "price": 3750 }] },
    { "search": "Crunchyroll Premium", "append_denominations": [{ "value": "1 Year Mega Fan", "price": 1500 }] },
    { "search": "Procreate", "denominations": [{ "value": "1 Month", "price": 1950 }] },
    { "search": "GoPro Premium", "denominations": [{ "value": "1 Month", "price": 1350 }] },
    { "search": "Airalo eSIM", "denominations": [{ "value": "1GB 7Days Global", "price": 1500 }, { "value": "5GB 60Days Global", "price": 6450 }] },
    { "search": "Saily eSIM", "denominations": [{ "value": "1GB 7Days Global", "price": 1500 }, { "value": "5GB 60Days Global", "price": 6450 }] },
    { "search": "APEUni PTE VIP", "denominations": [{ "value": "1 Month", "price": 2500 }, { "value": "3 Month", "price": 5500 }] },
    { "search": "ExitLag Gaming VPN", "denominations": [{ "value": "1 Month Renewable", "price": 1250 }] }
]

with open(json_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

for update in updates:
    found = False
    for product in products:
        if update['search'].lower() in product['name'].lower():
            if 'filter' in update and not update['filter'](product):
                continue
            
            if 'denominations' in update:
                product['denominations'] = update['denominations']
            elif 'update_denoms' in update:
                for d in product['denominations']:
                    d['price'] = update['update_denoms'](d)
            elif 'append_denominations' in update:
                # Add if not exist, else update
                for nd in update['append_denominations']:
                    matched = False
                    for existing_d in product['denominations']:
                        if existing_d['value'] == nd['value']:
                            existing_d['price'] = nd['price']
                            matched = True
                    if not matched:
                        product['denominations'].append(nd)
            
            if 'name' in update:
                product['name'] = update['name']
            
            found = True
            print(f"Updated {product['name']}")

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=4, ensure_ascii=False)

print("Batch update complete.")
