import { Product } from './supabase';
import productsData from '../data/products.json';

// Currency: Nepali Rupees (Rs.)
// Prices synced from Hamrobazar - January 2026

export const sampleProducts = productsData as Product[];

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
    const bestSellerOrder = [
        'Apple Gift Card INR',
        'Steam Giftcards US & INDIA',
        'PlayStation Giftcards INR',
        'Grok by xAI',
        'Suno AI Pro',
        'Netflix Monthly',
        'Apple Music',
        'Crunchyroll Premium',
        'Tinder Gold'
    ];
    const productMap = new Map(sampleProducts.map(p => [p.name, p]));
    return bestSellerOrder.map(name => productMap.get(name)).filter(Boolean) as Product[];
}

export function searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return sampleProducts.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
}
