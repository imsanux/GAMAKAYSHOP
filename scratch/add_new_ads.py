import json
import os

json_path = r'c:\Users\alienware\Desktop\GAMAKAYSHOP\GAMAKAYSHOP\src\data\products.json'

new_items = [
    {
        "id": "109",
        "name": "8 Ball Pool Pass",
        "brand": "Miniclip",
        "category": "gaming",
        "region": "Global",
        "denominations": [{ "value": "Standard", "price": 975 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/8 Ball Pool Pass.webp",
        "logo_url": "",
        "description": "🎱 Level up your game with the 8 Ball Pool Pass! Unlock exclusive rewards, cues, and more."
    },
    {
        "id": "110",
        "name": "Adobe Firefly",
        "brand": "Adobe",
        "category": "software",
        "region": "Global",
        "denominations": [{ "value": "1 Week", "price": 500 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Adobe Firefly.webp",
        "logo_url": "",
        "description": "🎨 Unleash your creativity with Adobe Firefly's generative AI tools for amazing designs."
    },
    {
        "id": "111",
        "name": "Canva Pro",
        "brand": "Canva",
        "category": "software",
        "region": "Global",
        "denominations": [{ "value": "1 Month", "price": 500 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Canva Pro.webp",
        "logo_url": "",
        "description": "✨ Design like a professional with Canva Pro. Access premium templates, images, and tools."
    },
    {
        "id": "112",
        "name": "Capcut Pro",
        "brand": "CapCut",
        "category": "software",
        "region": "Global",
        "denominations": [{ "value": "1 Month", "price": 275 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Capcut Pro.webp",
        "logo_url": "",
        "description": "🎬 Professional video editing made easy. Unlock all premium effects and features on Capcut Pro."
    },
    {
        "id": "113",
        "name": "Character AI",
        "brand": "Character.ai",
        "category": "software",
        "region": "Global",
        "denominations": [{ "value": "1 Month", "price": 1875 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Character AI.webp",
        "logo_url": "",
        "description": "🧠 Chat without limits! Experience priority access and faster response times with Character AI+."
    },
    {
        "id": "114",
        "name": "ChatGPT Plus (Monthly)",
        "brand": "OpenAI",
        "category": "software",
        "region": "Global",
        "denominations": [{ "value": "1 Month", "price": 3750 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/ChatGPT Plus.webp",
        "logo_url": "",
        "description": "🚀 Get ahead with GPT-4. Faster response speeds and priority access to new features."
    },
    {
        "id": "115",
        "name": "Clash of Clans - Gold Pass",
        "brand": "Supercell",
        "category": "gaming",
        "region": "Global",
        "denominations": [{ "value": "Gold Pass", "price": 975 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Clash of Clans.webp",
        "logo_url": "",
        "description": "🏰 Fast-track your village progress with the Clash of Clans Gold Pass rewards and perks."
    },
    {
        "id": "116",
        "name": "Clash Royale - Pass Royale",
        "brand": "Supercell",
        "category": "gaming",
        "region": "Global",
        "denominations": [{ "value": "Pass Royale", "price": 1475 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Clash Royale Pass Royale.webp",
        "logo_url": "",
        "description": "👑 Dominate the arena with Pass Royale! Get exclusive rewards, tower skins, and emotes."
    },
    {
        "id": "117",
        "name": "DistroKID",
        "brand": "DistroKid",
        "category": "subscriptions",
        "region": "Global",
        "denominations": [{ "value": "1 Year", "price": 4450 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/DistroKID.webp",
        "logo_url": "",
        "description": "🎵 The easiest way for musicians to get music into Apple Music, Spotify, and more."
    },
    {
        "id": "118",
        "name": "Symphonic MS",
        "brand": "Symphonic",
        "category": "subscriptions",
        "region": "Global",
        "denominations": [{ "value": "1 Year", "price": 3750 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Symphonic MS.webp",
        "logo_url": "",
        "description": "🎶 Professional music distribution and marketing tools for independent artists."
    },
    {
        "id": "119",
        "name": "eFootball Coins",
        "brand": "Konami",
        "category": "gaming",
        "region": "Global",
        "denominations": [
            { "value": "130 Coins", "price": 260 },
            { "value": "840 Coins", "price": 1600 },
            { "value": "2130 Coins", "price": 3200 }
        ],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/eFootball.webp",
        "logo_url": "",
        "description": "⚽ Build your dream team in eFootball with coins for players and special items."
    },
    {
        "id": "120",
        "name": "Flingster Premium (18+)",
        "brand": "Flingster",
        "category": "subscriptions",
        "region": "Global",
        "denominations": [
            { "value": "1 Week", "price": 1850 },
            { "value": "1 Month", "price": 4150 }
        ],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Flingster Premium.webp",
        "logo_url": "",
        "description": "🔞 Experience premium random video chat. Unlimited filters and enhanced privacy."
    },
    {
        "id": "121",
        "name": "Goodnotes",
        "brand": "Goodnotes",
        "category": "subscriptions",
        "region": "Global",
        "denominations": [{ "value": "Essential", "price": 1950 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Goodnotes.webp",
        "logo_url": "",
        "description": "📝 Take beautiful digital notes. The best note-taking app for students and professionals."
    },
    {
        "id": "122",
        "name": "Grindr Dating (18+)",
        "brand": "Grindr",
        "category": "subscriptions",
        "region": "Global",
        "denominations": [{ "value": "1 Month", "price": 1850 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Grindr Dating.webp",
        "logo_url": "",
        "description": "🔞 Unlock premium features on the world's largest social network for LGBTQ people."
    },
    {
        "id": "123",
        "name": "HER Dating (18+)",
        "brand": "HER",
        "category": "subscriptions",
        "region": "Global",
        "denominations": [
            { "value": "1 Week Gold", "price": 850 },
            { "value": "1 Month Gold", "price": 1950 }
        ],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/HER Dating.webp",
        "logo_url": "",
        "description": "🔞 Premium dating for lesbian, bi, and queer people. See who likes you and more."
    },
    {
        "id": "124",
        "name": "Microsoft Copilot Premium",
        "brand": "Microsoft",
        "category": "software",
        "region": "Global",
        "denominations": [{ "value": "1 Month", "price": 3750 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Mircosoft Copilot Premium.webp",
        "logo_url": "",
        "description": "🤖 Boost your productivity with Microsoft's most powerful AI companion."
    },
    {
        "id": "125",
        "name": "MyFitnessPal Premium",
        "brand": "MyFitnessPal",
        "category": "subscriptions",
        "region": "Global",
        "denominations": [{ "value": "1 Month", "price": 1350 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/myfitnesspal.webp",
        "logo_url": "",
        "description": "🥗 Reach your fitness goals with personalized meal plans and macro tracking."
    },
    {
        "id": "126",
        "name": "OnlyFans Creator Sub",
        "brand": "OnlyFans",
        "category": "subscriptions",
        "region": "Global",
        "denominations": [{ "value": "1 Month", "price": 1250 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/OnlyFans.webp",
        "logo_url": "",
        "description": "⭐️ Support your favorite creators and unlock exclusive content directly."
    },
    {
        "id": "127",
        "name": "Roblox Robux",
        "brand": "Roblox",
        "category": "gaming",
        "region": "Global",
        "denominations": [
            { "value": "800 Robux", "price": 1850 },
            { "value": "2000 Robux", "price": 4515 }
        ],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Roblox Giftcards.webp",
        "logo_url": "",
        "description": "🎮 Buy Robux to upgrade your avatar and unlock special in-game perks."
    },
    {
        "id": "128",
        "name": "Simply Piano",
        "brand": "Simply",
        "category": "subscriptions",
        "region": "Global",
        "denominations": [
            { "value": "1 Month Individual", "price": 1325 },
            { "value": "1 Year Individual", "price": 3950 }
        ],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Simply Piano.webp",
        "logo_url": "",
        "description": "🎹 Learn piano fast and easily with interactive lessons and real-time feedback."
    },
    {
        "id": "129",
        "name": "Sketchbook Pro",
        "brand": "Autodesk",
        "category": "software",
        "region": "Global",
        "denominations": [{ "value": "Premium Bundle", "price": 750 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Sketchbook.webp",
        "logo_url": "",
        "description": "🎨 Professional digital drawing and painting tools for artists of all levels."
    },
    {
        "id": "130",
        "name": "Sololearn Premium",
        "brand": "Sololearn",
        "category": "subscriptions",
        "region": "Global",
        "denominations": [
            { "value": "1 Month", "price": 500 },
            { "value": "1 Year", "price": 3450 }
        ],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Sololearn.webp",
        "logo_url": "",
        "description": "💻 Master coding with bitesize lessons in Python, Java, C++, and more."
    },
    {
        "id": "131",
        "name": "Uno Ad Free",
        "brand": "Mattel",
        "category": "subscriptions",
        "region": "Global",
        "denominations": [{ "value": "Ad Free", "price": 475 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Uno Ad Free.webp",
        "logo_url": "",
        "description": "🃏 Play the classic card game without interruptions. Enjoy Uno Ad-Free!"
    },
    {
        "id": "132",
        "name": "Valorant Points (VP)",
        "brand": "Riot Games",
        "category": "gaming",
        "region": "Global",
        "denominations": [
            { "value": "475 VP", "price": 825 },
            { "value": "975 VP", "price": 1550 }
        ],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/Valorant Points.webp",
        "logo_url": "",
        "description": "🔫 Unlock weapon skins and battle passes in Valorant with VP."
    },
    {
        "id": "133",
        "name": "VN Video Editor Pro",
        "brand": "VN",
        "category": "software",
        "region": "Global",
        "denominations": [{ "value": "1 Month", "price": 475 }],
        "delivery_type": "Instant",
        "image_url": "/IMAGES/PRODUCTS/VN Video Editor.webp",
        "logo_url": "",
        "description": "🎥 Create stunning videos on your phone. Unlock all premium assets on VN Editor."
    }
]

with open(json_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

products.extend(new_items)

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=4, ensure_ascii=False)

print(f"Successfully added {len(new_items)} items to {json_path}")
