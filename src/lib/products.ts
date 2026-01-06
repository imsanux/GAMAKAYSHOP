import { Product } from './supabase';

// Currency: Nepali Rupees (Rs.)
// Prices synced from Hamrobazar - January 2026

export const sampleProducts: Product[] = [
    // ============ GAMING ============
    {
        id: '1',
        name: 'PlayStation Giftcards USD',
        brand: 'PlayStation',
        category: 'gaming',
        region: 'US',
        denominations: [
            { value: '$10', price: 1850 },
            { value: '$25', price: 4500 },
            { value: '$50', price: 9000 },
            { value: '$100', price: 17000 }
        ],
        delivery_type: 'Manual',
        image_url: '/IMAGES/PRODUCTS/PLAYSTATION_GIFTCARDS_USD.png',
        logo_url: '',
        description: '🎮 Level Up Your Gaming! US PlayStation Store codes delivered via WhatsApp. Works on PS4/PS5.'
    },
    {
        id: '2',
        name: 'PlayStation Giftcards INR',
        brand: 'PlayStation',
        category: 'gaming',
        region: 'India',
        denominations: [
            { value: '₹500', price: 950 },
            { value: '₹1000', price: 1900 },
            { value: '₹2000', price: 3800 },
            { value: '₹5000', price: 9500 }
        ],
        delivery_type: 'Manual',
        image_url: '/IMAGES/PRODUCTS/PLAYSTATION_GIFTCARDS_INR.png',
        logo_url: '',
        description: '🎮 Level Up Your Gaming! India PlayStation Store codes. Works on PS4/PS5.'
    },
    {
        id: '3',
        name: 'Xbox Giftcards',
        brand: 'Xbox',
        category: 'gaming',
        region: 'US',
        denominations: [
            { value: '$15', price: 2700 },
            { value: '$25', price: 4500 },
            { value: '$50', price: 9000 },
            { value: '$100', price: 17000 }
        ],
        delivery_type: 'Manual',
        image_url: '/IMAGES/PRODUCTS/XBOX_GIFTCARDS.png',
        logo_url: '',
        description: '🎮 Play More, Pay Less! Xbox Store credit for games, DLCs, and subscriptions.'
    },
    {
        id: '4',
        name: 'Xbox Gamepass Ultimate',
        brand: 'Xbox',
        category: 'gaming',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 500 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/XBOX_GAMEPASS.png',
        logo_url: '',
        description: '🎮 Play More, Pay Less! 100+ games on console, PC & cloud. Includes EA Play.'
    },
    {
        id: '5',
        name: 'Xbox Gamepass INR',
        brand: 'Xbox',
        category: 'gaming',
        region: 'India',
        denominations: [
            { value: '1 Month', price: 499 },
            { value: '3 Months', price: 1399 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/XBOX_GAMEPASS_INR.png',
        logo_url: '',
        description: '🎮 India region Gamepass. 100+ games, new releases included.'
    },
    {
        id: '6',
        name: 'Nintendo eShop Giftcards',
        brand: 'Nintendo',
        category: 'gaming',
        region: 'US',
        denominations: [
            { value: '$10', price: 1850 },
            { value: '$20', price: 3600 },
            { value: '$35', price: 6300 },
            { value: '$50', price: 9000 }
        ],
        delivery_type: 'Manual',
        image_url: '/IMAGES/PRODUCTS/Ninentdo_ESHOP_GIFTCARDS.png',
        logo_url: '',
        description: '🎮 Nintendo Switch games and DLC! US eShop credit codes.'
    },
    {
        id: '7',
        name: 'EA Play Pro',
        brand: 'EA Games',
        category: 'gaming',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 3000 },
            { value: '1 Year', price: 18000 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/EA_PLAY_PRO.png',
        logo_url: '',
        description: '🎮 Play EA games first! FIFA, Battlefield, Need for Speed access.'
    },
    {
        id: '8',
        name: 'Twitch Prime Sub',
        brand: 'Twitch',
        category: 'gaming',
        region: 'Global',
        denominations: [
            { value: '1 Sub', price: 385 },
            { value: '5 Subs', price: 1850 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/TWITCH_PRIME.png',
        logo_url: '',
        description: '🎮 Support your favorite streamers with Twitch Prime subscription!'
    },
    {
        id: '50',
        name: 'Apple Gift Card USD',
        brand: 'Apple',
        category: 'gaming',
        region: 'US',
        denominations: [
            { value: '$10', price: 1850 },
            { value: '$25', price: 4500 },
            { value: '$50', price: 9000 },
            { value: '$100', price: 17000 }
        ],
        delivery_type: 'Manual',
        image_url: '/IMAGES/PRODUCTS/APPLE_GIFTCARD_USD_INR.png',
        logo_url: '',
        description: '🍎 For all things Apple! App Store, Apple Music, iCloud, games & more.'
    },
    {
        id: '51',
        name: 'Apple Gift Card INR',
        brand: 'Apple',
        category: 'gaming',
        region: 'India',
        denominations: [
            { value: '₹500', price: 950 },
            { value: '₹1000', price: 1900 },
            { value: '₹2000', price: 3800 },
            { value: '₹5000', price: 9500 }
        ],
        delivery_type: 'Manual',
        image_url: '/IMAGES/PRODUCTS/APPLE_GIFTCARD_INR.png',
        logo_url: '',
        description: '🍎 India Apple Store credit! Apps, games, music, movies & subscriptions.'
    },
    {
        id: '9',
        name: 'Meta Quest Giftcards',
        brand: 'Meta',
        category: 'gaming',
        region: 'Global',
        denominations: [
            { value: '$25', price: 4500 },
            { value: '$50', price: 9000 }
        ],
        delivery_type: 'Manual',
        image_url: '/IMAGES/PRODUCTS/META_GIFTCARDS.png',
        logo_url: '',
        description: '🎮 VR Gaming! Buy games for Meta Quest 2/3 headsets.'
    },

    // ============ STREAMING ============
    {
        id: '10',
        name: 'Netflix Monthly',
        brand: 'Netflix',
        category: 'streaming',
        region: 'Global',
        denominations: [
            { value: '1 Month 1080p', price: 250 },
            { value: '1 Month 4K', price: 450 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/NETFLIX.png',
        logo_url: '',
        description: '🍿 Stream in HD! Unlimited movies & TV shows. Private profile provided.'
    },
    {
        id: '11',
        name: 'Spotify Premium',
        brand: 'Spotify',
        category: 'streaming',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 175 },
            { value: '3 Months', price: 499 },
            { value: '6 Months', price: 899 },
            { value: '1 Year', price: 1699 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/SPOTIFY_PREMIUM.png',
        logo_url: '',
        description: '🎵 Music Without Limits! Ad-free, offline downloads, high quality audio.'
    },
    {
        id: '12',
        name: 'YouTube Premium',
        brand: 'YouTube',
        category: 'streaming',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 150 },
            { value: '3 Months', price: 399 },
            { value: '6 Months', price: 749 },
            { value: '1 Year', price: 1399 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/YOUTUBE_PREMIUM.png',
        logo_url: '',
        description: '📺 Ad-free YouTube! Background play, YouTube Music included.'
    },
    {
        id: '13',
        name: 'Apple Music',
        brand: 'Apple',
        category: 'streaming',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 250 },
            { value: '6 Months', price: 1199 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/APPLEMUSIC.png',
        logo_url: '',
        description: '🎵 100 million songs. Spatial Audio with Dolby Atmos.'
    },
    {
        id: '14',
        name: 'Apple TV+',
        brand: 'Apple',
        category: 'streaming',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 200 },
            { value: '3 Months', price: 550 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/APPLE_TV.png',
        logo_url: '',
        description: '📺 Award-winning Apple Originals. 4K HDR streaming.'
    },
    {
        id: '15',
        name: 'Apple One',
        brand: 'Apple',
        category: 'streaming',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 375 },
            { value: '3 Months', price: 1050 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/APPLE_ONE.png',
        logo_url: '',
        description: '🍎 All-in-one! Apple Music, TV+, Arcade, iCloud+ bundled.'
    },
    {
        id: '16',
        name: 'Crunchyroll Premium',
        brand: 'Crunchyroll',
        category: 'streaming',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 250 },
            { value: '3 Months', price: 699 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/CRUCHYROLL.png',
        logo_url: '',
        description: '⛩️ Ad-Free Anime! 1000+ anime titles, simulcasts, manga.'
    },
    {
        id: '17',
        name: 'Discord Nitro',
        brand: 'Discord',
        category: 'streaming',
        region: 'Global',
        denominations: [
            { value: '1 Month Basic', price: 399 },
            { value: '1 Month Full', price: 1350 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/DISCORD_NITRO.png',
        logo_url: '',
        description: '💬 Boost your server! Custom emojis, HD streaming, bigger uploads.'
    },
    {
        id: '18',
        name: 'F1 TV Pro',
        brand: 'F1',
        category: 'streaming',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 450 },
            { value: '1 Year', price: 4500 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/F1TV.png',
        logo_url: '',
        description: '🏎️ Live F1 races! Onboard cameras, full race replays, exclusive content.'
    },
    {
        id: '19',
        name: 'ESPN+ Monthly',
        brand: 'ESPN',
        category: 'streaming',
        region: 'US',
        denominations: [
            { value: '1 Month', price: 1950 },
            { value: '1 Year', price: 17999 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/F1TV.png',
        logo_url: '',
        description: '🏈 Live sports! UFC, NHL, MLB, soccer & more exclusive content.'
    },
    {
        id: '20',
        name: 'Viki Rakuten Premium',
        brand: 'Viki',
        category: 'streaming',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 350 },
            { value: '1 Year', price: 3500 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/VIKI_RAKUTEN.png',
        logo_url: '',
        description: '🎬 K-Drama & Asian content! Ad-free, HD streaming.'
    },

    // ============ AI TOOLS ============
    {
        id: '21',
        name: 'ChatGPT Plus',
        brand: 'OpenAI',
        category: 'software',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 450 },
            { value: '3 Months', price: 1299 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/GOOGLE_GEMINI_PRO.png',
        logo_url: '',
        description: '🧠 GPT-4 Access! Faster responses, priority access, plugins.'
    },
    {
        id: '22',
        name: 'Claude AI (Anthropic)',
        brand: 'Anthropic',
        category: 'software',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 3750 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/CLAUDE_BY_ANTHROPIC.png',
        logo_url: '',
        description: '🧠 Think Smarter! Claude Pro for advanced AI conversations & coding.'
    },
    {
        id: '23',
        name: 'Google Gemini Advanced',
        brand: 'Google',
        category: 'software',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 150 },
            { value: '3 Months', price: 399 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/GOOGLE_GEMINI_PRO.png',
        logo_url: '',
        description: '🧠 Google\'s most capable AI! 2TB storage, Gemini in Docs & Gmail.'
    },
    {
        id: '24',
        name: 'Cursor AI',
        brand: 'Cursor',
        category: 'software',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 350 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/CURSOR_AI.png',
        logo_url: '',
        description: '💻 AI Code Editor! Write, edit & debug code with AI assistance.'
    },
    {
        id: '25',
        name: 'ElevenLabs AI Voice',
        brand: 'ElevenLabs',
        category: 'software',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 4000 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/ELEVEN_LABS.png',
        logo_url: '',
        description: '🎙️ Realistic AI Voices! Text-to-speech, voice cloning, dubbing.'
    },
    {
        id: '26',
        name: 'Suno AI Pro',
        brand: 'Suno',
        category: 'software',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 1950 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/SUNO_AI.png',
        logo_url: '',
        description: '🎵 Create AI Music! Generate songs in any style with lyrics.'
    },
    {
        id: '27',
        name: 'Grok by xAI',
        brand: 'xAI',
        category: 'software',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 1500 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/GROK_BY_xAI.png',
        logo_url: '',
        description: '🧠 Elon Musk\'s AI! Real-time info, witty responses, X integration.'
    },
    {
        id: '28',
        name: 'Replit AI Core',
        brand: 'Replit',
        category: 'software',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 4575 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/REPLIT.png',
        logo_url: '',
        description: '💻 Build Better with AI! Cloud IDE with AI coding assistant.'
    },
    {
        id: '29',
        name: 'QuillBot Premium',
        brand: 'QuillBot',
        category: 'software',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 1850 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/QUILLBOT.png',
        logo_url: '',
        description: '✍️ Write Better! Paraphrasing, grammar check, plagiarism detector.'
    },
    {
        id: '30',
        name: 'Anything AI',
        brand: 'Anything AI',
        category: 'software',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 3750 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/ANYTHING_AI.png',
        logo_url: '',
        description: '🧠 All-in-one AI! Multiple AI models in one subscription.'
    },
    {
        id: '31',
        name: 'Rork AI',
        brand: 'Rork',
        category: 'software',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 5350 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/RORK_AI.png',
        logo_url: '',
        description: '🤖 Build AI Apps! No-code AI application builder.'
    },
    {
        id: '32',
        name: 'Loveable AI',
        brand: 'Loveable',
        category: 'software',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 3750 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/LOVEABLE_AI.png',
        logo_url: '',
        description: '💻 AI Web Builder! Create websites with conversational AI.'
    },

    // ============ VPN & SECURITY ============
    {
        id: '33',
        name: 'NordVPN',
        brand: 'Nord',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 199 },
            { value: '1 Year', price: 1799 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/NORD_VPN.png',
        logo_url: '',
        description: '🛡️ Stay Safe Online! Fast VPN, 5500+ servers, no logs.'
    },
    {
        id: '34',
        name: 'ExpressVPN',
        brand: 'Express',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 350 },
            { value: '6 Months', price: 1799 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/EXPRESS_VPN.png',
        logo_url: '',
        description: '🛡️ Lightning Fast VPN! 94 countries, unlimited bandwidth.'
    },
    {
        id: '35',
        name: 'SurfShark VPN',
        brand: 'SurfShark',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 150 },
            { value: '1 Year', price: 1350 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/SURFSHARK_VPN.png',
        logo_url: '',
        description: '🛡️ Unlimited Devices! Fast VPN with CleanWeb ad blocker.'
    },
    {
        id: '36',
        name: 'CyberGhost VPN',
        brand: 'CyberGhost',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 175 },
            { value: '1 Year', price: 1599 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/CYBERGHOST_VPN.png',
        logo_url: '',
        description: '🛡️ 9000+ Servers! Optimized for streaming & gaming.'
    },

    // ============ PRODUCTIVITY ============
    {
        id: '37',
        name: 'Microsoft 365',
        brand: 'Microsoft',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 249 },
            { value: '1 Year', price: 1500 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/MICROSOFT_OFFICE.png',
        logo_url: '',
        description: '💼 Word, Excel, PowerPoint! 1TB OneDrive cloud storage.'
    },
    {
        id: '38',
        name: 'Google Drive Storage',
        brand: 'Google',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '100GB/Month', price: 150 },
            { value: '200GB/Month', price: 275 },
            { value: '2TB/Month', price: 750 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/GOOGLE_PLAY_INAPP_PURCHASES.png',
        logo_url: '',
        description: '☁️ Expand Your Storage! Google One cloud storage plans.'
    },
    {
        id: '39',
        name: 'iCloud+ Storage',
        brand: 'Apple',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '50GB/Month', price: 150 },
            { value: '200GB/Month', price: 400 },
            { value: '2TB/Month', price: 1350 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/ICLOUD_STORAGE.png',
        logo_url: '',
        description: '☁️ iCloud+ Features! Private Relay, Hide My Email, more storage.'
    },
    {
        id: '40',
        name: 'Grammarly Premium',
        brand: 'Grammarly',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 200 },
            { value: '1 Year', price: 1800 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/QUILLBOT.png',
        logo_url: '',
        description: '✍️ Write Confidently! Advanced grammar, style, plagiarism check.'
    },
    {
        id: '41',
        name: 'Duolingo Super',
        brand: 'Duolingo',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 650 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/DUOLINGO.png',
        logo_url: '',
        description: '🦉 Learn Languages! No ads, unlimited hearts, progress tracking.'
    },
    {
        id: '42',
        name: 'Skillshare Premium',
        brand: 'Skillshare',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 350 },
            { value: '1 Year', price: 2999 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/SKILLSHARE.png',
        logo_url: '',
        description: '🎓 Learn Creative Skills! 30,000+ classes in design, business, more.'
    },
    {
        id: '43',
        name: 'Udemy Course Access',
        brand: 'Udemy',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: 'Any Course', price: 350 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/UDEMY_COURSE_WITH_CERTIFICATION.png',
        logo_url: '',
        description: '🎓 Get Certified! Access any Udemy course with completion certificate.'
    },

    // ============ CREATIVE TOOLS ============
    {
        id: '44',
        name: 'Adobe Express',
        brand: 'Adobe',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 975 },
            { value: '1 Year', price: 9750 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/ADOBE_EXPRESS.png',
        logo_url: '',
        description: '🎨 Design Made Easy! Create graphics, videos, social content.'
    },
    {
        id: '45',
        name: 'Filmora Wondershare',
        brand: 'Filmora',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 975 },
            { value: '1 Year', price: 5999 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/FILMORA.png',
        logo_url: '',
        description: '🎬 Edit Videos Like Pro! Easy editing, effects, transitions.'
    },
    {
        id: '46',
        name: 'Procreate',
        brand: 'Procreate',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: 'Lifetime', price: 1950 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/PROCREATE.png',
        logo_url: '',
        description: '🎨 Digital Art! Professional illustration app for iPad.'
    },
    {
        id: '47',
        name: 'Zoom Workspace',
        brand: 'Zoom',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 1500 },
            { value: '1 Year', price: 14999 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/ZOOM_WORKSPACE.png',
        logo_url: '',
        description: '📹 Pro Video Meetings! No time limit, cloud recording, webinars.'
    },

    // ============ DATING APPS ============
    {
        id: '48',
        name: 'Tinder Gold',
        brand: 'Tinder',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 450 },
            { value: '3 Months', price: 1199 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/TINDER_GOLD.png',
        logo_url: '',
        description: '💘 See Who Likes You! Unlimited likes, passport, no ads.'
    },
    {
        id: '49',
        name: 'Tinder Platinum',
        brand: 'Tinder',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 800 },
            { value: '3 Months', price: 2199 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/TINDER_PLATINUM.png',
        logo_url: '',
        description: '💎 Premium Priority! Message before matching, priority likes.'
    },
    {
        id: '50',
        name: 'Bumble Premium',
        brand: 'Bumble',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Week', price: 399 },
            { value: '1 Month', price: 975 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/BUMBLE.png',
        logo_url: '',
        description: '💛 Boost Your Profile! Beeline, SuperSwipes, unlimited extends.'
    },
    {
        id: '51',
        name: 'Hinge X+',
        brand: 'Hinge',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Week', price: 200 },
            { value: '1 Month', price: 699 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/HINGE.png',
        logo_url: '',
        description: '💘 Better Matches! See who likes you, unlimited likes.'
    },
    {
        id: '52',
        name: 'Happn Premium',
        brand: 'Happn',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 2150 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/HAPPN.png',
        logo_url: '',
        description: '💕 Find Nearby Matches! See who crossed your path.'
    },
    {
        id: '53',
        name: 'Tantan VIP',
        brand: 'Tantan',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 1950 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/TANTAN_VIP.png',
        logo_url: '',
        description: '💕 Asian Dating! Popular in Asia, see who likes you.'
    },

    // ============ SOCIAL MEDIA ============
    {
        id: '54',
        name: 'X (Twitter) Premium',
        brand: 'Twitter',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 1150 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/X(TWITTER)_PREMIUM.png',
        logo_url: '',
        description: '🚀 Get Verified! Blue checkmark, longer posts, edit tweets.'
    },
    {
        id: '55',
        name: 'Snapchat+',
        brand: 'Snapchat',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 150 },
            { value: '1 Year', price: 1399 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/SNAPCHAT+.png',
        logo_url: '',
        description: '👻 Exclusive Features! Custom app icons, story rewatch, more.'
    },
    {
        id: '56',
        name: 'Instagram Verified',
        brand: 'Instagram',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 350 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/INSTAGRAM_VERIFIED.png',
        logo_url: '',
        description: '✓ Blue Badge! Verified badge, priority support, exclusive stickers.'
    },
    {
        id: '57',
        name: 'Meta Verified',
        brand: 'Meta',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 350 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/META_VERIFICATION.png',
        logo_url: '',
        description: '✓ Facebook + Instagram! Verified badge on both platforms.'
    },

    // ============ UTILITIES ============
    {
        id: '58',
        name: 'TrueCaller Premium',
        brand: 'TrueCaller',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 150 },
            { value: '1 Year', price: 1350 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/TRUECALLER.png',
        logo_url: '',
        description: '📞 Know Who\'s Calling! Caller ID, spam blocking, no ads.'
    },
    {
        id: '59',
        name: 'Strava Premium',
        brand: 'Strava',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 650 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/STRAVA.png',
        logo_url: '',
        description: '🏃 Track Your Runs! Advanced analytics, segments, training plans.'
    },
    {
        id: '60',
        name: 'FlightRadar24 Gold',
        brand: 'FlightRadar24',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 1450 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/FLIGHTRADAR24.png',
        logo_url: '',
        description: '✈️ Track Flights! Real-time flight tracking, 3D view, alerts.'
    },
    {
        id: '61',
        name: 'GoPro Premium',
        brand: 'GoPro',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Year', price: 2999 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/GOPRO_PREMIUM.png',
        logo_url: '',
        description: '📸 Cloud Storage! Unlimited backup, camera discounts, replacements.'
    },
    {
        id: '62',
        name: 'Upwork Plus',
        brand: 'Upwork',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 4850 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/UPWORK.png',
        logo_url: '',
        description: '💼 Win More Jobs! Extra connects, profile boost, earnings protection.'
    },
    {
        id: '63',
        name: 'Namecheap Domains',
        brand: 'Namecheap',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Domain', price: 1500 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/NAMECHEAP_DOMAINS.png',
        logo_url: '',
        description: '🌐 Get Your Domain! .com, .io, .dev and more extensions.'
    },
    {
        id: '64',
        name: 'Airalo eSIM',
        brand: 'Airalo',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1GB', price: 599 },
            { value: '5GB', price: 1499 },
            { value: '10GB', price: 2499 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/AIRALO_eSIM.png',
        logo_url: '',
        description: '📱 Travel Data! eSIM for 200+ countries, instant activation.'
    },
    {
        id: '65',
        name: 'Saily eSIM',
        brand: 'Saily',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1GB', price: 499 },
            { value: '3GB', price: 999 },
            { value: '5GB', price: 1399 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/SAILY_eSIM.png',
        logo_url: '',
        description: '📱 Budget Travel Data! By NordVPN, reliable global coverage.'
    },
    {
        id: '66',
        name: 'ExitLag Gaming VPN',
        brand: 'ExitLag',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 599 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/EXITLAG.png',
        logo_url: '',
        description: '🎮 Lower Ping! Gaming VPN for better connection to game servers.'
    },
    {
        id: '67',
        name: 'APEUni PTE VIP',
        brand: 'APEUni',
        category: 'subscriptions',
        region: 'Global',
        denominations: [
            { value: '1 Month', price: 1500 }
        ],
        delivery_type: 'Instant',
        image_url: '/IMAGES/PRODUCTS/APEUNI_PTE_VIP.png',
        logo_url: '',
        description: '📚 PTE Prep! Practice tests, AI scoring, study materials.'
    }
];

// Helper functions
export function getAllProducts(): Product[] {
    return sampleProducts;
}

export function getProductById(id: string): Product | undefined {
    return sampleProducts.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
    if (category === 'all') {
        return sampleProducts;
    }
    return sampleProducts.filter(p => p.category === category);
}

export function getFeaturedProducts(): Product[] {
    return sampleProducts.slice(0, 8);
}

export function searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return sampleProducts.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
}
