import { Product } from './supabase';
import productsData from '../data/products.json';

// Currency: Nepali Rupees (Rs.)
// Prices synced from Hamrobazar - January 2026

// Secondary duplicate SKUs hidden from storefront grids and redirected to primary canonical URLs
const DUPLICATE_ALIAS_SLUGS = new Set([
    'ea-pro',
    'espn-plus',
    'filmora-video-editor-pro',
    'flight-radar-24-gold-monthly',
    'tantan-dating-vip',
    'snapchat-plus-monthly',
    'ape-uni-vip',
    'twitch-sub',
    'icloud-plus-200gb-monthly',
    'exitlag-renewable',
]);

export const sampleProducts = productsData as Product[];
const canonicalProducts = sampleProducts.filter(p => !DUPLICATE_ALIAS_SLUGS.has(p.slug));

export function getAllProducts(): Product[] {
    return canonicalProducts;
}

export function getProductById(id: string): Product | undefined {
    return sampleProducts.find(p => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
    return sampleProducts.find(p => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
    if (category === 'all') {
        return canonicalProducts;
    }
    return canonicalProducts.filter(p => p.category === category);
}

export function getFeaturedProducts(count = 8): Product[] {
    const bestSellerSlugs = [
        'playstation-giftcards-inr',
        'apple-gift-card-inr',
        'steam-giftcards-us-india',
        'netflix-monthly',
        'apple-music',
        'claude-ai-anthropic',
        'chatgpt-plus',
        'crunchyroll-premium',
        'udemy-course-access',
        'elevenlabs-ai-voice',
        'instagram-verified',
        'procreate',
        'playstation-giftcards-usd',
        'apple-gift-card-usd',
        'spotify-premium',
        'grok-x-premium',
    ];
    const productMap = new Map(sampleProducts.map(p => [p.slug, p]));
    const ordered = bestSellerSlugs
        .map(slug => productMap.get(slug))
        .filter(Boolean) as Product[];

    return ordered.slice(0, count);
}

export function getDisplayRegion(product: Pick<Product, 'name' | 'region'>): string {
    const raw = (product.region || '').trim();
    const name = product.name.toLowerCase();
    if (!raw || raw.toLowerCase() === 'global') {
        if ((name.includes('us') && name.includes('india')) || (name.includes('usd') && name.includes('inr'))) {
            return 'US & India';
        }
        if (/\busd\b|\busa\b|\bus\b/.test(name)) return 'US';
        if (/\binr\b|\bindia\b/.test(name)) return 'India';
        return 'Global';
    }
    return raw;
}

const CP1252_TO_BYTE: Record<number, number> = {
    0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85, 0x2020: 0x86,
    0x2021: 0x87, 0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A, 0x2039: 0x8B, 0x0152: 0x8C,
    0x017D: 0x8E, 0x2018: 0x91, 0x2019: 0x92, 0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95,
    0x2013: 0x96, 0x2014: 0x97, 0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B,
    0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F,
};

function repairMojibake(str: string): string {
    if (!/ðŸ|â€|âœ|Â|ð /.test(str)) return str;
    // Recover clipped Windows-1252 smart apostrophes before byte decoding
    const preFixed = str.replace(/â€([a-zA-Z])/g, "'$1");
    const bytes: number[] = [];
    const encoder = new TextEncoder();
    for (const ch of preFixed) {
        const code = ch.codePointAt(0) ?? 0;
        if (code <= 0xFF) {
            bytes.push(code);
        } else if (CP1252_TO_BYTE[code] !== undefined) {
            bytes.push(CP1252_TO_BYTE[code]);
        } else {
            const encoded = encoder.encode(ch);
            for (let i = 0; i < encoded.length; i++) bytes.push(encoded[i]);
        }
    }
    try {
        return new TextDecoder('utf-8', { fatal: false })
            .decode(new Uint8Array(bytes))
            .replace(/\uFFFD/g, '');
    } catch {
        return preFixed;
    }
}

export function cleanProductDescription(raw?: string): string {
    if (!raw) return '';
    let s = repairMojibake(raw);
    s = s.replace(/⚠️\s*NOTICE:[^\n]*\n*/gi, '');
    s = s.replace(
        /(?:Order\s+Now\s*:\s*)?(?:Contact(?:\s+via)?\s*:\s*)?Viber\s*\/?\s*WhatsApp\s*[:–-]?\s*[\d\s\u{1D7CE}-\u{1D7FF}]*(?:(?:or\s+)?(?:scan\s+the\s+QR(?:\s+code)?(?:\s+to\s+get\s+started)?)|(?:to\s+order))?[!.]*/giu,
        ' '
    );
    s = s.replace(/(?:or\s+)?scan\s+the\s+QR(?:\s+code)?(?:\s+to\s+get\s+started)?[!.]*/gi, ' ');
    // Strip pictographs & decorative math-bold numerals while preserving normal prose & punctuation
    s = s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{1D400}-\u{1D7FF}\uFE0F\u200D]/gu, '');
    s = s.replace(/\s*—\s*/g, ', ');

    const lines = s
        .split('\n')
        .map(line => line.replace(/\s{2,}/g, ' ').trim())
        .filter(Boolean);
    let joined = lines.join('\n').trim();

    // Detect single-line CSV scrapes that cut off mid-sentence (~90-145 chars without terminal punctuation)
    const wasTruncatedScrape =
        !raw.includes('\n') && raw.length >= 90 && raw.length <= 145 && !/[.!?]$/.test(raw.trim());
    if (wasTruncatedScrape) {
        const complete = joined.match(/(?:[^.!?]|\d\.\d)+[.!?](?=\s|$)/g);
        joined = complete ? complete.map(part => part.trim()).join(' ') : '';
    }

    return joined.trim();
}

export function searchProducts(query: string): Product[] {
    const lowerQuery = query.trim().toLowerCase();
    if (!lowerQuery) return [];
    return canonicalProducts.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        (p.region && p.region.toLowerCase().includes(lowerQuery)) ||
        (p.description && p.description.toLowerCase().includes(lowerQuery))
    );
}
