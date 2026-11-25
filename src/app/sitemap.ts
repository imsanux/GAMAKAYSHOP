import type { MetadataRoute } from 'next';
import { getAllProducts, getFeaturedProducts } from '@/lib/products';
import { SITE_URL, CATEGORY_SEO } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();
    const allProducts = getAllProducts();
    const featuredIds = new Set(getFeaturedProducts(16).map((p) => p.id));

    const corePages: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        ...Object.keys(CATEGORY_SEO).map((slug) => ({
            url: `${SITE_URL}/category/${slug}`,
            lastModified,
            changeFrequency: 'daily' as const,
            priority: slug === 'all' ? 0.95 : 0.9,
        })),
        {
            url: `${SITE_URL}/guides`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: `${SITE_URL}/support`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/track`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    const productPages: MetadataRoute.Sitemap = allProducts.map((product) => ({
        url: `${SITE_URL}/product/${product.slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: featuredIds.has(product.id) ? 0.9 : 0.8,
    }));

    return [...corePages, ...productPages];
}
