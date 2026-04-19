import json
import re
import os

src_path = r'c:\Users\alienware\Desktop\GAMAKAYSHOP\GAMAKAYSHOP\src\lib\products.ts'
output_dir = r'c:\Users\alienware\Desktop\GAMAKAYSHOP\GAMAKAYSHOP\src\data'
output_path = os.path.join(output_dir, 'products.json')

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

with open(src_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

products_lines = []
in_array = False
for line in lines:
    if 'export const sampleProducts: Product[] = [' in line:
        in_array = True
        products_lines.append('[')
        continue
    if in_array:
        # Check if the line is exactly ]; (with potential whitespace)
        if line.strip() == '];':
            products_lines.append(']')
            in_array = False
            break
        
        # Clean line: remove trailing comments
        clean_line = line.split('//')[0].strip()
        if not clean_line: continue
        
        # Replace single quotes with double quotes
        clean_line = clean_line.replace("'", '"')
        
        # Add quotes to known keys if they aren't quoted
        keys = ['id', 'name', 'brand', 'category', 'region', 'denominations', 'value', 'price', 'delivery_type', 'image_url', 'logo_url', 'description']
        for key in keys:
            # Use regex to match the key precisely to avoid partial matches
            clean_line = re.sub(fr'\b{key}\b\s*:', f'"{key}":', clean_line)
        
        products_lines.append(clean_line)

json_str = " ".join(products_lines)
# Remove trailing commas inside arrays and objects
json_str = re.sub(r',\s*\]', ']', json_str)
json_str = re.sub(r',\s*\}', '}', json_str)

# One more fix: if there's a comma before the final ], remove it
json_str = json_str.strip()
if json_str.endswith(', ]'):
    json_str = json_str[:-3] + ']'
elif json_str.endswith(',]'):
    json_str = json_str[:-2] + ']'

try:
    data = json.loads(json_str)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print("Success")
except Exception as e:
    print(f"Error: {e}")
    # Show more context on error
    start = max(0, 32541 - 100)
    end = 32541 + 100
    print(f"Snippet near error: {json_str[start:end]}")
