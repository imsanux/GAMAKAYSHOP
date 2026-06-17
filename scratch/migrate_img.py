import re

with open('src/components/PromoBanner.tsx', 'r', encoding='utf8') as f:
    content = f.read()

# Add import if missing
if 'import Image from' not in content:
    content = "import Image from 'next/image';\n" + content

# Replace <img ... />
pattern = r'<img src=\{([a-z]+)\.src\} alt=\{([a-z]+)\.alt\} loading="lazy" decoding="async" style=\{[^}]+\}/>'
replacement = r'<Image src={\1.src} alt={\1.alt} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover", transition: "transform 0.4s ease" }} />'

content = re.sub(pattern, replacement, content)

with open('src/components/PromoBanner.tsx', 'w', encoding='utf8') as f:
    f.write(content)
