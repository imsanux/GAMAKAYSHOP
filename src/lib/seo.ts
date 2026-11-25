import type { Metadata } from 'next';
import { Product } from './supabase';
import { cleanProductDescription, getDisplayRegion, getProductsByCategory, getAllProducts } from './products';

export const SITE_URL = 'https://gamakay.shop';
export const SITE_NAME = 'Gamakay';
export const DEFAULT_OG_IMAGE = '/og-image.png';

// Secondary duplicate listings mapped to their authoritative canonical product slug
export const CANONICAL_PRODUCT_ALIASES: Record<string, string> = {
    'ea-pro': 'ea-play-pro',
    'espn-plus': 'espn-monthly',
    'filmora-video-editor-pro': 'filmora-wondershare',
    'flight-radar-24-gold-monthly': 'flightradar24-gold',
    'tantan-dating-vip': 'tantan-vip',
    'grok-by-xai': 'grok-x-premium',
    'grok-4-by-xai': 'grok-x-premium',
    'x-twitter-premium': 'grok-x-premium',
    'x-premium-monthly': 'grok-x-premium',
    'snapchat-plus-monthly': 'snapchat',
    'ape-uni-vip': 'apeuni-pte-vip',
    'twitch-sub': 'twitch-prime-sub',
    'icloud-plus-200gb-monthly': 'icloud-storage',
    'exitlag-renewable': 'exitlag-gaming-vpn',
    'chatgpt-shared': 'chatgpt-plus',
    'chatgpt-plus-monthly': 'chatgpt-plus',
    'udemy-courses-with-certifications': 'udemy-course-access',
};

export interface CategorySeoConfig {
    slug: string;
    name: string;
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    ogAlt: string;
}

export const CATEGORY_SEO: Record<string, CategorySeoConfig> = {
    all: {
        slug: 'all',
        name: 'All Gift Cards & Subscriptions',
        title: 'All Digital Gift Cards & Plans in Nepal',
        description:
            'Browse 125+ digital gift cards & subscriptions in Nepal. Steam, PlayStation, Apple, Netflix, Spotify, ChatGPT & Claude AI with eSewa, Khalti & WhatsApp delivery.',
        keywords: [
            'buy gift cards Nepal',
            'all digital gift cards Nepal',
            'online gift card store Nepal',
            'gift cards Kathmandu',
            'eSewa gift cards Nepal',
            'Khalti gift cards Nepal',
            'digital subscriptions Nepal',
            'Steam PlayStation Apple Netflix Nepal',
        ],
        ogImage: DEFAULT_OG_IMAGE,
        ogAlt: 'All Digital Gift Cards and Subscriptions in Nepal - Gamakay',
    },
    gaming: {
        slug: 'gaming',
        name: 'Gaming Gift Cards',
        title: 'Gaming Gift Cards in Nepal: Steam, PSN & Xbox',
        description:
            'Buy Steam Wallet (US & India), PlayStation PSN, Xbox Game Pass & Nintendo eShop gift cards in Nepal. Pay via eSewa or Khalti with fast WhatsApp delivery.',
        keywords: [
            'gaming gift cards Nepal',
            'buy Steam gift card Nepal',
            'Steam Wallet code Nepal',
            'PlayStation gift card Nepal',
            'PSN card USD INR Nepal',
            'PlayStation Plus Nepal',
            'Xbox Game Pass Ultimate Nepal',
            'Xbox gift card Nepal',
            'Nintendo eShop gift card Nepal',
            'Valorant Riot Points Nepal',
            'Roblox Robux Nepal',
            'buy games in Nepal eSewa Khalti',
        ],
        ogImage: '/IMAGES/webpmobile/Playstation_mobile.webp',
        ogAlt: 'Buy Gaming Gift Cards in Nepal - PlayStation, Steam, Xbox & Nintendo',
    },
    streaming: {
        slug: 'streaming',
        name: 'Streaming & Music Subscriptions',
        title: 'Netflix, Spotify & Streaming Plans in Nepal',
        description:
            'Buy Netflix 4K, Spotify Premium, YouTube Premium, Crunchyroll & Discord Nitro in Nepal. Pay with eSewa, Khalti or bank transfer with fast WhatsApp delivery.',
        keywords: [
            'streaming subscriptions Nepal',
            'buy Netflix Nepal',
            'Netflix subscription price in Nepal',
            'Spotify Premium Nepal',
            'YouTube Premium Nepal',
            'Crunchyroll Premium Nepal',
            'Apple Music Nepal',
            'Discord Nitro Nepal',
            'Prime Video Nepal',
            'buy Netflix with eSewa Khalti',
        ],
        ogImage: '/IMAGES/webpmobile/Netflix_mobile_new.webp',
        ogAlt: 'Buy Streaming & Music Subscriptions in Nepal - Netflix, Spotify & Crunchyroll',
    },
    software: {
        slug: 'software',
        name: 'AI Tools & Software Subscriptions',
        title: 'Claude, ChatGPT, VPN & AI Tools in Nepal',
        description:
            'Order Claude AI Pro, ChatGPT Plus, Cursor AI, Grok, Gemini Pro & NordVPN in Nepal. Pay via eSewa, Khalti or bank transfer with fast WhatsApp delivery.',
        keywords: [
            'AI subscriptions Nepal',
            'buy Claude AI Pro Nepal',
            'ChatGPT Plus Nepal',
            'ChatGPT subscription price Nepal',
            'Cursor AI Pro Nepal',
            'Grok and X Premium Nepal',
            'ElevenLabs Nepal',
            'Gemini AI Pro Nepal',
            'Perplexity Pro Nepal',
            'NordVPN Nepal',
            'ExpressVPN Nepal',
            'Microsoft 365 Nepal',
            'buy software in Nepal eSewa Khalti',
        ],
        ogImage: '/IMAGES/webpmobile/AI_mobile.webp',
        ogAlt: 'Buy AI Tools & Software Subscriptions in Nepal - Claude, ChatGPT & VPNs',
    },
    'dating-social': {
        slug: 'dating-social',
        name: 'Dating & Social Media Subscriptions',
        title: 'Dating & Social Plans in Nepal: Tinder, Telegram & Meta',
        description:
            'Buy Tinder Gold, Bumble Premium, Hinge, Telegram Premium, Instagram Plus, Snapchat+ & Meta One in Nepal via eSewa, Khalti & fast WhatsApp delivery.',
        keywords: [
            'dating subscriptions Nepal',
            'social media subscriptions Nepal',
            'Tinder Gold Nepal',
            'Tinder Platinum Nepal',
            'Bumble Premium Nepal',
            'HingeX Nepal',
            'Telegram Premium Nepal',
            'Instagram Verified Nepal',
            'Instagram Plus Nepal',
            'Snapchat Plus Nepal',
            'Meta One Nepal',
            'Facebook Plus Nepal',
            'WhatsApp Plus Nepal',
        ],
        ogImage: '/IMAGES/BANNERS/Dating.webp',
        ogAlt: 'Buy Dating & Social Media Subscriptions in Nepal - Tinder, Bumble, Telegram & Instagram',
    },
    subscriptions: {
        slug: 'subscriptions',
        name: 'Apps, Apple & Creator Subscriptions',
        title: 'Apple Gift Cards, iCloud+ & Apps in Nepal',
        description:
            'Buy Apple Gift Cards (USD & INR), iCloud+, Canva Pro, Adobe, CapCut Pro, Duolingo & travel eSIMs in Nepal with eSewa, Khalti & fast WhatsApp delivery.',
        keywords: [
            'app subscriptions Nepal',
            'Apple gift card Nepal',
            'iTunes gift card Nepal',
            'iCloud storage Nepal',
            'Canva Pro Nepal',
            'Adobe Creative Cloud Nepal',
            'CapCut Pro Nepal',
            'Duolingo Super Nepal',
            'Coursera Plus Nepal',
            'Skillshare Premium Nepal',
            'Telegram Premium Nepal',
            'Meta One Nepal',
            'Suno AI Pro Nepal',
            'travel eSIM Nepal',
            'digital subscriptions Kathmandu',
        ],
        ogImage: '/IMAGES/webpmobile/Applegiftcard_mobile.webp',
        ogAlt: 'Buy Apple Gift Cards, iCloud+, Canva Pro & Subscriptions in Nepal',
    },
};

export function toAbsoluteUrl(path?: string): string {
    if (!path) return `${SITE_URL}${DEFAULT_OG_IMAGE}`;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function truncateAtWord(text: string, maxLength: number): string {
    const clean = text.replace(/\s+/g, ' ').trim();
    if (clean.length <= maxLength) return clean;
    const sliced = clean.slice(0, maxLength - 1);
    const lastSpace = sliced.lastIndexOf(' ');
    const base = lastSpace > maxLength * 0.6 ? sliced.slice(0, lastSpace) : sliced;
    return `${base.replace(/[,;:\-]+$/, '').trim()}.`;
}

export function getPriceRange(product: Product): { min: number; max: number } {
    const prices = product.denominations
        .map((d) => d.price)
        .filter((p) => typeof p === 'number' && p > 0);
    if (prices.length === 0) return { min: 0, max: 0 };
    return {
        min: Math.min(...prices),
        max: Math.max(...prices),
    };
}

const CATEGORY_LABEL_MAP: Record<string, string> = {
    gaming: 'Gaming Gift Cards',
    streaming: 'Streaming & Music',
    software: 'Software & AI',
    'dating-social': 'Dating & Social',
    subscriptions: 'Apps & Subscriptions',
};

export function buildProductSeoTitle(name: string, minPrice: number): string {
    const priceTag = minPrice > 0 ? ` (Rs. ${minPrice.toLocaleString()})` : '';
    const brandSuffix = ' | Gamakay';

    // Tier 1: Full action + name + Nepal + price (<= 63 chars)
    const t1 = `Buy ${name} in Nepal${priceTag}${brandSuffix}`;
    if (t1.length <= 63) return t1;

    // Tier 2: Name + Nepal + price (<= 64 chars)
    const t2 = `${name} Nepal${priceTag}${brandSuffix}`;
    if (t2.length <= 64) return t2;

    // Tier 3: Compact name (strip trailing parenthetical / redundant suffix) + Nepal + price (<= 64 chars)
    const compact = name
        .replace(/\s*\([^)]*\)\s*$/g, '')
        .replace(/\s+(?:Monthly|Subscription|Membership|Bundle|Access|Pass)$/i, '')
        .trim();
    const t3 = `${compact} Nepal${priceTag}${brandSuffix}`;
    if (t3.length <= 64) return t3;

    // Tier 4: Compact name + price without brand suffix if still long
    const t4 = `${compact} in Nepal${priceTag}`;
    if (t4.length <= 64) return t4;

    return `${truncateAtWord(compact, 42).replace(/\.$/, '')} Nepal${priceTag}`;
}

export function buildProductMetadata(product: Product): Metadata {
    const { min } = getPriceRange(product);
    const region = getDisplayRegion(product);
    const nameLower = product.name.toLowerCase();
    const regionAlreadyInName =
        (region === 'US & India' && (nameLower.includes('us') || nameLower.includes('india'))) ||
        (region === 'US' && /\busd\b|\busa\b|\bus\b/.test(nameLower)) ||
        (region === 'India' && /\binr\b|\bindia\b/.test(nameLower));
    const regionSuffix = region !== 'Global' && !regionAlreadyInName ? ` (${region})` : '';

    const primarySlug = CANONICAL_PRODUCT_ALIASES[product.slug] || product.slug;
    const isDuplicateAlias = Boolean(CANONICAL_PRODUCT_ALIASES[product.slug]);
    const canonicalUrl = `${SITE_URL}/product/${primarySlug}`;
    const ogImage = toAbsoluteUrl(product.image_url);

    const absoluteTitle = buildProductSeoTitle(product.name, min);
    const priceSnippet = min > 0 ? ` from Rs. ${min.toLocaleString()}` : '';

    // Build high-CTR Nepal-targeted meta description (130-160 chars)
    const denomSample =
        product.denominations.length > 1
            ? ` Options: ${product.denominations
                  .slice(0, 3)
                  .map((d) => d.value)
                  .join(', ')}.`
            : '';

    const rawLead = `Buy ${product.name}${regionSuffix} in Nepal${priceSnippet}.${denomSample} Pay with eSewa, Khalti or bank transfer and get fast 5-15 min WhatsApp delivery.`;

    let description = rawLead;
    if (description.length > 160) {
        description = `Buy ${product.name}${regionSuffix} in Nepal${priceSnippet}. Pay via eSewa, Khalti or bank transfer with fast 5-15 min WhatsApp delivery.`;
    }
    if (description.length > 160) {
        description = truncateAtWord(description, 158);
    }

    const categoryLabel = CATEGORY_LABEL_MAP[product.category] || 'Digital Gift Cards';
    const keywords = Array.from(
        new Set([
            `buy ${product.name} Nepal`,
            `${product.name} price in Nepal`,
            `${product.name} Nepal`,
            `${product.brand} Nepal`,
            `${product.brand} gift card Nepal`,
            `${product.name} eSewa Khalti`,
            `${product.name} WhatsApp delivery`,
            `${categoryLabel} Nepal`,
            'digital gift cards Nepal',
            'Gamakay Nepal',
        ])
    );

    return {
        title: {
            absolute: absoluteTitle,
        },
        description,
        keywords,
        robots: isDuplicateAlias
            ? { index: false, follow: true }
            : { index: true, follow: true },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'en-NP': canonicalUrl,
                'x-default': canonicalUrl,
            },
        },
        openGraph: {
            type: 'website',
            locale: 'en_NP',
            url: canonicalUrl,
            siteName: SITE_NAME,
            title: absoluteTitle,
            description,
            images: [
                {
                    url: ogImage,
                    width: 800,
                    height: 800,
                    alt: `${product.name} in Nepal - Gamakay`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            site: '@gamakaynepal',
            creator: '@gamakaynepal',
            title: absoluteTitle,
            description,
            images: [ogImage],
        },
    };
}

export function buildProductJsonLd(product: Product) {
    const { min, max } = getPriceRange(product);
    const region = getDisplayRegion(product);
    const url = `${SITE_URL}/product/${product.slug}`;
    const image = toAbsoluteUrl(product.image_url);
    const availability = product.in_stock !== false
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock';

    const cleanedDesc = cleanProductDescription(product.description).split('\n')[0]?.trim() || '';
    const seoDescription =
        cleanedDesc.length >= 40
            ? (cleanedDesc.toLowerCase().includes('nepal')
                  ? truncateAtWord(cleanedDesc, 300)
                  : `${truncateAtWord(cleanedDesc, 240)} Available in Nepal via Gamakay with fast WhatsApp delivery.`)
            : `Buy ${product.name} (${region}) in Nepal from Rs. ${min.toLocaleString()} with eSewa, Khalti or bank transfer and fast 5-15 minute WhatsApp delivery.`;

    const seller = {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
    };

    const merchantReturnPolicy = {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'NP',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
    };

    const shippingDetails = {
        '@type': 'OfferShippingDetails',
        shippingRate: {
            '@type': 'MonetaryAmount',
            value: 0,
            currency: 'NPR',
        },
        shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'NP',
        },
        deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 0,
                maxValue: 0,
                unitCode: 'DAY',
            },
            transitTime: {
                '@type': 'QuantitativeValue',
                minValue: 0,
                maxValue: 0,
                unitCode: 'DAY',
            },
        },
    };

    const priceValidUntil = '2027-12-31';

    const individualOffers = product.denominations.map((d) => ({
        '@type': 'Offer',
        name: `${product.name} - ${d.value}`,
        priceCurrency: 'NPR',
        price: d.price,
        priceValidUntil,
        availability,
        itemCondition: 'https://schema.org/NewCondition',
        url,
        seller,
        hasMerchantReturnPolicy: merchantReturnPolicy,
        shippingDetails,
        areaServed: {
            '@type': 'Country',
            name: 'Nepal',
        },
    }));

    const offers =
        individualOffers.length > 1
            ? {
                  '@type': 'AggregateOffer',
                  priceCurrency: 'NPR',
                  lowPrice: min,
                  highPrice: max,
                  offerCount: individualOffers.length,
                  availability,
                  url,
                  offers: individualOffers,
              }
            : individualOffers[0];

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: seoDescription,
        image: [image],
        sku: `GMK-${product.id}`,
        brand: {
            '@type': 'Brand',
            name: product.brand,
        },
        category: CATEGORY_LABEL_MAP[product.category] || 'Digital Gift Cards',
        url,
        offers,
    };

    const categorySlug = CATEGORY_SEO[product.category] ? product.category : 'all';
    const categoryName = CATEGORY_SEO[categorySlug]?.name || 'All Products';

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: SITE_URL,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: categoryName,
                item: `${SITE_URL}/category/${categorySlug}`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: product.name,
                item: url,
            },
        ],
    };

    return { productSchema, breadcrumbSchema };
}

export function buildCategoryMetadata(slug: string): Metadata {
    const config = CATEGORY_SEO[slug] ?? CATEGORY_SEO.all;
    const canonicalUrl = `${SITE_URL}/category/${config.slug}`;
    const ogImage = toAbsoluteUrl(config.ogImage);

    return {
        title: config.title,
        description: config.description,
        keywords: config.keywords,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'en-NP': canonicalUrl,
                'x-default': canonicalUrl,
            },
        },
        openGraph: {
            type: 'website',
            locale: 'en_NP',
            url: canonicalUrl,
            siteName: SITE_NAME,
            title: `${config.title} | Gamakay Nepal`,
            description: config.description,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: config.ogAlt,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            site: '@gamakaynepal',
            creator: '@gamakaynepal',
            title: `${config.title} | Gamakay Nepal`,
            description: config.description,
            images: [ogImage],
        },
    };
}

export function buildCategoryJsonLd(slug: string) {
    const config = CATEGORY_SEO[slug] ?? CATEGORY_SEO.all;
    const url = `${SITE_URL}/category/${config.slug}`;
    const products = config.slug === 'all' ? getAllProducts() : getProductsByCategory(config.slug);

    const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: config.title,
        description: config.description,
        url,
        inLanguage: 'en-NP',
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: products.length,
            itemListElement: products.slice(0, 30).map((p, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `${SITE_URL}/product/${p.slug}`,
                name: p.name,
            })),
        },
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: SITE_URL,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: config.name,
                item: url,
            },
        ],
    };

    return { collectionSchema, breadcrumbSchema };
}
